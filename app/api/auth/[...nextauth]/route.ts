import NextAuth, {AuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const authOptions = {
    providers: [
        GoogleProvider({
            // TODO: Remove casting
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ]
} satisfies AuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
