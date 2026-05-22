/**
 * Dynamically resolves module list, status, and permissions based on user billing tier.
 */

// Default local definitions used for robust simulated fallback
export const DEFAULT_MODULES = [
  {
    key: 'reports',
    name: 'AI Before & After Reports',
    description: 'Create beautiful PDF proof sheets detailing your technician work, custom specs, and company guarantees.',
    is_active: true,
    plan_access: 'free',
  },
  {
    key: 'social-posts',
    name: 'AI Social Posts & Captions',
    description: 'Transform work details into localized, SEO-ready updates for Facebook, Nextdoor, LinkedIn, and Instagram.',
    is_active: true,
    plan_access: 'free',
  },
  {
    key: 'seo-wizard',
    name: '25-Question SEO Audit Wizard',
    description: 'Provide details on service types, cities, branding tones, and target search terms to optimize all generated items.',
    is_active: true,
    plan_access: 'free',
  },
  {
    key: 'kb-facts',
    name: 'Business Memory KB',
    description: 'Store manuals, guarantees, pricing, or material guidelines so all generations stay 100% accurate.',
    is_active: true,
    plan_access: 'free',
  },
  {
    key: 'review-reply',
    name: 'AI Local Review Responder',
    description: 'Automatically craft responses to positive or negative Google reviews infused with local keywords.',
    is_active: true,
    plan_access: 'pro',
  },
  {
    key: 'reel-hooks',
    name: 'AI Reel Script Generator',
    description: 'Convert raw field photos into engaging script frameworks and audio hooks for short social video reels.',
    is_active: true,
    plan_access: 'pro',
  },
  {
    key: 'website-copy',
    name: 'AI Landing Page Copywriter',
    description: 'Draft conversion-focused landing page structures and descriptions tailored for tradesmen websites.',
    is_active: true,
    plan_access: 'pro',
  },
  {
    key: 'auto-watermark',
    name: 'Auto-Branded Logo Overlay',
    description: 'Protect copyright and build visual trust by watermarking company logos directly on project photos.',
    is_active: true,
    plan_access: 'pro',
  }
];

export async function getDashboardTools(supabaseClient, userPlan = 'free') {
  try {
    // Attempt querying database
    const { data: activeModules, error } = await supabaseClient
      .from('modules')
      .select('*')
      .eq('is_active', true);

    if (error || !activeModules || activeModules.length === 0) {
      // Fallback
      return resolvePermissions(DEFAULT_MODULES, userPlan);
    }

    return resolvePermissions(activeModules, userPlan);
  } catch (err) {
    // Solid fallback
    return resolvePermissions(DEFAULT_MODULES, userPlan);
  }
}

function resolvePermissions(modules, userPlan) {
  return modules.map(tool => {
    const isProUser = userPlan === 'pro';
    
    // Logic: Free tool? unlocked. Pro tool? only unlocked for Pro users.
    const isLocked = tool.plan_access === 'pro' && !isProUser;

    return {
      ...tool,
      isLocked,
      badgeText: tool.plan_access === 'pro' ? 'Pro Tool' : 'Free Access',
    };
  });
}
