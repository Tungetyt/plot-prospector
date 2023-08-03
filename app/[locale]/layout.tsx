import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { validateEnvVars } from '@/app/env'
import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

validateEnvVars()

export const metadata: Metadata = {
  title: 'PlotProspector',
  description: 'Display and search for plots of land',
} as const

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { [key: string]: string | string[] | undefined } & { locale: string }
}) {
  const locale = useLocale()

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
