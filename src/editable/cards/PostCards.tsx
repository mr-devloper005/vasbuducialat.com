import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

// Dedupe helper: content API can emit the same asset across media[], images[],
// image, featuredImage and logo. Any gallery collecting them must dedupe first.
export function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      urls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url) => url.length > 0),
    ),
  )
}

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Editors’ pick'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/*
  Four visually-distinct cards, matching the reference's flat 8px border style.
  - EditorialFeatureCard: large. Media on top (16:9), oversized title below in
    display face, generous whitespace, arrow slide on hover.
  - RailPostCard: horizontal-rail card — compact 4/3 media, tight meta.
  - CompactIndexCard: text-forward, no image; oversized numeral + hairline top
    border + arrow that slides on hover.
  - ArticleListCard: horizontal row — media left, title/excerpt/meta right,
    stacked on mobile.
*/

export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  return (
    <Link
      href={href}
      className={`group/btn block min-w-0 overflow-hidden ${dc.surface.card} ${dc.motion.zoom} p-6 sm:p-8`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratioWide}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className={`absolute left-4 top-4 ${dc.badge.pill}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
          {label}
        </span>
      </div>
      <div className="mt-6">
        <p className={`${pal.mutedText} text-[13px] font-medium`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] ${pal.pageText}`}>
          {post.title}
        </h3>
        <p className={`mt-4 max-w-2xl text-[16px] leading-[1.55] ${pal.mutedText}`}>
          {getEditableExcerpt(post, 200)}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--slot4-page-text)]">
          Read the piece
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </span>
      </div>
    </Link>
  )
}

export function RailPostCard({
  post,
  href,
  index: _index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className={`group/btn ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.zoom}`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className={`${pal.mutedText} text-[13px] font-medium`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display line-clamp-3 text-[20px] font-medium leading-[1.2] tracking-[-0.02em] ${pal.pageText}`}>
          {post.title}
        </h3>
        <p className={`line-clamp-2 text-[14px] leading-[1.5] ${pal.mutedText}`}>
          {getEditableExcerpt(post, 110)}
        </p>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-page-text)]">
          Open
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className="group/btn block min-w-0 border-t border-[color:var(--editable-border)] py-6 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-8">
        <span className="editable-display text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.03em] text-[var(--slot4-muted-text)]/50">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`${pal.mutedText} text-[13px] font-medium`}>{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-1 line-clamp-2 text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.02em] ${pal.pageText}`}>
            {post.title}
          </h3>
        </div>
        <ArrowUpRight className="hidden h-5 w-5 text-[var(--slot4-page-text)] transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 sm:block" />
      </div>
    </Link>
  )
}

export function ArticleListCard({
  post,
  href,
  index: _index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className={`group/btn grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.zoom} sm:grid-cols-[0.45fr_0.55fr] sm:gap-8 sm:p-5`}
    >
      <div className={`${dc.media.frame} aspect-[16/11] sm:aspect-auto sm:h-full sm:min-h-[220px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 py-2 sm:py-4">
        <p className={`${pal.mutedText} text-[13px] font-medium`}>{getEditableCategory(post)}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] ${pal.pageText}`}>
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[16px] leading-[1.55] ${pal.mutedText}`}>
          {getEditableExcerpt(post, 200)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--slot4-page-text)]">
          Continue reading
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </span>
      </div>
    </Link>
  )
}
