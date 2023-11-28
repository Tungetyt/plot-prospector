import '../../globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {AbstractIntlMessages, NextIntlClientProvider} from 'next-intl'
import {notFound} from 'next/navigation'
import validateEnvVars from '@/env'
import {ReactNode} from 'react'
import {Toaster} from 'react-hot-toast'

const inter = Inter({subsets: ['latin']})

validateEnvVars()

export const metadata: Metadata = {
  title: 'PlotProspector',
  description: 'Display and search for plots of land'
} as const

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode
  params: {[key: string]: string | string[] | undefined} & {locale: string}
}) {
  let messages: AbstractIntlMessages
  try {
    messages = (await import(`../../messages/${params.locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Toaster position="bottom-right" />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
