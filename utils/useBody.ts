'use client'

import {useEffect, useState} from 'react'

const useBody = (): HTMLBodyElement | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return typeof window === 'undefined'
    ? undefined
    : window?.document?.getElementsByTagName('body')[0]
}

export default useBody
