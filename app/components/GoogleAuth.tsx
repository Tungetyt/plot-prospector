"use client"

import { signIn, signOut } from "next-auth/react"
import { Session } from "next-auth"
import { MouseEventHandler } from "react"

export const GoogleAuth = ({ session }: { session: Session | null }) => {
  const {
    label,
    onClick,
  }: {
    label: string
    onClick: MouseEventHandler<HTMLButtonElement>
  } = session
    ? {
        label: "signOut",
        onClick: () => signOut(),
      }
    : {
        label: "signIn",
        onClick: () => signIn("google"),
      }

  return <button onClick={onClick}>{label}</button>
}
// test
