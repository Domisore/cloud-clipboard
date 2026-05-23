import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
    apiVersion: "2026-02-25.clover",
});

export async function POST() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "User email not found" }, { status: 400 });
        }

        // Search for the customer in Stripe
        const customers = await stripe.customers.list({
            email,
            limit: 1,
        });

        let isPro = false;
        if (customers.data.length > 0) {
            const customerId = customers.data[0].id;
            const subscriptions = await stripe.subscriptions.list({
                customer: customerId,
                status: "active",
                limit: 1,
            });

            if (subscriptions.data.length > 0) {
                isPro = true;
            }
        }

        // Update Clerk Metadata
        const plan = isPro ? "pro" : "free";
        console.log(`[MANUAL_SYNC] Updating user ${userId} to ${plan} based on Stripe lookup`);
        
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                plan,
            },
        });

        return NextResponse.json({ success: true, plan });
    } catch (error: any) {
        console.error("[MANUAL_SYNC_ERROR]", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
