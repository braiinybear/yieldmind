import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// 1. Validation Schema (Rules for the form)
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // 2. The Login Logic
      authorize: async (credentials) => {
        
        // A. Validate the data
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // B. Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null; // No user found
        }

        // C. Check password (Hash comparison)
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return user; // ✅ Success!
        }

        return null; // ❌ Wrong password
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect here if someone isn't logged in
  },
  callbacks: {
    // 3. Add User ID to the Session (so you can use it in the app)
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  },
  session: { strategy: "jwt" },
});