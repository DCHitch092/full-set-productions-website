import React from "react"
import type { Metadata } from "next"
import { Alfa_Slab_One, Chivo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeWrapper } from "@/components/layout/theme-wrapper"
import { GoogleAnalytics } from "@/components/analytics"
import "./globals.css"

const _alfaSlab = Alfa_Slab_One({ weight: "400", subsets: ["latin"] });
const _chivo = Chivo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Full Set Productions | Escape Rooms & Immersive Attractions',
  description: 'Edinburgh-based designers and builders of escape rooms, immersive attractions, and theatrical sets. From concept to install-ready builds.',
  keywords: ['escape room design', 'immersive attractions', 'theatrical sets', 'Edinburgh', 'escape room builder', 'scenic fabrication'],
  authors: [{ name: 'Full Set Productions' }],
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Full Set Productions | Escape Rooms & Immersive Attractions',
    description: 'Edinburgh-based designers and builders of escape rooms, immersive attractions, and theatrical sets.',
    type: 'website',
    locale: 'en_GB',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/apple-touch-icon.png',
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
