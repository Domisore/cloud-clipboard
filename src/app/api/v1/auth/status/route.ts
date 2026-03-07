import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const user = await currentUser();

        if (user) {
            return NextResponse.json({
                authenticated: true,
                user: {
                    identifier: user.primaryEmailAddress?.emailAddress || user.username || 'User'
                }
            });
        }

        return NextResponse.json({ authenticated: false });
    } catch (error) {
        console.error('Auth status check error:', error);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
