import { NextResponse } from 'next/server';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY!,
    secret: process.env.TWITTER_API_SECRET!
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  }
});

export async function GET() {
  try {
    const request_data = {
      url: 'https://api.twitter.com/oauth/request_token',
      method: 'POST',
      data: { 
        oauth_callback: process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/twitter/callback'
      }
    };

    const token = oauth.authorize(request_data);
    const authHeader = oauth.toHeader(token);

    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers: {
        ...authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get request token');
    }

    const data = await response.text();
    const parsed = new URLSearchParams(data);
    const oauth_token = parsed.get('oauth_token');
    const oauth_token_secret = parsed.get('oauth_token_secret');

    if (!oauth_token || !oauth_token_secret) {
      throw new Error('Invalid response from Twitter');
    }

    const redirectResponse = NextResponse.redirect(
      `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
    );
    
    redirectResponse.cookies.set('oauth_token_secret', oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5 // 5 minutes
    });

    return redirectResponse;
  } catch (error: any) {
    console.error('Twitter auth error:', error);
    return new NextResponse(error.message, { status: 500 });
  }
} 