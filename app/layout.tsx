import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import "./globals.css"
import localFont from "next/font/local";

const coolvetica = localFont({
  src: [
    {
      path: "./CoolveticaRg-It.otf",
      weight: "400",
    },
  ],
  variable: "--font-coolvetica",
});



export const metadata: Metadata = {
  title: "Anonymous Submissions",
  description: "Share your achievements anonymously",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning  className={` ${coolvetica.variable} `}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
      </head>

      <body>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
