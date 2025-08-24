import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'

// Mock next-auth
jest.mock('next-auth/react')

describe('Header', () => {
  it('shows sign-in button when user is not logged in', () => {
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<Header />)
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('shows user info and sign-out when logged in', () => {
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      },
      status: 'authenticated'
    })

    render(<Header />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
  })
})