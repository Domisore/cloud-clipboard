import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

// CORS headers Helper
function corsHeaders(origin: string | null) {
    // In production we could lock this down to only our extension IDs
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

export async function GET(request: Request) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    try {
        const user = await currentUser();

        if (user) {
            return NextResponse.json({
                authenticated: true,
                user: {
                    identifier: user.primaryEmailAddress?.emailAddress || user.username || 'User'
                }
            }, { headers });
        }

        return NextResponse.json({ authenticated: false }, { headers });
    } catch (error) {
        console.error('Auth status check error:', error);
        return NextResponse.json({ authenticated: false }, { status: 500, headers });
    }
}
