import prisma from "../../../../prisma/client";
import type { NextAuthOptions, RequestInternal, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email:{ label: "Email", type: "email" },
        password:{label:"Password",type:"password"}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) throw new Error('פרטייך שגויים!');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if(!user || !user.email) return false;
      if(account?.provider === "google"){
        await prisma.users.upsert({
          where:{
            email:user.email
          },
          update: {
            name: user.name,
          },
          create: {
            email:user.email,
            name:user.name,
          },
        })
      }
      return true;
    },
    async jwt({ token, user }) {
      if(user) return {
        ...token,
        id:user.id
       }
      return token
    },
    async session({ session , token }) {
      console.log("sesionnnnnnnnn",{ session , token })
      return {
        ...session,
        user:{
          ...session.user,
          id:token.id
        }
      };
    },

  },
};
