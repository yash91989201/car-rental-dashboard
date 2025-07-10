import "@/styles/globals.css";

import { Geist } from "next/font/google";
import type { AppProps } from "next/app";
import { queryClient as initialQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

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
