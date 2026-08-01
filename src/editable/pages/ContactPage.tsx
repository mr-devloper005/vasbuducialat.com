'use client'

import { Building2, FileText, Mail, MapPin, Sparkles, Clock } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(_kind: ReturnType<typeof getProductKind>) {
  return [
    {
      icon: Building2,
      title: 'Submit a directory record',
      body: 'A place, a service, or a community group we should add to the Community Directory.',
    },
    {
      icon: FileText,
      title: 'Contribute a Field Note',
      body: 'A guide, brief, or reference file you’d like to add to the open library.',
    },
    {
      icon: MapPin,
      title: 'Flag a correction',
      body: 'An address, phone number, or opening hours that doesn’t match reality any more.',
    },
    {
      icon: Sparkles,
      title: 'Editorial questions',
      body: 'Ask about the checklist, the review process, or how a record gets ranked.',
    },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
          <EditableReveal>
            <span className={dc.type.eyebrow}>
              <Mail className="h-3.5 w-3.5" /> {pagesContent.contact.eyebrow}
            </span>
          </EditableReveal>
          <div className="mt-8 grid gap-10 lg:grid-cols-[.55fr_.45fr] lg:items-end">
            <EditableReveal index={1}>
              <h1 className="editable-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.035em] [text-wrap:balance]">
                {pagesContent.contact.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`${dc.type.bodyLg} lg:pb-2`}>{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        <section className={`${dc.shell.section} pb-24 pt-20`}>
          <div className="grid gap-10 lg:grid-cols-[.45fr_.55fr] lg:items-start">
            {/* Lanes + response-time note */}
            <div>
              <EditableReveal>
                <p className="editable-mono text-[var(--slot4-muted-text)]">Route your message</p>
              </EditableReveal>
              <div className="mt-6 space-y-4">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className="rounded-[8px] border border-[color:var(--editable-border)] bg-white p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
                          <lane.icon className="h-4 w-4" />
                        </span>
                        <h2 className="editable-display text-[18px] font-medium leading-[1.2] tracking-[-0.02em]">
                          {lane.title}
                        </h2>
                      </div>
                      <p className="mt-3 text-[15px] leading-[1.55] text-[var(--slot4-muted-text)]">
                        {lane.body}
                      </p>
                    </div>
                  </EditableReveal>
                ))}
              </div>

              <EditableReveal index={5}>
                <div className="mt-8 rounded-[8px] border border-[color:var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6">
                  <p className="editable-mono text-[var(--slot4-muted-text)]">Response time</p>
                  <p className="editable-display mt-3 text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                    A human editor reads every message within two working days.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[13px] text-[var(--slot4-muted-text)]">
                    <Clock className="h-3.5 w-3.5" /> Weekdays, roughly office hours.
                  </div>
                </div>
              </EditableReveal>

            </div>

            {/* Form panel */}
            <EditableReveal index={2}>
              <div className="rounded-[8px] border border-[color:var(--editable-border)] bg-white p-8 lg:sticky lg:top-24">
                <h2 className="editable-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  {pagesContent.contact.formTitle}
                </h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* FAQ block */}
        <section className={`${dc.shell.section} pb-24`}>
          <div className="grid gap-12 lg:grid-cols-[.35fr_.65fr] lg:items-start">
            <EditableReveal>
              <div>
                <span className={dc.type.eyebrow}>Common asks</span>
                <h2 className={`${dc.type.sectionTitle} mt-6`}>Before you write.</h2>
              </div>
            </EditableReveal>
            <div className="divide-y divide-[var(--slot4-stroke-strong)] border-t border-[var(--slot4-stroke-strong)]">
              {[
                {
                  q: 'Can you rush a record onto the site?',
                  a: 'We can’t. Every submission passes an editorial checklist first — that’s the whole point of the directory.',
                },
                {
                  q: 'I run a business. Can I pay to appear higher?',
                  a: 'No. Ranking is editorial, not sold. Send us the record and, if it’s a fit, an editor will publish it.',
                },
                {
                  q: 'A file I downloaded is out of date.',
                  a: 'Flag it here — we’ll refresh the file and re-issue it with a new "Updated" timestamp.',
                },
              ].map((item, i) => (
                <EditableReveal key={item.q} index={i}>
                  <details className="group/faq py-6">
                    <summary className="flex cursor-pointer items-baseline justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                      <h3 className="editable-display text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                        {item.q}
                      </h3>
                      <span aria-hidden className="text-[var(--slot4-muted-text)] transition-transform duration-300 group-open/faq:rotate-45">＋</span>
                    </summary>
                    <p className="mt-4 max-w-[560px] text-[15px] leading-[1.55] text-[var(--slot4-muted-text)]">
                      {item.a}
                    </p>
                  </details>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
