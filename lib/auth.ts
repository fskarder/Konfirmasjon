import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
       params: {
      scope: "openid email profile https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
      prompt: "consent", // 🔑 forces user to re-consent even if previously logged in
      access_type: "offline", // for refresh token if needed
      response_type: "code",
    },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("scopes in token: ", account.scope)
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
}
