import { createClient } from '../../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateProofReport } from '../../../../lib/services/gemini';
import { checkPlanLimits } from '../../../../lib/utils/plan-guard';
import { logger } from '../../../../lib/utils/logger';

export async function POST(request) {
  try {
    const supabase = createClient();
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const { beforeImageBase64, afterImageBase64, workDescription, technicianName, beforeImageUrl, afterImageUrl } = await request.json();
    if (!workDescription) {
      return NextResponse.json({ error: "Work Description is a required parameter." }, { status: 400 });
    }

    // 2. Fetch subscription plan & generations count
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      logger.error("Subscription retrieval database error in report route.", subError, { user_id: user.id });
    }

    const activeSub = subscription || { plan_type: 'free', monthly_generations_used: 0, status: 'active' };

    // 3. Enforce plan limits
    const limitCheck = checkPlanLimits(activeSub, 'generation');
    if (!limitCheck.allowed) {
      logger.warn("Proof report blocked due to active quota limits.", { user_id: user.id, plan: activeSub.plan_type });
      return NextResponse.json({ error: limitCheck.reason }, { status: 403 });
    }

    // 4. Fetch User SEO settings
    const { data: seoSettings, error: seoError } = await supabase
      .from('seo_settings')
      .select('answers')
      .eq('user_id', user.id)
      .maybeSingle();

    if (seoError) {
      logger.error("SEO answers database error in report route.", seoError, { user_id: user.id });
    }

    const answers = seoSettings?.answers || {
      companyName: "John's Emergency Plumbing",
      ownerName: "John Brown",
      websiteUrl: "https://johnsplumbing.nl",
      phone: "+31 6 12345678",
      primaryLocation: "Amsterdam Zuid",
      tone: "professional, trustworthy, and neighborly",
      ctaText: "Facing a leak? Call John directly for 30-minute emergency arrival!"
    };

    // 5. Generate Technician summary with Google Gemini API (including multimodal image analysis)
    const reportText = await generateProofReport({
      beforeImageBase64,
      afterImageBase64,
      workDescription,
      seoAnswers: answers
    });

    // 6. Save job report details in database
    const { data: reportRecord, error: insertError } = await supabase
      .from('job_reports')
      .insert({
        user_id: user.id,
        technician_name: technicianName || answers.ownerName || "Technician",
        work_description: workDescription,
        before_image_url: beforeImageUrl || null,
        after_image_url: afterImageUrl || null,
        compiled_pdf_url: null, // to be updated when generated
        is_watermarked: activeSub.plan_type === 'free'
      })
      .select()
      .single();

    if (insertError) {
      logger.error("Failed to insert completed job report record.", insertError, { user_id: user.id });
    }

    // 7. Increment generations usage counter
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ monthly_generations_used: activeSub.monthly_generations_used + 1 })
      .eq('user_id', user.id);

    if (updateError) {
      logger.error("Failed to update subscription generation quota count.", updateError, { user_id: user.id });
    }

    // Capture telemetry metrics
    logger.logAIGeneration({
      userId: user.id,
      platform: "Before & After PDF Report",
      contentLength: "long-technical",
      status: "success",
      costTokens: Math.round(reportText.length / 4)
    });

    if (beforeImageUrl || afterImageUrl) {
      logger.logStorageUpload({
        userId: user.id,
        bucketName: "job-photos",
        sizeBytes: 150 * 1024, // Approx placeholder telemetry size
        fileType: "image/jpeg",
        status: "success"
      });
    }

    return NextResponse.json({
      success: true,
      reportText: reportText,
      reportId: reportRecord?.id,
      isWatermarked: activeSub.plan_type === 'free',
      generationsUsed: activeSub.monthly_generations_used + 1,
      planType: activeSub.plan_type
    });

  } catch (error) {
    logger.error("Critical failure during report summary compilation API execution.", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred during AI report description compilation. Please try again." 
    }, { status: 500 });
  }
}
