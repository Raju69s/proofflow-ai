/**
 * Production-ready secure server-side logging infrastructure for ProofFlow AI.
 * Captures core operational telemetry while strictly shielding private inputs,
 * customer PII, secret keys, and billing tokens from cloud provider logs.
 */

class Logger {
  constructor(service = "ProofFlow-SaaS") {
    this.service = service;
  }

  // Format utility
  _format(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    
    // Mask sensitive properties in context
    const cleanContext = this._maskSecrets(context);

    return JSON.stringify({
      service: this.service,
      level: level.toUpperCase(),
      timestamp,
      message,
      ...cleanContext
    });
  }

  // Deep clone and mask utility to shield credentials, tokens and PII
  _maskSecrets(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const cloned = JSON.parse(JSON.stringify(obj));
    const forbiddenKeys = [
      'key', 'api_key', 'apikey', 'secret', 'token', 'password', 'pwd', 
      'card', 'cvc', 'signature', 'auth_header', 'authorization',
      'email', 'phone', 'ownerName', 'owner_name', 'billing_token'
    ];

    const mask = (item) => {
      if (!item || typeof item !== 'object') return;
      
      for (const k in item) {
        if (forbiddenKeys.some(fk => k.toLowerCase().includes(fk))) {
          item[k] = "[MASKED_SECURE_PROPERTY]";
        } else if (typeof item[k] === 'object') {
          mask(item[k]);
        }
      }
    };

    mask(cloned);
    return cloned;
  }

  info(message, context = {}) {
    console.log(this._format("info", message, context));
  }

  warn(message, context = {}) {
    console.warn(this._format("warn", message, context));
  }

  error(message, errorObject = {}, context = {}) {
    const errorDetails = {
      error_message: errorObject.message || "Unknown error",
      error_stack: errorObject.stack ? errorObject.stack.split('\n')[0] : "No stack trace available"
    };

    console.error(this._format("error", message, { ...errorDetails, ...context }));
  }

  /**
   * Dedicated telemetry logger for AI Content generations
   */
  logAIGeneration({ userId, platform, contentLength, status = "success", costTokens = 0 }) {
    this.info("AI content generation event completed.", {
      telemetry_type: "ai_generation",
      user_id: userId,
      platform,
      content_length: contentLength,
      status,
      token_count_approx: costTokens
    });
  }

  /**
   * Dedicated telemetry logger for secure storage uploads
   */
  logStorageUpload({ userId, bucketName, sizeBytes, fileType, status = "success" }) {
    this.info("Secure storage bucket upload operation completed.", {
      telemetry_type: "storage_upload",
      user_id: userId,
      bucket: bucketName,
      file_size_kb: parseFloat((sizeBytes / 1024).toFixed(2)),
      file_type: fileType,
      status
    });
  }

  /**
   * Dedicated telemetry logger for Billing webhooks
   */
  logBillingWebhook({ provider, eventType, status = "processed", error = null }) {
    const context = {
      telemetry_type: "billing_webhook",
      payment_provider: provider,
      event_class: eventType,
      status
    };

    if (error) {
      this.error("Billing webhook processing encountered an issue.", error, context);
    } else {
      this.info("Billing webhook process synced successfully.", context);
    }
  }

  /**
   * Dedicated telemetry logger for System Auth gateways
   */
  logAuthEvent({ eventName, userId = null, status = "success" }) {
    this.info(`Authentication gate trigger: ${eventName}`, {
      telemetry_type: "system_auth",
      user_id: userId,
      status
    });
  }
}

export const logger = new Logger();
