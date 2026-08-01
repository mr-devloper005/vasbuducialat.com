import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Statement hero — narrow container, oversized display */}
        <section className={`${dc.shell.narrow} pt-24 sm:pt-32`}>
          <EditableReveal>
            <span className={dc.type.eyebrow}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
              {pagesContent.about.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 text-[clamp(2.5rem,6.4vw,5rem)] font-semibold leading-[1.03] tracking-[-0.035em] [text-wrap:balance]">
              {pagesContent.about.title}
            </h1>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} py-16 sm:py-24`}>
          <div className="grid gap-10 lg:grid-cols-[.35fr_.65fr] lg:items-start">
            <EditableReveal>
              <p className="editable-mono text-[var(--slot4-muted-text)]">A note from the editors</p>
            </EditableReveal>
            <div>
              <EditableReveal index={1}>
                <p className={`${dc.type.lead}`}>{pagesContent.about.description}</p>
              </EditableReveal>
              <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((p, i) => (
                  <EditableReveal key={p} index={i + 2}>
                    <p>{p}</p>
                  </EditableReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className={`bg-[var(--slot4-panel-bg)]`}>
          <div className={`${dc.shell.section} py-20 sm:py-28`}>
            <EditableReveal>
              <div className="grid gap-8 lg:grid-cols-[.35fr_.65fr] lg:items-end">
                <div>
                  <span className={dc.type.eyebrow}>Principles</span>
                  <h2 className={`${dc.type.sectionTitle} mt-6`}>How we run the place.</h2>
                </div>
                <p className={dc.type.bodyLg}>
                  Three plain rules that hold every part of the platform in shape.
                </p>
              </div>
            </EditableReveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {pagesContent.about.values.map((v, i) => (
                <EditableReveal key={v.title} index={i}>
                  <div className="flex h-full flex-col rounded-[8px] border border-[color:var(--editable-border)] bg-white p-8">
                    <span className="editable-display text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.03em] text-[var(--slot4-muted-text)]/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="editable-display mt-8 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
                      {v.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.55] text-[var(--slot4-muted-text)]">
                      {v.description}
                    </p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className={`${dc.shell.section} py-20 sm:py-28`}>
          <div className="grid gap-8 border-t border-[var(--slot4-stroke-strong)] pt-14 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: SITE_CONFIG.tasks.filter((t) => t.enabled).length, l: 'Editorial surfaces on the platform' },
              { n: 2, l: 'Working days to hear back from an editor' },
              { n: 0, l: 'Sponsored placements accepted' },
              { n: 100, l: 'Percent of files hosted in the open' },
            ].map((s, i) => (
              <EditableReveal key={i} index={i}>
                <div>
                  <p className="editable-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.03em]">
                    {s.n.toString().padStart(2, '0')}
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.5] text-[var(--slot4-muted-text)]">{s.l}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className={`${dc.shell.section} py-24`}>
            <EditableReveal>
              <div className="grid gap-10 lg:grid-cols-[1.18fr_1fr] lg:items-end">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[13px] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
                    Add to the record
                  </span>
                  <h2 className="editable-display mt-8 text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                    Know a place, a person, or a file that belongs here?
                  </h2>
                </div>
                <div className="lg:pb-4">
                  <p className="text-[17px] leading-[1.55] text-white/70">
                    Send it in — an editor will read every word, check every link, and reply within two working days.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="/create"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-[14px] font-medium text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-white hover:text-[var(--slot4-page-text)]"
                    >
                      Submit a record
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-white hover:text-[var(--slot4-page-text)]"
                    >
                      Talk to the editors
                    </a>
                  </div>
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
