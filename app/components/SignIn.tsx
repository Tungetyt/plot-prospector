'use client'

import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export const SignIn = () => {
  const t = useTranslations('Index')

  return <button onClick={() => signIn('google')}>{t('Sign_in')}</button>
}
