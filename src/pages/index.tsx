import Head from "next/head";
import { getServerSession } from "next-auth";
import type { GetServerSideProps } from "next";
// UTILS
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/dashboard",
    },
  };
};

export default function Home() {
  return (
    <Head>
      <title>Car Rental Dashboard</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
