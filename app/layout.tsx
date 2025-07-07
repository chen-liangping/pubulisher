"use client"

import { StagewiseToolbar } from "@stagewise/toolbar-next"
import ReactPlugin from "@stagewise-plugins/react"
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
