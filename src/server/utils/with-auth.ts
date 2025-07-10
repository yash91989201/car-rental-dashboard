import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerSession, type Session } from "next-auth";

interface Props<T> {
  gSSP: (
    context: GetServerSidePropsContext,
    session: Session | null,
  ) => Promise<GetServerSidePropsResult<T>>;
}

export const withAuth = <T>({ gSSP }: Props<T>) => {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T>> => {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (session == null) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        // @ts-expect-error: props type mismatch since unauth redirect doesn't need props
        props: {},
      };
    }

    return await gSSP(context, session);
  };
};
