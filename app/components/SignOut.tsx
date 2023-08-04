'use client'

import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export const SignOut = () => {
  const t = useTranslations('Index')

  return (
    <button onClick={() => signOut()} className="w-max text-center">
      {t('Sign_out')}
    </button>
  )
}
