import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400"] });

export const metadata: Metadata = {
  title: "Devdut",
  description: "All Developers, one Family",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/dark_logo.png",
        href: "/dark_logo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/dark_logo.png",
        href: "/dark_logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
