import NextAuth, { AuthOptions, Profile } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { prisma } from '@/app/prismaClient'

type GoogleProfile = Omit<
  {
    iss: string
    azp: string
    aud: string
    sub: `${number}`
    hd: string
    email: `${string}@${string}.${string}`
    email_verified: boolean
    at_hash: string
    picture: string
    given_name: string
    family_name: string
    locale: string
    iat: number
    exp: number
  } & Profile,
  'image'
>

const authOptions: AuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt', // See https://next-auth.js.org/configuration/nextjs#caveats, middleware (currently) doesn't support the "database" strategy which is used by default when using an adapter (https://next-auth.js.org/configuration/options#session)
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google')
        return (profile as GoogleProfile)?.email_verified

      return true // Do different verification for other providers that don't have `email_verified`
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
