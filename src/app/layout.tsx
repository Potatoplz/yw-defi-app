// Global layout for all pages
"use client";

import "@/shared/styles/globals.css";
import { RecoilRoot } from "recoil";
import BasicLayout from "@/shared/components/BasicLayout";
import { WagmiProvider } from "wagmi";
import { WagmiConfig } from "@/utils/wagmi/WagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={WagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RecoilRoot>
              <BasicLayout>{children}</BasicLayout>
            </RecoilRoot>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
