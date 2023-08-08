'use client'

import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

function SignOut() {
  const t = useTranslations('Index')

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="w-max text-center"
    >
      {t('Sign_out')}
    </button>
  )
}

export default SignOut
