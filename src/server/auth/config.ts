import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          if (!credentials.email || !credentials.password) {
            return null;
          }

          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          });

          if (user) {
            if (!user.password) {
              return null;
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password as string,
              user.password,
            );

            if (!isPasswordValid) {
              return null;
            }

            return user;
          } else {
            const hashedPassword = await bcrypt.hash(
              credentials.password as string,
              8,
            );

            const newUser = await db
              .insert(users)
              .values({
                email: credentials.email as string,
                password: hashedPassword,
                name: (credentials.email as string).split("@")[0],
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
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
