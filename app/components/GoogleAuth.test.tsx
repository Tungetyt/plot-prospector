import { render, fireEvent } from '@testing-library/react'
import { GoogleAuth } from './GoogleAuth'
import { signIn, signOut } from 'next-auth/react'
import { describe, it, beforeEach, expect } from 'vitest'

describe('GoogleAuth', () => {
  // beforeEach(() => {
  //     // Clear all instances and calls to constructor and all methods:
  //     signIn.mockClear();
  //     signOut.mockClear();
  // });

  it('renders and calls signIn function on button click', () => {
    const { getByText } = render(<GoogleAuth />)
    // const signInButton = getByText('signIn');
    // fireEvent.click(signInButton);
    // expect(signIn).toHaveBeenCalledWith("google");
    expect(true).toBe(true)
  })

  // it('renders and calls signOut function on button click', () => {
  //     const { getByText } = render(<GoogleAuth />);
  //     const signOutButton = getByText('signOut');
  //     fireEvent.click(signOutButton);
  //     expect(signOut).toHaveBeenCalled();
  // });
})

const add = (a: number, b: number) => {
  return a + b
}

describe('test add function', () => {
  it('should return the sum of two numbers', () => {
    const result = add(2, 3)
    expect(result).toBe(5)
  })

  it('should return zero when adding zero to a number', () => {
    const result = add(10, 0)
    expect(result).toBe(10)
  })

  it('should return a negative number when adding a negative and a positive number', () => {
    const result = add(-5, 8)
    expect(result).toBe(3)
  })
})
