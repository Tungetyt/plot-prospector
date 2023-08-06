import { render } from '@testing-library/react'
import { SignIn } from './SignIn'
import { describe, expect, it } from 'vitest'

describe('GoogleAuth', () => {
  it('renders', () => {
    render(<SignIn />)
    expect(true).toBe(true)
  })
})
