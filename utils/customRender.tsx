import en from '@/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, ReactElement } from 'react'
import { render } from '@testing-library/react'

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider messages={en} locale="en">
      {children}
    </NextIntlClientProvider>
  )
}

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, { wrapper: Wrapper, ...options })

export default customRender
