'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Navbar — hard rules:
  - NO task links / task labels. Only About + Contact.
  - Search icon (→ /search), auth actions on the right.
  - Floating pill bar; gains a hairline on scroll; full-screen slide-down mobile menu.
*/

const STATIC_LINKS: Array<{ label: string; href: string }> = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? 'border-b border-[color:var(--editable-border)] bg-[var(--slot4-page-bg)]/95 backdrop-blur-md'
          : 'border-b border-transparent bg-[var(--slot4-page-bg)]/70 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-[var(--editable-container)] items-center gap-6 px-[var(--editable-pad-x)] sm:h-[76px]">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className="grid h-14 w-14 place-items-center text-[var(--slot4-accent-fill)] text-[15px] font-semibold"
          >
            <img src="/favicon.ico" alt="Logo" className="h-14 w-14" />
          </span>
          <span className="editable-display block text-[18px] font-semibold leading-none tracking-[-0.02em] text-[var(--slot4-page-text)]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-6 hidden items-center gap-1 md:flex">
          {STATIC_LINKS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-300 ${
                  active
                    ? 'text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--editable-border)] text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[14px] font-medium leading-none text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white sm:inline-flex"
              >
                Submit
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full px-3 py-2 text-[14px] font-medium text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)] md:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-3 py-2 text-[14px] font-medium text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)] md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[14px] font-medium leading-none text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white sm:inline-flex"
              >
                Get started
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--editable-border)] text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="md:hidden">
          <div className="border-t border-[color:var(--editable-border)] bg-[var(--slot4-page-bg)] px-[var(--editable-pad-x)] py-6">
            <div className="grid gap-1">
              {STATIC_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="editable-display block py-3 text-[28px] font-medium leading-none tracking-[-0.03em] text-[var(--slot4-page-text)]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/search"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-4 py-2 text-[14px] font-medium text-[var(--slot4-page-text)]"
                >
                  <Search className="h-4 w-4" /> Search
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/create"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-4 py-2 text-[14px] font-medium text-[var(--slot4-on-accent)]"
                    >
                      Submit a record
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setOpen(false)
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-4 py-2 text-[14px] font-medium text-[var(--slot4-page-text)]"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-4 py-2 text-[14px] font-medium text-[var(--slot4-page-text)]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-4 py-2 text-[14px] font-medium text-[var(--slot4-on-accent)]"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
