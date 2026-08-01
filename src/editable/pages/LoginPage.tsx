import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/login',
    title: 'Sign in',
    description: pagesContent.auth.login.metadataDescription,
  })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-[.55fr_.45fr]">
          {/* Form column */}
          <div className={`flex items-center px-[var(--editable-pad-x)] py-20`}>
            <div className="mx-auto w-full max-w-md">
              <span className={dc.type.eyebrow}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
                {pagesContent.auth.login.badge}
              </span>
              <h1 className="editable-display mt-8 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {pagesContent.auth.login.title}
              </h1>
              <p className={`mt-6 ${dc.type.body}`}>{pagesContent.auth.login.description}</p>
              <div className="mt-10">
                <p className="editable-mono text-[var(--slot4-muted-text)]">
                  {pagesContent.auth.login.formTitle}
                </p>
                <EditableLocalLoginForm />
                <p className="mt-6 text-[14px] text-[var(--slot4-muted-text)]">
                  New here?{' '}
                  <Link
                    href="/signup"
                    className="font-medium text-[var(--slot4-page-text)] underline-offset-4 hover:underline"
                  >
                    {pagesContent.auth.login.createCta}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Brand panel — reference-style oversized wordmark on ash */}
          <aside className="hidden bg-[var(--slot4-panel-bg)] lg:flex">
            <div className="mx-auto flex w-full max-w-md flex-col justify-between px-[var(--editable-pad-x)] py-20">
              <div>
                <p className="editable-mono text-[var(--slot4-muted-text)]">Editors’ desk</p>
                <p className="editable-display mt-6 text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.02em]">
                  A quiet workspace for people who add to {SITE_CONFIG.name}.
                </p>
              </div>
              <ul className="mt-10 space-y-4 text-[14px] text-[var(--slot4-muted-text)]">
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--slot4-page-text)]" />
                  <span>Track the submissions you’ve sent to the editors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--slot4-page-text)]" />
                  <span>Upload files directly to the open library.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--slot4-page-text)]" />
                  <span>Leave notes on your own records so an editor can pick them up.</span>
                </li>
              </ul>
              <div
                aria-hidden
                className="editable-display mt-16 whitespace-nowrap text-[clamp(3rem,8vw,6rem)] font-semibold leading-none tracking-[-0.05em] text-[var(--slot4-page-text)]/10"
              >
                {SITE_CONFIG.name}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
