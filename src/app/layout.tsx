import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { isPublicSite, siteOrigin } from "@/lib/seo/site";
import "./globals.css";

const geist = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-globepick",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: { default: "GlobePick", template: "%s | GlobePick" },
  description:
    "A geography learning project for curious people and classrooms.",
  robots: { index: isPublicSite, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-page font-sans text-foreground">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-control bg-brand px-5 py-3 font-semibold text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <AppHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus-visible:outline-none"
        >
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}
