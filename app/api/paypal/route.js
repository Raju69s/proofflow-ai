import { createClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { logger } from '../../../lib/utils/logger';

/**
 * PAYPAL SUBSCRIPTIONS WEBHOOK HANDLER
 * Processes PayPal billing transactions to synchronize client subscription tiers.
 */
export async function POST(request) {
  try {
    const payloadText = await request.text();
    
    let event;
    try {
      event = JSON.parse(payloadText);
    } catch (e) {
      logger.error("Failed to parse PayPal webhook JSON payload.", e);
      return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
    }

    const supabase = createClient();
    
    logger.info(`PayPal Webhook event payload received: ${event.event_type}`);

    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const sub = event.resource;
        const customId = sub.custom_id; 
        const paypalSubId = sub.id;

        if (customId) {
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: customId,
              stripe_subscription_id: `paypal_${paypalSubId}`, // Map PayPal inside subscriptions
              plan_type: 'pro',
              status: 'active',
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }, { onConflict: 'user_id' });

          if (error) {
            logger.logBillingWebhook({
              provider: "paypal",
              eventType: event.event_type,
              status: "failed_db_upsert",
              error: error
            });
            return NextResponse.json({ error: "Database update failed" }, { status: 500 });
          }

          logger.logBillingWebhook({
            provider: "paypal",
            eventType: event.event_type,
            status: "success_pro_upgrade"
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const sub = event.resource;
        const paypalSubId = sub.id;

        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', `paypal_${paypalSubId}`)
          .maybeSingle();

        if (userSub) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              plan_type: 'free',
              status: 'canceled',
              stripe_subscription_id: null
            })
            .eq('user_id', userSub.user_id);

          if (error) {
            logger.logBillingWebhook({
              provider: "paypal",
              eventType: event.event_type,
              status: "failed_db_downgrade",
              error: error
            });
            return NextResponse.json({ error: "Database downgrade failed" }, { status: 500 });
          }

          logger.logBillingWebhook({
            provider: "paypal",
            eventType: event.event_type,
            status: "success_downgraded_to_free"
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        const sub = event.resource;
        const paypalSubId = sub.id;

        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', `paypal_${paypalSubId}`)
          .maybeSingle();

        if (userSub) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('user_id', userSub.user_id);

          if (error) {
            logger.error("PayPal DB past due status sync error:", error);
          }

          logger.logBillingWebhook({
            provider: "paypal",
            eventType: event.event_type,
            status: "payment_failed_marked_past_due"
          });
        }
        break;
      }

      default:
        logger.info(`Unhandled PayPal event type received: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    logger.error("PayPal Webhook API router encountered a critical execution exception.", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
