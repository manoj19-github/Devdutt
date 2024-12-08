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

const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400"] });

export const metadata: Metadata = {
  title: "Devdut",
  description: "All Developers, one Family",
};

export default function RootLayout({
  children,
  params: { session, ...params },
}: Readonly<{
  children: React.ReactNode;
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
              <ToasterProvider />
              <ModalProvider />
              <PageLoader />

              {children}
            </SocketProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
