import type { DefaultSession } from "next-auth";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { AuthOptions } from "next-auth";
import { getUserById } from "@/server/utils/user";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email;
          const password = credentials?.password;
          if (!email || !password) {
            return null;
          }

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (user) {
            if (!user.password) {
              return null;
            }

            const isPasswordValid = await bcrypt.compare(
              password,
              user.password,
            );

            if (!isPasswordValid) {
              return null;
            }

            return user;
          } else {
            const hashedPassword = await bcrypt.hash(password, 8);

            const newUser = await db
              .insert(users)
              .values({
                email,
                password: hashedPassword,
                name: email.split("@")[0],
              })
              .returning();

            return newUser[0] ?? null;
          }
        } catch (error) {
          console.log(error);

          return null;
        }
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const newToken = {
        ...token,
        ...existingUser,
      };

      return newToken;
    },

    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;

      if (token.role && session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
} satisfies AuthOptions;

export default NextAuth(authOptions);
