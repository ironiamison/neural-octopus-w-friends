import { NextResponse } from 'next/server'
import { OAuth } from 'oauth'
import { cookies } from 'next/headers'
import { updateUser } from '@/app/utils/userStore'

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_API_KEY!,
  process.env.TWITTER_API_SECRET!,
  '1.0A',
  process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/twitter/callback',
  'HMAC-SHA1'
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const oauthToken = searchParams.get('oauth_token')
    const oauthVerifier = searchParams.get('oauth_verifier')
    const cookieStore = cookies()
    const oauthTokenSecret = cookieStore.get('oauth_token_secret')?.value

    if (!oauthToken || !oauthVerifier || !oauthTokenSecret) {
      throw new Error('Missing OAuth parameters')
    }

    // Get access token
    const { accessToken, accessTokenSecret } = await new Promise<any>((resolve, reject) => {
      oauth.getOAuthAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, accessToken, accessTokenSecret) => {
          if (error) {
            reject(error)
          } else {
            resolve({ accessToken, accessTokenSecret })
          }
        }
      )
    })

    // Get user data from Twitter
    const userData = await new Promise<any>((resolve, reject) => {
      oauth.get(
        'https://api.twitter.com/1.1/account/verify_credentials.json',
        accessToken,
        accessTokenSecret,
        (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(JSON.parse(data as string))
          }
        }
      )
    })

    // Update user with Twitter data
    const user = updateUser(userData.id_str, {
      twitterId: userData.id_str,
      displayName: userData.name,
      username: userData.screen_name,
      profileImage: userData.profile_image_url_https
    })

    if (!user) {
      throw new Error('Failed to update user')
    }

    // Clear the oauth token secret cookie
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('oauth_token_secret')

    return response
  } catch (error: any) {
    console.error('Twitter callback error:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, request.url)
    )
  }
} 