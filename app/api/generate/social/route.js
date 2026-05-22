import { createClient } from '../../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateSocialPost } from '../../../../lib/services/gemini';
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

    const { platform, length, workDescription } = await request.json();
    if (!platform || !workDescription) {
      return NextResponse.json({ error: "Platform and Work Description are required parameters." }, { status: 400 });
    }

    // 2. Fetch Subscription plan & generations count
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      logger.error("Subscription retrieval database error in social route.", subError, { user_id: user.id });
    }

    const activeSub = subscription || { plan_type: 'free', monthly_generations_used: 0, status: 'active' };

    // 3. Enforce plan limits
    const limitCheck = checkPlanLimits(activeSub, 'generation');
    if (!limitCheck.allowed) {
      logger.warn("Social generation blocked due to active quota limits.", { user_id: user.id, plan: activeSub.plan_type });
      return NextResponse.json({ error: limitCheck.reason }, { status: 403 });
    }

    // Enforce Pro features like long-form posts
    let verifiedLength = length;
    if (length === 'long' && activeSub.plan_type === 'free') {
      verifiedLength = 'medium'; // downgrade length to medium for free users gracefully
    }

    // 4. Fetch User SEO settings
    const { data: seoSettings, error: seoError } = await supabase
      .from('seo_settings')
      .select('answers')
      .eq('user_id', user.id)
      .maybeSingle();

    if (seoError) {
      logger.error("SEO answers retrieval database error in social route.", seoError, { user_id: user.id });
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

    // 5. Generate content with Google Gemini API
    const generatedText = await generateSocialPost({
      platform,
      length: verifiedLength,
      seoAnswers: answers,
      workDescription
    });

    // 6. Persist Social Post in Database for history
    const { error: insertError } = await supabase
      .from('social_posts')
      .insert({
        user_id: user.id,
        platform,
        content_length: verifiedLength,
        generated_text: generatedText
      });

    if (insertError) {
      logger.error("Failed to insert generated social post to database.", insertError, { user_id: user.id });
    }

    // 7. Increment generations usage counter
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ monthly_generations_used: activeSub.monthly_generations_used + 1 })
      .eq('user_id', user.id);

    if (updateError) {
      logger.error("Failed to update subscription count in database.", updateError, { user_id: user.id });
    }

    // Capture telemetry metrics
    logger.logAIGeneration({
      userId: user.id,
      platform: platform,
      contentLength: verifiedLength,
      status: "success",
      costTokens: Math.round(generatedText.length / 4)
    });

    return NextResponse.json({
      success: true,
      text: generatedText,
      generationsUsed: activeSub.monthly_generations_used + 1,
      planType: activeSub.plan_type
    });

  } catch (error) {
    logger.error("Critical failure during social post generation API route execution.", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred during AI social post generation. Please try again." 
    }, { status: 500 });
  }
}
