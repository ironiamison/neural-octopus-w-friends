import { NextResponse } from 'next/server'
import { OAuth } from 'oauth'

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_API_KEY!,
  process.env.TWITTER_API_SECRET!,
  '1.0A',
  process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/twitter/callback',
  'HMAC-SHA1'
)

export async function GET() {
  try {
    return new Promise((resolve, reject) => {
      oauth.getOAuthRequestToken((error, token, tokenSecret) => {
        if (error) {
          console.error('Error getting OAuth request token:', error)
          resolve(new NextResponse('Failed to initialize Twitter login', { status: 500 }))
          return
        }

        // Store token secret in a cookie for verification during callback
        const response = NextResponse.redirect(
          `https://api.twitter.com/oauth/authenticate?oauth_token=${token}`
        )
        response.cookies.set('oauth_token_secret', tokenSecret, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 5 // 5 minutes
        })

        resolve(response)
      })
    })
  } catch (error: any) {
    console.error('Twitter auth error:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 