import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { GithubProfile } from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
export const options: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      profile(profile: GithubProfile) {
        //console.log(profile)
        return {
          ...profile,
          role: profile.role ?? "user",
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "text",
          placeholder: "Email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }


        const existingUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });


        if (!existingUser) return null;
        // console.log(existingUser);

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) return null;

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.firstName + " " + existingUser.lastName,
          role: existingUser.role,
        };
      },
    }),
  ],
    callbacks: {
     
      async jwt({ token, user }) {
        if (user) token.role = user.role;
        return token;
      },
 
      async session({ session, token }) {
        if (session?.user) session.user.role = token.role;
        return session;
      },
    },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    // newUser: "/auth/new-user",
    // signOut: "/auth/signout",
  },
};
