import Link from 'next/link'
import { ArrowUpRight, Send } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialFeatureCard,
  RailPostCard,
  getEditableCategory,
  getEditableExcerpt,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const LABEL_OVERRIDES: Record<string, string> = {
  listing: 'Community Directory',
  pdf: 'Field Notes',
  article: 'Field journal',
  image: 'Contact sheet',
  classified: 'Noticeboard',
  sbm: 'Shelf',
  profile: 'Neighbours',
}

function displayLabel(key: string) {
  return LABEL_OVERRIDES[key] ?? key
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function realImages(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className={dc.type.eyebrow}>
    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
    {children}
  </span>
)

/* ------------------------------------------------------------------ */
/*  1. HERO — reference signature: centered running paragraph with     */
/*     inline photo pills interleaved between phrases.                 */
/* ------------------------------------------------------------------ */

export function EditableHomeHero({ primaryTask: _p, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const chips = realImages(pool, 6)

  const { badge, description, primaryCta, secondaryCta } = pagesContent.home.hero

  // Break the headline into phrases; interleave photo chips between phrases.
  const phrases = [
    'A hand-verified',
    'neighbourhood directory',
    'and an',
    'open library of files',
    'kept quietly in the',
    'community',
  ]

  return (
    <section className="relative pt-16 sm:pt-24 lg:pt-32">
      <div className={`${dc.shell.section} text-center`}>
        <EditableReveal>
          <div className="flex justify-center">
            <SectionEyebrow>{badge}</SectionEyebrow>
          </div>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display mx-auto mt-8 max-w-[1050px] text-center text-[clamp(2rem,5.2vw,4.125rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--slot4-page-text)] [text-wrap:balance]">
            {phrases.map((phrase, i) => {
              const chip = chips[i]
              return (
                <span key={i}>
                  {i > 0 ? ' ' : ''}
                  <span className="whitespace-nowrap">{phrase}</span>
                  {chip ? (
                    <>
                      {' '}
                      <span
                        className="inline-flex h-[0.72em] w-auto shrink-0 translate-y-[0.06em] overflow-hidden rounded-full border border-[color:var(--editable-border)] align-middle"
                        style={{ aspectRatio: '3 / 1' }}
                        aria-hidden
                      >
                        <img
                          src={chip}
                          alt=""
                          className="block h-full w-full object-cover"
                        />
                      </span>
                    </>
                  ) : null}
                </span>
              )
            })}
          </h1>
        </EditableReveal>

        <EditableReveal index={2}>
          <p className={`mx-auto mt-8 max-w-[720px] ${dc.type.bodyLg}`}>{description}</p>
        </EditableReveal>

        <EditableReveal index={3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href={primaryCta.href || primaryRoute} className={dc.button.primary}>
              {primaryCta.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={secondaryCta.href} className={dc.button.secondary}>
              {secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>

        {/* Inline search — pill with inset circular send button (reference signature). */}
        <EditableReveal index={4}>
          <form
            action="/search"
            className="mx-auto mt-14 flex max-w-[560px] items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                name="q"
                placeholder={pagesContent.home.hero.searchPlaceholder}
                className="h-14 w-full rounded-full border border-[color:var(--editable-border)] bg-white pl-6 pr-16 text-[15px] text-[var(--slot4-page-text)] placeholder-[var(--slot4-muted-text)] outline-none transition-colors duration-300 focus:border-[var(--slot4-page-text)]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  2. STORY-RAIL — asymmetric split: title left, description right,   */
/*     followed by a horizontal rail of Field Notes tiles              */
/*     (document-forward, no photography — the reference's "shelf").   */
/* ------------------------------------------------------------------ */

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 8)
  if (!pool.length) return null

  return (
    <section className={`${dc.shell.section} ${dc.shell.sectionYSm}`}>
      <EditableReveal>
        <div className="grid gap-6 lg:grid-cols-[1.18fr_1fr] lg:items-end">
          <div>
            <SectionEyebrow>From the shelf</SectionEyebrow>
            <h2 className={`${dc.type.sectionTitle} mt-6`}>
              Open files, quietly kept.
            </h2>
          </div>
          <p className={`${dc.type.bodyLg} lg:pb-3`}>
            A short shelf of downloadable Field Notes — licence templates, meeting minutes, small-business briefs — hosted in the open and marked with the date they were last checked.
          </p>
        </div>
      </EditableReveal>

      <EditableReveal index={1}>
        <div
          className="editable-marquee mt-12"
          style={{ ['--editable-marquee-duration' as string]: `${Math.max(24, pool.length * 5)}s` }}
        >
          <div className="editable-marquee-track">
            {[...pool, ...pool].map((post, i) => (
              <FieldNoteTile
                key={`${post.id || post.slug || 'tile'}-${i}`}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                index={i % pool.length}
              />
            ))}
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}

function FieldNoteTile({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getEditableCategory(post)
  return (
    <Link
      href={href}
      className={`group/btn ${dc.layout.minRailCard} flex flex-col justify-between rounded-[8px] border border-[color:var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition-colors duration-300 hover:bg-white`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className={dc.badge.pill}>{category}</span>
          <span className={`${pal.mutedText} text-[13px]`}>№ {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className={`editable-display mt-8 line-clamp-3 text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.02em] ${pal.pageText}`}>
          {post.title}
        </h3>
      </div>
      <div className="mt-10 flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          <span className={dc.badge.metaChip}>Field Note</span>
          <span className={dc.badge.metaChip}>Open access</span>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--slot4-page-text)] text-white transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  3. MAGAZINE SPLIT — the "editorial" band. One large feature +      */
/*     stack of two smaller entries on the right (7/5 asymmetric).     */
/*     Sits on an ash-tinted full-bleed panel.                         */
/* ------------------------------------------------------------------ */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (pool.length === 0) return null
  const [feature, ...rest] = pool
  const supporting = rest.slice(0, 3)

  return (
    <section className={`${pal.panelBg} py-[var(--editable-section-y)]`}>
      <div className={dc.shell.section}>
        <EditableReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionEyebrow>Featured record</SectionEyebrow>
              <h2 className={`${dc.type.sectionTitle} mt-6 max-w-[720px]`}>
                Editor’s pick from the {displayLabel('listing').toLowerCase()}.
              </h2>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              View the whole directory
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.18fr_1fr] lg:items-start">
          <EditableReveal index={1}>
            <EditorialFeatureCard
              post={feature}
              href={postHref(primaryTask, feature, primaryRoute)}
              label="Verified record"
            />
          </EditableReveal>
          <div className="grid gap-4">
            {supporting.map((post, i) => (
              <EditableReveal key={post.id || post.slug} index={i + 2}>
                <ArticleListCard
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={i}
                />
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  4. STATS band + Categories grid + How it works + Editorial index   */
/*     + FAQ + Closing CTA — packaged in EditableTimeCollections.      */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: 'How is a record added to the Community Directory?',
    a: 'Anyone can submit a place, person, or organisation through the submissions desk. An editor then checks the address, hours, and contact details against a public checklist before publishing.',
  },
  {
    q: 'What kinds of files live in Field Notes?',
    a: 'Downloadable guides, briefs, licence templates, meeting minutes, and small-business reference material. Every file is open access — no sign-up, no paywall — with format and file size on the record.',
  },
  {
    q: 'Do you accept sponsored placements?',
    a: 'No. Nothing here is pay-to-list. Directory records are ranked by editorial judgement, not by payment. If you notice a placement that reads like advertising, tell an editor.',
  },
  {
    q: 'A record is wrong. How do I fix it?',
    a: 'Send a note via the contact page. Every message is read by a human editor within two working days, and corrections usually go live the same week.',
  },
]

const STEPS = [
  {
    title: 'Submit',
    body:
      'Send a place or a file through the submissions desk. Anyone with an account can submit — no editor sign-off required to try.',
  },
  {
    title: 'Reviewed',
    body:
      'An editor reads what you sent, checks the details against a public checklist, and asks you for anything missing.',
  },
  {
    title: 'Published',
    body:
      'Once it passes review the record lands in the directory or the library — with a clear timestamp and a way for neighbours to flag a correction.',
  },
]

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const tiles = pool.slice(0, 4)
  const indexList = pool.slice(4, 10)
  const enabledTasks = SITE_CONFIG.tasks.filter((t) => t.enabled)
  const recordCount = pool.length
  const categorySet = new Set(pool.map(getEditableCategory).filter(Boolean))

  return (
    <>
      {/* Trust / stats band — full-bleed ash panel with hairline breaks. */}
      <section className={`${pal.panelBg}`}>
        <div className={`${dc.shell.section} py-14 sm:py-20`}>
          <div className="grid gap-8 border-t border-[var(--slot4-stroke-strong)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: recordCount || 120, l: 'Verified records live in the directory' },
              { n: enabledTasks.length, l: 'Editorial surfaces kept in one place' },
              { n: categorySet.size || 24, l: 'Categories across neighbourhood life' },
              { n: 2, l: 'Working days to hear back from an editor' },
            ].map((s, i) => (
              <EditableReveal key={i} index={i}>
                <div>
                  <p className="editable-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-page-text)]">
                    {s.n.toString().padStart(2, '0')}
                  </p>
                  <p className={`mt-4 ${pal.mutedText} text-[15px] leading-[1.5]`}>{s.l}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — 4-up plain grid, small mono meta */}
      <section className={`${dc.shell.section} ${dc.shell.sectionYSm}`}>
        <EditableReveal>
          <div className="grid gap-6 lg:grid-cols-[.35fr_.65fr] lg:items-end">
            <div>
              <SectionEyebrow>Browse by surface</SectionEyebrow>
              <h2 className={`${dc.type.sectionTitle} mt-6`}>
                Every corner of the platform, on one shelf.
              </h2>
            </div>
            <p className={`${dc.type.bodyLg}`}>
              Each surface is a different way in — the Community Directory for places, Field Notes for downloadable files, the Field journal for slow reads. Same editorial checklist, same open policy.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {enabledTasks.map((task, i) => (
            <EditableReveal key={task.key} index={i}>
              <Link
                href={task.route}
                className="group/btn flex h-full flex-col justify-between rounded-[8px] border border-[color:var(--editable-border)] bg-white p-6 transition-colors duration-300 hover:border-[var(--slot4-page-text)]"
              >
                <div>
                  <span className="editable-mono text-[var(--slot4-muted-text)]">
                    S/{String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="editable-display mt-6 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
                    {displayLabel(task.key)}
                  </h3>
                  <p className={`mt-3 ${pal.mutedText} text-[14px] leading-[1.5]`}>
                    {task.description}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--slot4-page-text)]">
                  Open
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </span>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </section>

      {/* Process — numbered rows with oversized numerals + hairline dividers */}
      <section className={`${dc.shell.section} ${dc.shell.sectionYSm}`}>
        <EditableReveal>
          <div className="grid gap-6 lg:grid-cols-[.45fr_.55fr] lg:items-end">
            <div>
              <SectionEyebrow>How it works</SectionEyebrow>
              <h2 className={`${dc.type.sectionTitle} mt-6`}>
                Submit, get read, get published.
              </h2>
            </div>
            <p className={`${dc.type.bodyLg}`}>
              The rhythm is deliberately slow. A person reads every submission, a person checks every file — because that is what makes the directory trustworthy.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-14">
          {STEPS.map((step, i) => (
            <EditableReveal key={step.title} index={i}>
              <div className="grid gap-6 border-t border-[var(--slot4-stroke-strong)] py-10 lg:grid-cols-[auto_.28fr_.72fr] lg:items-baseline lg:gap-12">
                <span className="editable-display text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--slot4-muted-text)]/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="editable-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.1] tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className={`${dc.type.bodyLg} max-w-[540px]`}>{step.body}</p>
              </div>
            </EditableReveal>
          ))}
          <div className="border-t border-[var(--slot4-stroke-strong)]" />
        </div>
      </section>

      {/* Editorial index — plain typographic list of latest entries. */}
      {indexList.length > 0 ? (
        <section className={`${pal.panelBg}`}>
          <div className={`${dc.shell.section} py-[var(--editable-section-y)]`}>
            <EditableReveal>
              <div className="grid gap-6 lg:grid-cols-[.35fr_.65fr] lg:items-end">
                <div>
                  <SectionEyebrow>The index</SectionEyebrow>
                  <h2 className={`${dc.type.sectionTitle} mt-6`}>
                    Latest across the platform.
                  </h2>
                </div>
                <p className={`${dc.type.bodyLg}`}>
                  A running index of what neighbours added this week — records, files, and reads, laid out plainly.
                </p>
              </div>
            </EditableReveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-[.47fr_1px_.53fr] lg:items-start">
              <div>
                {indexList.slice(0, Math.ceil(indexList.length / 2)).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <CompactIndexCard
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      index={i}
                    />
                  </EditableReveal>
                ))}
              </div>
              <div className="hidden h-full w-px bg-[var(--slot4-stroke-strong)] lg:block" />
              <div>
                {indexList.slice(Math.ceil(indexList.length / 2)).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <CompactIndexCard
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      index={i + Math.ceil(indexList.length / 2)}
                    />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Editorial "picks" — three cards using the RailPostCard shape,
          rendered as a static grid this time (mixing card shapes across the page). */}
      {tiles.length > 0 ? (
        <section className={`${dc.shell.section} ${dc.shell.sectionYSm}`}>
          <EditableReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SectionEyebrow>Picks this week</SectionEyebrow>
                <h2 className={`${dc.type.sectionTitle} mt-6`}>
                  What the editors flagged.
                </h2>
              </div>
              <Link href={primaryRoute} className={dc.button.ghost}>
                Everything else
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.slice(0, 4).map((post, i) => (
              <EditableReveal key={post.id || post.slug} index={i}>
                <RailPostCard
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={i}
                />
              </EditableReveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ — split heading left / accordion right (asymmetric) */}
      <section className={`${dc.shell.section} ${dc.shell.sectionYSm}`}>
        <div className="grid gap-12 lg:grid-cols-[.35fr_.65fr] lg:items-start">
          <EditableReveal>
            <div>
              <SectionEyebrow>Common questions</SectionEyebrow>
              <h2 className={`${dc.type.sectionTitle} mt-6`}>
                Before you submit or download.
              </h2>
              <p className={`mt-6 ${dc.type.body} max-w-[320px]`}>
                Still unsure? Reach an editor — a person replies within two working days.
              </p>
              <Link href="/contact" className={`${dc.button.secondary} mt-6`}>
                Reach an editor
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          <div className="divide-y divide-[var(--slot4-stroke-strong)] border-t border-[var(--slot4-stroke-strong)]">
            {FAQS.map((item, i) => (
              <EditableReveal key={item.q} index={i}>
                <details className="group/faq py-8">
                  <summary className="flex cursor-pointer items-baseline justify-between gap-6 list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="editable-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                      {item.q}
                    </h3>
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[color:var(--editable-border)] text-[var(--slot4-page-text)] transition-transform duration-300 group-open/faq:rotate-45"
                    >
                      <span className="block h-px w-3.5 bg-current" />
                      <span className="block h-3.5 w-px -translate-x-[7px] -translate-y-[7px] bg-current" />
                    </span>
                  </summary>
                  <p className={`mt-5 max-w-[640px] ${dc.type.body}`}>{item.a}</p>
                </details>
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  5. CLOSING CTA — dark full-bleed panel with amber pill CTA.        */
/* ------------------------------------------------------------------ */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className={`${pal.darkBg} ${pal.darkText}`}>
      <div className={`${dc.shell.section} py-[var(--editable-section-y)]`}>
        <div className="grid gap-10 lg:grid-cols-[1.18fr_1fr] lg:items-end">
          <EditableReveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[13px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
                {cta.badge}
              </span>
              <h2 className={`editable-display mt-8 text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]`}>
                {cta.title}
              </h2>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="lg:pb-4">
              <p className="text-[17px] leading-[1.55] text-white/70">{cta.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-[14px] font-medium leading-none text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-white hover:text-[var(--slot4-page-text)]">
                  {cta.primaryCta.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-medium leading-none text-white transition-colors duration-300 hover:bg-white hover:text-[var(--slot4-page-text)]">
                  {cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

// keep the excerpt helper API stable
export { getEditableExcerpt }
