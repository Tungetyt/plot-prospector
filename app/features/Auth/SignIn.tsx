'use client'

import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

function SignIn() {
  const t = useTranslations('Index')

  return (
    <button type="button" onClick={() => signIn('google')}>
      {t('Sign_in')}
    </button>
  )
}

export default SignIn
