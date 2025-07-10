import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
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
