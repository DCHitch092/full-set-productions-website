import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeWrapper } from "@/components/layout/theme-wrapper"
import { GoogleAnalytics } from "@/components/analytics"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Full Set Productions | Escape Rooms & Immersive Attractions',
  description: 'Edinburgh-based designers and builders of escape rooms, immersive attractions, and theatrical sets. From concept to install-ready builds.',
  keywords: ['escape room design', 'immersive attractions', 'theatrical sets', 'Edinburgh', 'escape room builder', 'scenic fabrication'],
  authors: [{ name: 'Full Set Productions' }],
  openGraph: {
    title: 'Full Set Productions | Escape Rooms & Immersive Attractions',
    description: 'Edinburgh-based designers and builders of escape rooms, immersive attractions, and theatrical sets.',
    type: 'website',
    locale: 'en_GB',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThemeWrapper>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeWrapper>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
