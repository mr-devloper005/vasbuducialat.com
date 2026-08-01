'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Send } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const LABEL_OVERRIDES: Record<string, string> = {
  listing: 'Community Directory',
  pdf: 'Field Notes',
  article: 'Field journal',
  image: 'Contact sheet',
  classified: 'Noticeboard',
  sbm: 'Shelf',
  profile: 'Neighbours',
}

export function EditableFooter() {
  const year = new Date().getFullYear()
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { session, logout } = useEditableLocalAuthSession()
  const [subscribed, setSubscribed] = useState(false)

  const discovery = taskLinks.map((task) => ({
    label: LABEL_OVERRIDES[task.key] ?? task.label,
    href: task.route,
  }))

  const resources = [
    { label: 'About the platform', href: '/about' },
    { label: 'Search everything', href: '/search' },
    { label: 'Reach an editor', href: '/contact' },
  ]

  const account = session
    ? [
        { label: 'Submit a record', href: '/create' },
      ]
    : [
        { label: 'Sign in', href: '/login' },
        { label: 'Get started', href: '/signup' },
      ]

  return (
    <footer className="mt-24 bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      {/* CTA strip */}
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pt-20 sm:pt-24">
        <div className="grid gap-10 border-b border-white/10 pb-16 lg:grid-cols-[1.18fr_1fr] lg:items-end lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[13px] font-medium text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
              Get the fortnight letter
            </span>
            <h2 className="editable-display mt-6 text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
              A quiet round-up of new records and Field Notes, every other Sunday.
            </h2>
          </div>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              setSubscribed(true)
            }}
            className="relative"
          >
            <label className="sr-only" htmlFor="footer-email">Your email</label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder={subscribed ? 'Thanks — you’re on the list' : 'you@yourstreet.com'}
              disabled={subscribed}
              className="h-14 w-full rounded-full border border-white/15 bg-white/[0.04] pl-6 pr-16 text-[15px] text-white placeholder-white/45 outline-none transition-colors duration-300 focus:border-[var(--slot4-accent-fill)]"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              disabled={subscribed}
              className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-white hover:text-[var(--slot4-page-text)] disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--slot4-accent-fill)] text-[15px] font-semibold text-[var(--slot4-on-accent)]">
               <img src="/favicon.ico" alt="Logo" className="h-14 w-14" />
              </span>
              <span className="editable-display text-[18px] font-semibold leading-none tracking-[-0.02em]">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.55] text-white/60">
              {globalContent.footer.description}
            </p>
          </div>

          <FooterCol title="Discover" links={discovery} />
          <FooterCol title="Resources" links={resources} />
          <FooterCol title="Account" links={account} extra={session ? (
            <button
              type="button"
              onClick={logout}
              className="mt-2 text-left text-[15px] text-white/60 transition-colors duration-300 hover:text-white"
            >
              Sign out
            </button>
          ) : null} />
        </div>
      </div>

      {/* Oversized brand wordmark */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[var(--editable-container)] overflow-hidden px-[var(--editable-pad-x)] py-10">
          <span
            aria-hidden
            className="editable-display block whitespace-nowrap text-[clamp(4rem,16vw,15rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white/6 [text-shadow:0_0_1px_rgba(255,255,255,0.08)]"
            style={{ color: 'rgba(255,255,255,0.08)' }}
          >
            {SITE_CONFIG.name}
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex flex-col gap-3 px-[var(--editable-pad-x)] py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between max-w-[var(--editable-container)]">
          <span>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</span>
          <span className="flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors duration-300">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
  extra,
}: {
  title: string
  links: Array<{ label: string; href: string }>
  extra?: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-[13px] font-medium text-white/45">{title}</h3>
      <div className="mt-5 grid gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className="inline-flex items-center gap-1.5 text-[15px] text-white/85 transition-colors duration-300 hover:text-[var(--slot4-accent-fill)]"
          >
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        ))}
        {extra}
      </div>
    </div>
  )
}
