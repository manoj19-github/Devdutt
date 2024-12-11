import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import PageLoader from "@/components/PageLoader";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import ModalProvider from "@/providers/ModalProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ReactNode } from "react";

const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400"] });

export const metadata: Metadata = {
  title: "Devdut",
  description: "All Developers, one Family",
};

export default function RootLayout({
  children,
  params: { session, ...params },
}: Readonly<{
  children: ReactNode;
  params: any;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(lato.className, "bg-white dark:bg-[#313131]")}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SocketProvider>
              <QueryProvider>
                <ToasterProvider />
                <ModalProvider />
                <PageLoader />

                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
