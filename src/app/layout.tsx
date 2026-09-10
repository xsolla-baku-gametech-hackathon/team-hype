import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Syne } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteGrain } from "@/components/shared/site-grain";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/site-config";

import "./globals.css";

const fontDisplay = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const fontBody = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Market Intelligence for Game Developers`,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <SmoothScroll>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <SiteGrain />
          <SiteHeader />
          <main id="main" className="flex-1 pt-[4.75rem] has-[#product]:pt-0 sm:pt-[5.25rem]">
            {children}
          </main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
