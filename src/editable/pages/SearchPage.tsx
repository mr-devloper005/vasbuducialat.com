import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
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
const displayLabel = (key: string) => LABEL_OVERRIDES[key] ?? key

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ')
const compactText = (v: unknown) =>
  typeof v === 'string' ? stripHtml(v).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.find((i) => typeof i?.url === 'string')?.url
    : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((i) => typeof i === 'string') as string | undefined)
    : ''
  return (
    media ||
    compactRaw(content.featuredImage) ||
    compactRaw(content.image) ||
    compactRaw(content.thumbnail) ||
    images ||
    ''
  )
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((v) => compactText(v).includes(query))
}

function ResultRow({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((i) => i.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const summary = summaryOf(post)
  const image = getImage(post)
  const label = displayLabel(task || 'article')
  return (
    <Link
      href={href}
      className="group/btn grid gap-4 border-b border-[color:var(--editable-border)] py-8 first:border-t sm:grid-cols-[.7fr_.3fr] sm:gap-10"
    >
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="editable-mono text-[var(--slot4-muted-text)]">
            №/{String(index + 1).padStart(2, '0')}
          </span>
          <span className={dc.badge.pill}>{label}</span>
        </div>
        <h3 className="editable-display mt-4 line-clamp-2 text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.5] text-[var(--slot4-muted-text)]">
          {summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-page-text)]">
          Open
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </span>
      </div>
      {image ? (
        <div className="overflow-hidden rounded-[8px] border border-[color:var(--editable-border)]">
          <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks
          .filter((i) => i.enabled)
          .flatMap((i) => getMockPostsForTask(i.key))
  const results = posts
    .filter((post) => matches(post, normalized, category, task))
    .slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((i) => i.enabled)

  // Group results by task for a plain grouped list.
  const groups = new Map<string, SitePost[]>()
  for (const post of results) {
    const key = getPostTaskKey(post) || 'article'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(post)
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-8 pt-20 sm:pt-28`}>
          <span className={dc.type.eyebrow}>
            <Search className="h-3.5 w-3.5" />
            {pagesContent.search.hero.badge}
          </span>
          <div className="mt-8 grid gap-10 lg:grid-cols-[.45fr_.55fr] lg:items-end">
            <h1 className="editable-display text-[clamp(2.25rem,5.4vw,4.125rem)] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
              {pagesContent.search.hero.title}
            </h1>
            <p className={`${dc.type.bodyLg} lg:pb-2`}>{pagesContent.search.hero.description}</p>
          </div>

          <form
            action="/search"
            className="mt-10 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
          >
            <input type="hidden" name="master" value="1" />
            <label className="flex h-14 items-center gap-3 rounded-full border border-[color:var(--editable-border)] bg-white px-6 transition-colors duration-300 focus-within:border-[var(--slot4-page-text)]">
              <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
              <input
                name="q"
                defaultValue={query}
                placeholder={pagesContent.search.hero.placeholder}
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--slot4-muted-text)]"
              />
            </label>
            <label className="flex h-14 items-center gap-2 rounded-full border border-[color:var(--editable-border)] bg-white px-4 text-[14px] font-medium text-[var(--slot4-page-text)]">
              <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
              <select
                name="task"
                defaultValue={task}
                className="appearance-none bg-transparent pr-2 outline-none"
              >
                <option value="">All surfaces</option>
                {enabledTasks.map((i) => (
                  <option key={i.key} value={i.key}>
                    {displayLabel(i.key)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] px-8 text-[14px] font-medium text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white"
            >
              Search
            </button>
            <input type="hidden" name="category" value={category} />
          </form>
        </section>

        <section className={`${dc.shell.section} pb-24 pt-4`}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--slot4-stroke-strong)] pt-8">
            <p className="text-[15px] text-[var(--slot4-muted-text)]">
              <span className="editable-display text-[18px] font-medium text-[var(--slot4-page-text)]">
                {results.length.toString().padStart(2, '0')}
              </span>{' '}
              {query ? `results for “${query}”` : pagesContent.search.resultsTitle}
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--slot4-page-text)]"
            >
              Browse the directory <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-8 space-y-14">
              {Array.from(groups.entries()).map(([key, posts]) => (
                <div key={key}>
                  <div className="flex items-baseline gap-3">
                    <h2 className="editable-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
                      {displayLabel(key)}
                    </h2>
                    <span className="editable-mono text-[var(--slot4-muted-text)]">
                      {posts.length.toString().padStart(2, '0')} result{posts.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="mt-4">
                    {posts.map((post, i) => (
                      <ResultRow key={post.id || post.slug} post={post} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-14 border-y border-[var(--slot4-stroke-strong)] py-24 text-center">
              <h2 className="editable-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
                Nothing matched — yet.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.55] text-[var(--slot4-muted-text)]">
                Try a broader keyword or a different surface. If you know of an entry that should exist, add it via the submissions desk.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {enabledTasks.slice(0, 6).map((i) => (
                  <Link key={i.key} href={i.route} className={dc.badge.pill}>
                    {displayLabel(i.key)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
