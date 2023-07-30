import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { validateEnvVars } from '@/app/env'

const inter = Inter({ subsets: ['latin'] })

validateEnvVars()

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
} as const

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
