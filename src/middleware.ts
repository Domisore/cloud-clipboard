import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/share-target(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) return;
    await auth.protect();
});

export const config = {
    matcher: [
        // Skip Next.js internals, share-target, and all static files
        '/((?!_next|share-target|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
