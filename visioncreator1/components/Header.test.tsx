import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'
import { SessionProvider } from 'next-auth/react'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('Header', () => {
  it('renders the logo', () => {
    render(
      <SessionProvider session={null}>
        <Header />
      </SessionProvider>
    )
    expect(screen.getByText('VisionCreator')).toBeInTheDocument()
  })

  it('renders sign in and sign up buttons when not authenticated', () => {
    render(
      <SessionProvider session={null}>
        <Header />
      </SessionProvider>
    )
    expect(screen.getByText('signIn')).toBeInTheDocument()
    expect(screen.getByText('signUp')).toBeInTheDocument()
  })

  it('renders dashboard and projects links when authenticated', () => {
    const mockSession = {
      user: { name: 'Test User', email: 'test@example.com' },
      expires: '1',
    }
    render(
      <SessionProvider session={mockSession}>
        <Header />
      </SessionProvider>
    )
    expect(screen.getByText('dashboard')).toBeInTheDocument()
    expect(screen.getByText('projects')).toBeInTheDocument()
  })
})

