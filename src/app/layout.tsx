// Global layout for all pages
"use client";

import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import BasicLayout from "../components/BasicLayout";
import { WagmiProvider } from "wagmi";
import { config } from "@/utils/wagmi/config";
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
        <WagmiProvider config={config}>
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
