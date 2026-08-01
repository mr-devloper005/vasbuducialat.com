import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Get started',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-[.45fr_.55fr]">
          {/* Brand panel */}
          <aside className="hidden bg-[var(--slot4-panel-bg)] lg:flex">
            <div className="mx-auto flex w-full max-w-md flex-col justify-between px-[var(--editable-pad-x)] py-20">
              <div>
                <p className="editable-mono text-[var(--slot4-muted-text)]">What an account unlocks</p>
                <p className="editable-display mt-6 text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.02em]">
                  Add a place. Publish a file. Save what you find.
                </p>
              </div>
              <ul className="mt-10 space-y-4 text-[14px] text-[var(--slot4-muted-text)]">
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--slot4-page-text)]" />
                  <span>Submit a Community Directory record — reviewed by a human editor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--slot4-page-text)]" />
                  <span>Publish a Field Note to the open library.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--slot4-page-text)]" />
                  <span>Bookmark records and files so you can find them again.</span>
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

          {/* Form column */}
          <div className={`flex items-center px-[var(--editable-pad-x)] py-20`}>
            <div className="mx-auto w-full max-w-md">
              <span className={dc.type.eyebrow}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
                {pagesContent.auth.signup.badge}
              </span>
              <h1 className="editable-display mt-8 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {pagesContent.auth.signup.title}
              </h1>
              <p className={`mt-6 ${dc.type.body}`}>{pagesContent.auth.signup.description}</p>
              <div className="mt-10">
                <p className="editable-mono text-[var(--slot4-muted-text)]">
                  {pagesContent.auth.signup.formTitle}
                </p>
                <EditableLocalSignupForm />
                <p className="mt-6 text-[14px] text-[var(--slot4-muted-text)]">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-[var(--slot4-page-text)] underline-offset-4 hover:underline"
                  >
                    {pagesContent.auth.signup.loginCta}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
