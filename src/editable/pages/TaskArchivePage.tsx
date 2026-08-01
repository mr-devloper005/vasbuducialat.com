import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronDown,
  Globe,
  MapPin,
  Phone,
  SearchX,
  UserRound,
  Building2,
  Bookmark as BookmarkIcon,
  Download,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media
        .map((item) => item?.url)
        .filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([
    ...media,
    ...images,
    ...(isUrl(image) ? [image] : []),
    ...(isUrl(logo) ? [logo] : []),
  ]).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) =>
  value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const getSummary = (post: SitePost) =>
  stripHtml(
    post.summary ||
      asText(getContent(post).description) ||
      asText(getContent(post).excerpt) ||
      asText(getContent(post).body),
  )
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

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

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 lg:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group/btn block rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-colors duration-300 hover:border-[var(--tk-text)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = displayLabel(task)
  const categoryLabel =
    category === 'all'
      ? 'All categories'
      : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {/* HEADER — .35/.65 asymmetric split: title left, description + chips right.
            Full-bleed hairline top border to break rhythm from the navbar. */}
        <header className="border-b border-[var(--tk-line)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pb-16 pt-20 sm:pb-20 sm:pt-28">
            <EditableReveal>
              <span className={dc.type.eyebrow}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--tk-accent)]" />
                {theme.kicker}
              </span>
            </EditableReveal>

            <div className="mt-8 grid gap-10 lg:grid-cols-[.55fr_.45fr] lg:items-end">
              <EditableReveal index={1}>
                <h1 className="editable-display text-[clamp(2.25rem,5.4vw,4.125rem)] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
                  {voice?.headline || `Browse ${label}`}
                </h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <div className="lg:pb-2">
                  <p className={`${dc.type.bodyLg}`}>{voice?.description || theme.note}</p>
                  {voice?.chips?.length ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {voice.chips.map((chip) => (
                        <span key={chip} className={dc.badge.pill}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </EditableReveal>
            </div>

            {/* Filter + count row */}
            <div className="mt-12 flex flex-col gap-4 border-t border-[var(--slot4-stroke-strong)] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[15px] text-[var(--tk-muted)]">
                <span className="editable-display text-[18px] font-medium text-[var(--tk-text)]">
                  {posts.length.toString().padStart(2, '0')}
                </span>{' '}
                {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-3">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-[color:var(--editable-border)] bg-white pl-5 pr-11 text-[14px] font-medium text-[var(--tk-text)] outline-none transition-colors duration-300 focus:border-[var(--tk-text)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-5 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white">
                  Apply
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] py-20">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border-y border-[var(--slot4-stroke-strong)] py-24 text-center">
              <SearchX className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
                Nothing here yet
              </h2>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--tk-muted)]">
                Try another category — or check back after editors publish new entries in{' '}
                {label.toLowerCase()}.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-[14px]">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 font-medium transition-colors duration-300 hover:border-[var(--tk-text)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full bg-[var(--tk-raised)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 font-medium transition-colors duration-300 hover:border-[var(--tk-text)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({
  post,
  task,
  basePath,
  index,
}: {
  post: SitePost
  task: TaskKey
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--tk-text)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
    </span>
  )
}

function ArticleArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-6">
        <p className="text-[13px] font-medium text-[var(--tk-muted)]">{category}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[clamp(1.25rem,1.8vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.55] text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        <CardArrow label="Continue reading" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getField(post, ['category'])
  return (
    <Link href={href} className={`${cardBase} grid gap-4 p-5 sm:grid-cols-[128px_1fr] sm:gap-6 sm:p-6`}>
      <div className="grid aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)] sm:aspect-square sm:w-32">
        {logo ? (
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Building2 className="h-8 w-8 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        {category ? <p className="text-[13px] font-medium text-[var(--tk-muted)]">{category}</p> : null}
        <h2 className="editable-display mt-2 line-clamp-2 text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.5] text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-none tracking-[-0.03em]">
          {price || 'Open offer'}
        </span>
        {condition ? <span className={dc.badge.pill}>{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 line-clamp-2 text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-[1.2] tracking-[-0.02em]">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-[1.55] text-[var(--tk-muted)]">
        {getSummary(post)}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[12px] text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-text)] transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const ratio = index % 4 === 0 ? 'aspect-[3/4]' : index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'
  return (
    <Link
      href={href}
      className="group/btn mb-5 block break-inside-avoid overflow-hidden rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-colors duration-300 hover:border-[var(--tk-text)]"
    >
      <div className={`relative overflow-hidden ${ratio}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover/btn:scale-[1.03]" />
      </div>
      <div className="p-4">
        <h2 className="editable-display line-clamp-2 text-[16px] font-medium leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-[var(--tk-raised)]">
        <BookmarkIcon className="h-5 w-5 text-[var(--tk-text)]" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-mono text-[var(--tk-muted)]">
          №/{String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="editable-display mt-2 line-clamp-2 text-[18px] font-medium leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.5] text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        {website ? (
          <p className="mt-3 truncate text-[12px] font-medium text-[var(--tk-muted)]">
            {cleanDomain(website)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className={`${cardBase} flex flex-col justify-between p-6 sm:p-7`}>
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className={dc.badge.pill}>Reference document</span>
          <span className="editable-mono text-[var(--tk-muted)]">
            №/{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div
          aria-hidden
          className="editable-display mt-10 text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--tk-muted)]/40"
        >
          Note
        </div>
        <h2 className="editable-display mt-4 line-clamp-3 text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.5] text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <span className={dc.badge.metaChip}>{category}</span>
          <span className={dc.badge.metaChip}>Open access</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--tk-text)]">
          Open
          <Download className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link
      href={href}
      className={`${cardBase} flex flex-col items-center p-7 text-center`}
    >
      <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />
        )}
      </div>
      <h2 className="editable-display mt-5 text-[18px] font-medium tracking-[-0.02em]">
        {post.title}
      </h2>
      {role ? (
        <p className="mt-1.5 text-[13px] font-medium text-[var(--tk-muted)]">{role}</p>
      ) : null}
      <p className="mt-3 line-clamp-2 text-[13px] leading-[1.5] text-[var(--tk-muted)]">
        {getSummary(post)}
      </p>
    </Link>
  )
}
