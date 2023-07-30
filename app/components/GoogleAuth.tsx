'use client'

import { signIn, signOut } from 'next-auth/react'

export const GoogleAuth = () => {
  return (
    <>
      <button className="btn" onClick={() => signIn('google')}>
        signIn
      </button>
      <div></div>
      <button className="btn" onClick={() => signOut()}>
        signOut
      </button>
    </>
  )
}
