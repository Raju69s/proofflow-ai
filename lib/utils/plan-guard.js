/**
 * Enforces business logic limits for ProofFlow AI SaaS Plans (Free vs Pro).
 */
export function checkPlanLimits(subscription, actionType, payload = {}) {
  const plan = subscription?.plan_type || 'free';
  const status = subscription?.status || 'active';
  const isPro = plan === 'pro' && status === 'active';

  // Pro users have unrestricted access across all active systems
  if (isPro) {
    return { allowed: true };
  }

  // Free Tier constraints
  switch (actionType) {
    case 'generation':
      const monthlyCount = subscription?.monthly_generations_used || 0;
      if (monthlyCount >= 5) {
        return {
          allowed: false,
          reason: 'You have reached your limit of 5 AI generations this month on the Free Plan. Please upgrade to Pro for unlimited content generations.',
          upgradeRequired: true
        };
      }
      return { allowed: true };

    case 'knowledge_base_size':
      const currentBytes = payload.currentBytes || 0;
      const uploadingBytes = payload.uploadingBytes || 0;
      const totalBytes = currentBytes + uploadingBytes;
      const FREE_KB_LIMIT = 1 * 1024 * 1024; // 1MB

      if (totalBytes > FREE_KB_LIMIT) {
        return {
          allowed: false,
          reason: `Free plan limits your Knowledge Base file storage to 1MB. (Attempted storage: ${((totalBytes)/1024/1024).toFixed(2)}MB). Please upgrade to Pro for 10MB of storage.`,
          upgradeRequired: true
        };
      }
      return { allowed: true };

    case 'social_length':
      const requestedLength = payload.length || 'short';
      if (requestedLength !== 'short') {
        return {
          allowed: false,
          reason: 'Medium and Long-form post copywriting is exclusive to Pro members. Upgrade to unlock complete length choices.',
          upgradeRequired: true
        };
      }
      return { allowed: true };

    case 'watermark':
      // Free users ALWAYS receive a watermarked layout. No exceptions.
      return {
        allowed: false,
        reason: 'Watermark-free PDF proof reports are a Pro feature. Upgrade to Pro to customize reports with your own brand only.',
        upgradeRequired: true
      };

    default:
      return { allowed: true };
  }
}
