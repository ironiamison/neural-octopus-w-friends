import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');
    const oauth_token_secret = request.cookies.get('oauth_token_secret')?.value;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
      throw new Error('Missing required OAuth parameters');
    }

    const request_data = {
      url: 'https://api.twitter.com/oauth/access_token',
      method: 'POST',
      data: { 
        oauth_token,
        oauth_verifier
      }
    };

    const token = {
      key: oauth_token,
      secret: oauth_token_secret
    };

    const authHeader = oauth.toHeader(oauth.authorize(request_data, token));

    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers: {
        ...authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.text();
    const result = new URLSearchParams(data);
    
    // Get the final tokens
    const accessToken = result.get('oauth_token');
    const accessTokenSecret = result.get('oauth_token_secret');
    const userId = result.get('user_id');
    const screenName = result.get('screen_name');

    if (!accessToken || !accessTokenSecret || !userId || !screenName) {
      throw new Error('Invalid response from Twitter');
    }

    // Here you would typically:
    // 1. Store the tokens in your database
    // 2. Create or update the user record
    // 3. Set up a session or JWT

    const redirectResponse = NextResponse.redirect(new URL('/profile', request.url));
    
    // Clear the temporary oauth_token_secret cookie
    redirectResponse.cookies.delete('oauth_token_secret');

    return redirectResponse;
  } catch (error: any) {
    console.error('Twitter callback error:', error);
    return NextResponse.redirect(new URL('/login?error=twitter_auth_failed', request.url));
  }
} 