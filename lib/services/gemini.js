/**
 * Google Gemini Generative AI Service Wrapper for ProofFlow AI.
 * Handles server-side fetches to 'gemini-1.5-flash' with custom local SEO prompts
 * and multimodal image support.
 */

// Helper to convert Google Gemini fetch call
async function callGeminiAPI(prompt, base64Images = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Build content parts
  const parts = [{ text: prompt }];

  // Append base64 multimodal images
  base64Images.forEach((img) => {
    if (img && img.data && img.mimeType) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data.replace(/^data:image\/\w+;base64,/, "") // strip out data url prefix if present
        }
      });
    }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResult) {
    throw new Error("Empty response returned from Google Gemini model.");
  }

  return textResult;
}

/**
 * Compiles a rich local SEO context block based on user settings
 */
function buildLocalSEOContext(seoAnswers) {
  const company = seoAnswers.companyName || "Our Business";
  const owner = seoAnswers.ownerName || "Owner";
  const services = seoAnswers.services || "services";
  const specialization = seoAnswers.specialization || "specialized services";
  const tradeCategory = seoAnswers.tradeCategory || "handyman services";
  
  const primaryLoc = seoAnswers.primaryLocation || "local areas";
  const secondaryLocs = seoAnswers.targetLocations || "";
  const keywords = seoAnswers.targetKeywords || "";
  const secondKeywords = seoAnswers.secondaryKeywords || "";
  
  const tone = seoAnswers.tone || "professional, friendly, and trustworthy";
  const values = seoAnswers.customerValues || "quality workmanship, transparent pricing, clean work area";
  
  const guarantee = seoAnswers.signatureGuarantee || "Satisfaction Guarantee";
  const warranty = seoAnswers.warrantyDuration || "Workmanship warranty";
  const cta = seoAnswers.ctaText || "Contact us today for a free estimate!";
  const website = seoAnswers.websiteUrl || "";
  const phone = seoAnswers.phone || "";

  return `
--- BUSINESS PROFILE & LOCAL SEO DATA CONTEXT ---
* COMPANY BRAND: "${company}" (managed by ${owner}, trade category: ${tradeCategory})
* SERVICES OFFERED: ${services}
* SPECIALIZATION STRENGTH: ${specialization}
* PRIMARY LOCAL CITY: "${primaryLoc}"
* TARGET SERVICE AREAS: [${secondaryLocs}]
* TARGET SEARCH KEYWORDS TO INJECT: [${keywords}, ${secondKeywords}]
* BRAND STYLE & VOICE TONE: ${tone}
* CORE CUSTOMER VALUE PROPOSITION: ${values}
* TRUST GUARANTEE: "${guarantee}" (${warranty})
* STRATEGIC CALL-TO-ACTION (CTA): "${cta}"
* CONTACT CONTACTS: Website: ${website} | Phone: ${phone}
------------------------------------------------
`;
}

/**
 * Centralized High-Quality Prompt System Architecture
 */
