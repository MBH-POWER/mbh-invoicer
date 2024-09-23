import { NextRequest, NextResponse } from 'next/server';
const whitelist = [
    'example.com',
    'alloweduser@gmail.com',
    'sijibomi@gmail.com',
    'gbemilesanmi@gmail.com',
    'agidi.shetua@mbhpower.com',
    'agidi.shetu@mbhpower.com',
    'oginniemmanuel040@gmail.com',
    'oginniemmanuel@outlook.com',
];

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const domain = email.split('@')[1];

        if (whitelist.includes(domain) || whitelist.includes(email)) {
            return NextResponse.json({ allowed: true, success: true });
        } else {
            return NextResponse.json({ allowed: false, message: 'Email is not whitelisted' });
        }
    } catch (error) {
        return NextResponse.json({ error });
    }
}
