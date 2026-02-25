import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// 1. Validation Schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          // The object returned here is passed to the 'jwt' callback as 'user'
          return user; 
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 3. Add Role and ID to the JWT token
    async jwt({ token, user }) {
      // 'user' is only available the first time this callback is called (during sign in)
      if (user) {
        token.id = user.id;
        // @ts-ignore - 'role' exists on your Prisma User model
        token.role = user.role; 
      }
      return token;
    },
    // 4. Transfer the Role and ID from the token to the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        // @ts-ignore - Add the role to the session so middleware can see it
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});