export const PROMPT_REGISTRY = {
  'Google Business Profile': (seoBlock, workDesc, length) => `
You are an expert Local SEO marketer specializing in optimizing Google Business Profile (GBP) posts.
Your objective is to generate a highly professional, keyword-rich local updates post for:
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. Inject the primary city location and target service areas naturally to trigger Google's local indexing algorithms.
2. Weave in service-specific search keywords.
3. Adopt the business's specified communication tone.
4. Conclude with the company's Call-To-Action (CTA) and phone/website contact info.
5. LENGTH REGULATION: Generate a ${length === 'short' ? 'short (1-2 sentences) hyper-focused' : length === 'medium' ? 'medium (1-2 paragraphs) detailed' : 'long (3 paragraphs, step-by-step showcase)'} post.
6. Keep the post structured and professional. Avoid excessive emojis (max 2-3). Do not use hashtags (GBP posts rank better without hashtag clusters).
`,

  'Facebook': (seoBlock, workDesc, length) => `
You are a social media copywriter specializing in local service Facebook marketing.
Create an engaging, social-proof, and friendly Facebook post showcasing real work for:
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. Make it feel highly community-focused. Reference the primary neighborhood and surrounding target locations to build local relevance.
2. Highlight customer values (speed, spotless cleanups, durability).
3. Ensure the tone is friendly, helpful, and trustworthy.
4. Embed the company's trust guarantee to alleviate standard homeowner booking friction.
5. Conclude with a warm CTA asking users to comment, message, or call.
6. LENGTH REGULATION: Generate a ${length === 'short' ? 'short, punching visual hook' : length === 'medium' ? 'medium (150 words) story-telling' : 'long (detailed post outlining the problem, technician steps taken, and results)'} text.
7. Include 3-5 high-relevance hashtags at the end, utilizing the brand's preset keywords.
`,

  'Instagram': (seoBlock, workDesc, length) => `
You are a premium social media expert specializing in trade-business Instagram visual storytelling.
Generate a captivating, trendy caption designed to be accompanied by a Before/After visual comparison:
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. Start with an arresting visual hook (first line must capture immediate attention).
2. Showcase the transformation. Use clean spacing and structured short sentences.
3. Reference the local city/neighborhood to build geo-relevance.
4. Focus on the transformation benefits (e.g. from broken/messy to clean/pristine).
5. Conclude with the specific CTA and link reference (e.g., "Tap the link in bio to book!").
6. LENGTH REGULATION: Generate a ${length === 'short' ? 'short minimalist (under 50 words)' : length === 'medium' ? 'medium storytelling (100 words)' : 'long descriptive guide with bulleted benefits'} caption.
7. End with an optimized block of 10 localized hashtags (e.g. #CityPlumber, #BeforeAfter, #TradeQuality).
`,

  'LinkedIn': (seoBlock, workDesc, length) => `
You are a corporate communications manager and B2B marketer.
Write a professional, industry-authority, and quality-centric LinkedIn update showcasing operational excellence for:
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. Frame the project as a case study of quality craftsmanship, safety, and business-to-consumer trust.
2. Focus on specialized techniques, premium materials used, structural durability, and lifetime compliance.
3. Adopt a professional, authority, and highly competent business tone.
4. Focus on the value of supporting local trade infrastructure in the service region.
5. Highlight the warranties and guarantees as indicators of professional standards.
6. LENGTH REGULATION: Generate a ${length === 'short' ? 'short, professional update' : length === 'medium' ? 'medium industry-focused review' : 'long detailed case study with key metrics and technician steps'} post.
7. Include 2-3 corporate and industry hashtags (e.g., #LocalBusiness, #QualityCraftsmanship, #Trades).
`,

  'X/Twitter': (seoBlock, workDesc, length) => `
You are a micro-blogging expert. Generate a punchy, high-impact post optimized for X (Twitter):
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. MUST BE STRICTLY UNDER 260 CHARACTERS. No exceptions.
2. Include the primary city name and core service keyword.
3. State the before/after results cleanly.
4. Conclude with a shortened CTA and contact detail.
5. Keep it punchy, dynamic, and professional. Use 1 emoji maximum.
`,

  'Pinterest': (seoBlock, workDesc, length) => `
You are an expert Pinterest copywriter focusing on home improvement and DIY inspiration.
Generate a searchable, detail-oriented Pin Description targeting homeowners:
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. Incorporate keyword-rich sentences detailing home repair, maintenance, and upgrade ideas.
2. Emphasize home value preservation, premium components, and aesthetic styling.
3. Focus on standard terms like "Home Improvement", "House Renovations", and the primary location.
4. Conclude with a helpful CTA driving clicks to the website link.
5. LENGTH REGULATION: Generate a ${length === 'short' ? 'short descriptive text' : 'medium to long detail-rich description with structured benefits'}.
6. Include 3-5 tags at the bottom.
`,

  'Nextdoor': (seoBlock, workDesc, length) => `
You are John, a reliable local neighborhood trade technician.
Write a friendly, neighborly, highly personal, and helpful community post for Nextdoor:
${seoBlock}

WORK DESCRIPTION HIGHLIGHTS:
"${workDesc}"

POST CONTENT RULES:
1. Start with a warm greeting to the neighbors (e.g., "Hi neighbors!", "Hello local community!").
2. Write in first-person ("We just finished up...", "I wanted to share..."). Keep it highly humble, non-salesy, and local.
3. Discuss the job completed. Mention specific streets, blocks, or landmarks in the primary city or surrounding neighborhoods if possible, to demonstrate active presence.
4. Explain how this repair prevents future community hazards (e.g., leak hazards, structural decays).
5. Offer helpful general advice (e.g. "Remember to check your pipes before winter...").
6. Conclude with a neighborly discount or friendly pricing offer, supported by the standard CTA.
7. LENGTH REGULATION: Generate a ${length === 'short' ? 'short neighborly update' : length === 'medium' ? 'medium helpful story' : 'long comprehensive community update with tips'}.
8. Do not use hashtags (Nextdoor users prefer organic, natural community language).
`,

  'Report Summary': (seoBlock, workDesc) => `
You are a senior trade quality assurance inspector.
Analyze the job description and project goals to generate an official, branded, and high-trust Technician Summary for a PDF Proof Report:
${seoBlock}

WORK DESCRIPTION:
"${workDesc}"

REPORT OUTPUT FORMAT RULES:
Provide your output as a clean, structured text containing the following three explicit sections:

1. [TECHNICIAN CASE SUMMARY]: A professional, detailed technical summary of the challenges identified, exact components repaired/replaced, specialized tools/materials utilized, and final operational tests performed. State results objectively and with expert precision.
2. [LOCAL AREA SEO FOOTPRINT]: A paragraph emphasizing the geographical context of the job (neighborhood name, city conditions) and explaining why this service is vital for local properties.
3. [TRADE GUARANTEE COMPLIANCE]: A formal confirmation details how this project complies with the business's specific trust guarantee and parts warranty.

Keep the language professional, authoritative, and easy for the homeowner to read and appreciate.
`
};

