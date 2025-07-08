import "@/styles/globals.css";

import { Geist } from "next/font/google";
import { type AppType } from "next/app";
import { queryClient as initialQueryClient } from "@/lib/query-client";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => initialQueryClient);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className={geist.className}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
      <Toaster richColors />
    </>
  );
};

export default MyApp;
