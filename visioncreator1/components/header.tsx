'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useTranslation('common')

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-background border-b" role="banner">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" aria-label="VisionCreator Home">
          VisionCreator
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="flex space-x-4 items-center">
            {session ? (
              <>
                <li>
                  <Link href="/dashboard" passHref>
                    <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} aria-current={isActive('/dashboard')}>
                      {t('dashboard')}
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/projects" passHref>
                    <Button variant={isActive('/projects') ? 'default' : 'ghost'} aria-current={isActive('/projects')}>
                      {t('projects')}
                    </Button>
                  </Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.user?.image || '/placeholder.svg?height=32&width=32'} alt={session.user?.name || ''} />
                          <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/settings">{t('settings')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => signOut()}>
                        {t('signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signin" passHref>
                    <Button variant="ghost">{t('signIn')}</Button>
                  </Link>
                </li>
                <li>
                  <Link href="/signup" passHref>
                    <Button>{t('signUp')}</Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