/**
 * High-fidelity production Gemini integration for Social Posts
 */
export async function generateSocialPost({ platform, length, seoAnswers, workDescription }) {
  const seoBlock = buildLocalSEOContext(seoAnswers);
  const promptBuilder = PROMPT_REGISTRY[platform] || PROMPT_REGISTRY['Google Business Profile'];
  const prompt = promptBuilder(seoBlock, workDescription, length);

  return await callGeminiAPI(prompt);
}

/**
 * High-fidelity production Gemini integration for Before/After Proof Reports.
 * Accepts optional base64 before/after images for multimodal analysis.
 */
export async function generateProofReport({ beforeImageBase64, afterImageBase64, workDescription, seoAnswers }) {
  const seoBlock = buildLocalSEOContext(seoAnswers);
  const basePrompt = PROMPT_REGISTRY['Report Summary'](seoBlock, workDescription);

  const finalPrompt = `
You are ProofFlow AI, analyzing multimodal before/after project photos for a trade service.
${basePrompt}

INSTRUCTIONS FOR PHOTO ANALYSIS:
If before and after photos are attached:
- Identify and document visual details from the Before photo showing the initial wear, damage, or structure.
- Identify and document details from the After photo showing the clean, professional, final installation.
- Weave these visual observations explicitly into the [TECHNICIAN CASE SUMMARY] section to provide ironclad proof of work.
`;

  const images = [];
  if (beforeImageBase64) {
    images.push({ mimeType: 'image/jpeg', data: beforeImageBase64 });
  }
  if (afterImageBase64) {
    images.push({ mimeType: 'image/jpeg', data: afterImageBase64 });
  }

  return await callGeminiAPI(finalPrompt, images);
}
