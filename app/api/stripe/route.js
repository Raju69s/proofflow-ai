import { createClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { logger } from '../../../lib/utils/logger';

/**
 * STRIPE BILLING WEBHOOK HANDLER
 * Processes Stripe subscription events to synchronize billing plans.
 */
export async function POST(request) {
  try {
    const payloadText = await request.text();
    const signature = request.headers.get('stripe-signature');

    // In a fully deployed environment:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // let event;
    // try {
    //   event = stripe.webhooks.constructEvent(payloadText, signature, process.env.STRIPE_WEBHOOK_SECRET);
    // } catch (err) {
    //   logger.error("Stripe signature validation failed.", err);
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    // Mock parse for demonstration & local setup compatibility
    let event;
    try {
      event = JSON.parse(payloadText);
    } catch (e) {
      logger.error("Failed to parse Stripe webhook JSON payload.", e);
      return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
    }

    const supabase = createClient();
    
    logger.info(`Stripe Webhook event payload received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id; 
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId) {
          // Upgrade user to Pro!
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_type: 'pro',
              status: 'active',
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days window
            }, { onConflict: 'user_id' });

          if (error) {
            logger.logBillingWebhook({
              provider: "stripe",
              eventType: event.type,
              status: "failed_db_upsert",
              error: error
            });
            return NextResponse.json({ error: "Database sync failed" }, { status: 500 });
          }

          logger.logBillingWebhook({
            provider: "stripe",
            eventType: event.type,
            status: "success_pro_upgrade"
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const stripeSubId = sub.id;
        const status = sub.status; // active, trialing, past_due, canceled
        
        // Find user by subscription ID
        const { data: userSub, error: findError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', stripeSubId)
          .maybeSingle();

        if (findError) {
          logger.error("Failed to locate user subscription record on Stripe update.", findError);
        }

        if (userSub) {
          const isPlanActive = ['active', 'trialing'].includes(status);
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: status,
              plan_type: isPlanActive ? 'pro' : 'free',
              current_period_end: new Date(sub.current_period_end * 1000).toISOString()
            })
            .eq('user_id', userSub.user_id);

          if (error) {
            logger.logBillingWebhook({
              provider: "stripe",
              eventType: event.type,
              status: "failed_db_update",
              error: error
            });
            return NextResponse.json({ error: "Database sync failed" }, { status: 500 });
          }

          logger.logBillingWebhook({
            provider: "stripe",
            eventType: event.type,
            status: `success_sync_status_${status}`
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const stripeSubId = sub.id;

        // Reset user subscription to default Free status
        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', stripeSubId)
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
              provider: "stripe",
              eventType: event.type,
              status: "failed_db_downgrade",
              error: error
            });
            return NextResponse.json({ error: "Database downgrade sync failed" }, { status: 500 });
          }

          logger.logBillingWebhook({
            provider: "stripe",
            eventType: event.type,
            status: "success_downgraded_to_free"
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (userSub) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('user_id', userSub.user_id);

          if (error) {
            logger.error("Failed to mark subscription as past due on failed invoice.", error);
          }
          
          logger.logBillingWebhook({
            provider: "stripe",
            eventType: event.type,
            status: "payment_failed_marked_past_due"
          });
        }
        break;
      }

      default:
        logger.info(`Unhandled Stripe webhook event received: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    logger.error("Stripe Webhook API router encountered a critical execution exception.", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
