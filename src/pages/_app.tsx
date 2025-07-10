import "@/styles/globals.css";
import { useState } from "react";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import type { Session } from "next-auth";
import type { AppProps } from "next/app";
import { getQueryClient } from "@/lib/query-client";

interface Props extends AppProps {
  pageProps: {
    session: Session;
    dehydratedState?: unknown;
  };
}

const geist = Geist({
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: Props) {
  const [queryClient] = useState(getQueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <div className={geist.className}>
            <Component {...pageProps} />
          </div>
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
}
