'use client'

import { signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'>

export const GoogleAuth = ({ session }: { session: Session | null }) => {
  const {
    label,
    onClick,
  }: {
    label: ButtonProps['children']
    onClick: ButtonProps['onClick']
  } = session
    ? {
        label: 'signOut',
        onClick: () => signOut(),
      }
    : {
        label: 'signIn',
        onClick: () => signIn('google'),
      }

  return <button onClick={onClick}>{label}</button>
}
