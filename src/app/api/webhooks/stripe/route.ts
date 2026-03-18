import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        if (!webhookSecret) {
            console.error("STRIPE_WEBHOOK_SECRET is NOT set. Skipping signature verification (DEVELOPMENT ONLY).");
            event = JSON.parse(body);
        } else {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        }
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    try {
        if (event.type === "checkout.session.completed") {
            const userId = session.metadata?.userId || session.client_reference_id;

            if (!userId) {
                console.error("No userId found in checkout session metadata");
                return new NextResponse("No userId found", { status: 400 });
            }

            console.log(`[STRIPE_WEBHOOK] Upgrading user ${userId} to PRO`);
            
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    plan: "pro",
                },
            });
        }

        if (event.type === "customer.subscription.deleted") {
            const userId = session.metadata?.userId || session.client_reference_id;

            // If we don't have it on the subscription object, we might need to look up the customer
            // But since we pass it during checkout, it should be in metadata if we sync it.
            // Stripe subscriptions can have metadata too.
            
            if (userId) {
                console.log(`[STRIPE_WEBHOOK] Downgrading user ${userId} to FREE`);
                const client = await clerkClient();
                await client.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        plan: "free",
                    },
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Error processing webhook:", error);
        return new NextResponse("Webhook processing failed", { status: 500 });
    }
}
