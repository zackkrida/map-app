import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Session, withIronSession } from 'next-iron-session'

export const withAuth = (handler: NextApiHandler) =>
  withIronSession(handler, {
    password: process.env.COOKIE_KEY,
    cookieName: 'marshall-map-cookie',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    },
  })
