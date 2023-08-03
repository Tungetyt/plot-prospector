'use client'

import { signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { ComponentProps } from 'react'
import { useTranslations } from 'next-intl'

type ButtonProps = ComponentProps<'button'>

export const GoogleAuth = ({ session }: { session: Session | null }) => {
  const t = useTranslations('Index')
  const {
    label,
    onClick,
  }: {
    label: ButtonProps['children']
    onClick: ButtonProps['onClick']
  } = session
    ? {
        label: t('Sign_out'),
        onClick: () => signOut(),
      }
    : {
        label: t('Sign_in'),
        onClick: () => signIn('google'),
      }

  return <button onClick={onClick}>{label}</button>
}
