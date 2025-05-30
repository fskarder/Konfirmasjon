import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/session-provider"
import { SelectedVideosProvider } from "@/context/selected-videos-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panic Button - Random Video Player",
  description: "A panic button that plays random videos from your Google Photos",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SelectedVideosProvider>{children}</SelectedVideosProvider>
        </Providers>
      </body>
    </html>
  )
}
