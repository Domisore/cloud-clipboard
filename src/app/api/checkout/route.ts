import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

// Add a check to avoid crashing if the key is missing at initialization
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, { apiVersion: "2026-02-25.clover" })
    : null;

export async function POST(req: Request) {
    if (!stripe) {
        console.error("[STRIPE_ERROR] STRIPE_SECRET_KEY is missing from environment variables.");
        return new NextResponse("Stripe configuration error: Missing Secret Key", { status: 500 });
    }
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { priceId } = await req.json();

        if (!priceId) {
            return new NextResponse("Price ID is required", { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
        console.log(`[STRIPE_CHECKOUT] Creating session for user: ${userId}, price: ${priceId}, callback: ${baseUrl}`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${baseUrl}/clipboard?success=true`,
            cancel_url: `${baseUrl}/pricing?canceled=true`,
            metadata: {
                userId,
            },
            client_reference_id: userId,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
