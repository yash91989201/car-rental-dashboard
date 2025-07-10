import "@/styles/globals.css";
import { useState } from "react";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import type { AppProps } from "next/app";
// UTILS
import { queryClient as initialQueryClient } from "@/lib/query-client";

interface Props extends AppProps {
  pageProps: {
    session: Session;
  };
}

const geist = Geist({
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: Props) {
  const [queryClient] = useState(() => initialQueryClient);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div className={geist.className}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}
