import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Send,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

// Local pickRandom kept inside src/editable/ per the boundary rule.
function pickRandom<T>(arr: T[]): T | undefined {
  if (!arr || !arr.length) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
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

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>,
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

// ---------- Helpers (unchanged plumbing) ----------
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((i) => i?.url).filter((u): u is string => typeof u === 'string' && isUrl(u))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((u): u is string => typeof u === 'string' && isUrl(u))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((k) => asText(content[k]))
    .filter((u) => u && isUrl(u))
  return dedupeUrls([...media, ...images, ...singleImages]).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (v: string) => (/^https?:\/\//i.test(v) ? v : '#')
const linkifyMarkdown = (v: string) =>
  v.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`,
  )
const linkifyText = (v: string) =>
  linkifyMarkdown(v).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`,
  )
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )
const formatPlainText = (raw: string) => {
  const v = raw.trim()
  if (!v) return ''
  if (/<[a-z][\s\S]*>/i.test(v)) return sanitizeHtml(linkifyMarkdown(v))
  return v
    .split(/\n{2,}/)
    .map((p) => `<p>${linkifyText(escapeHtml(p).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}
const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const comparable = (v: string) =>
  stripHtml(v).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const leadText = (post: SitePost) => {
  const s = summaryText(post)
  if (!s) return ''
  const lead = stripHtml(s)
  if (!lead) return ''
  const key = comparable(lead)
  return key && comparable(getBody(post)).includes(key) ? '' : lead
}
const categoryOf = (post: SitePost, fb: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fb
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

function formatBytes(bytes: number) {
  if (!bytes || bytes < 1) return ''
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

// Explicit-first: read fileSize/pages if the API supplies them.
const explicitFileSize = (post: SitePost) => {
  const c = getContent(post)
  return asText(c.fileSize) || asText(c.size)
}
const explicitPages = (post: SitePost) => {
  const c = getContent(post)
  const n = Number(c.pages)
  return n > 0 ? Math.round(n) : 0
}

// Fetch the real PDF once (small enough to inspect). Uses server fetch — Next
// caches the response for the route's revalidate window. Latin1 decode preserves
// binary bytes as chars so the "/Type /Page" regex can count page objects.
async function fetchPdfStats(url: string): Promise<{ size: string; pages: number }> {
  if (!/^https?:\/\//i.test(url)) return { size: '', pages: 0 }
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return { size: '', pages: 0 }
    const buf = await res.arrayBuffer()
    const bytes = buf.byteLength
    let pages = 0
    // Cap parsing at 40 MB to avoid pathological files.
    if (bytes > 0 && bytes < 40 * 1024 * 1024) {
      const text = new TextDecoder('latin1').decode(new Uint8Array(buf))
      // Match `/Type /Page` (or `/Type/Page`) NOT followed by a letter (which
      // would make it `/Pages`, the catalog node). Handles common PDF variants.
      const matches = text.match(/\/Type\s*\/Page(?![a-zA-Z])/g)
      if (matches) pages = matches.length
      // Fallback: read /Count from the /Pages root when the above yields 0.
      if (!pages) {
        const count = text.match(/\/Pages[\s\S]{0,400}?\/Count\s+(\d+)/)
        if (count) pages = Number(count[1]) || 0
      }
    }
    return { size: formatBytes(bytes), pages }
  } catch {
    return { size: '', pages: 0 }
  }
}

// Resolve real values with explicit-first, then live-fetch fallback.
async function resolvePdfStats(post: SitePost, url: string) {
  const size0 = explicitFileSize(post)
  const pages0 = explicitPages(post)
  if (size0 && pages0) return { size: size0, pages: pages0 }
  const live = await fetchPdfStats(url)
  return {
    size: size0 || live.size || '—',
    pages: pages0 || live.pages || 0,
  }
}

// ---------- Shell view (unchanged export shape) ----------
export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? (
          <ArticleDetail post={post} related={related} comments={comments} />
        ) : null}
      </main>
    </EditableSiteShell>
  )
}

// ---------- Common bits ----------
function BackLink({ task }: { task: TaskKey }) {
  const tc = getTaskConfig(task)
  return (
    <Link
      href={tc?.route || '/'}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--tk-muted)] transition-colors duration-300 hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {displayLabel(task)}
    </Link>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-raised)] px-3 py-1 text-[13px] font-medium text-[var(--tk-text)]">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--tk-accent)]" />
      {children}
    </span>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-[1.7]' : 'text-[17px] leading-[1.75]'
      }`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagsRow({ post }: { post: SitePost }) {
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : []
  if (!tags.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {tags.slice(0, 8).map((t) => (
        <span key={t} className={dc.badge.pill}>
          <Tag className="h-3 w-3" />
          {t}
        </span>
      ))}
    </div>
  )
}

// ---------- ARTICLE ----------
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-[var(--editable-container-sm)] px-[var(--editable-pad-x)] py-16 sm:py-24">
        <BackLink task="article" />
        <div className="mt-10">
          <Eyebrow>{categoryOf(post, 'Field journal')}</Eyebrow>
        </div>
        <h1 className="editable-display mt-6 text-[clamp(2.25rem,5.4vw,4.125rem)] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
          {post.title}
        </h1>
        <p className="mt-6 text-[15px] text-[var(--tk-muted)]">By {SITE_CONFIG.name}</p>
        {images[0] ? (
          <div className="mt-12 overflow-hidden rounded-[8px] border border-[var(--tk-line)]">
            <img
              src={images[0]}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : null}
        <div className="mt-12">
          <BodyContent post={post} />
        </div>
        <TagsRow post={post} />
        <div className="mt-16">
          <EditableArticleComments slug={post.slug} comments={comments} />
        </div>
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

// ---------- LISTING (Community Directory) — premium business record ----------
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'schedule']) || 'Everyday, 09:00 – 18:00'
  const category = getField(post, ['category'])
  const mapSrc = mapSrcFor(post)
  const sidebarAdSize = pickRandom(getSlotSizes('sidebar'))

  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pt-12 sm:pt-16">
        <BackLink task="listing" />
        <div className="mt-10">
          <Eyebrow>Verified directory record</Eyebrow>
        </div>
        <h1 className="editable-display mt-6 text-[clamp(2.25rem,5vw,3.875rem)] font-semibold leading-[1.03] tracking-[-0.03em] [text-wrap:balance]">
          {post.title}
        </h1>
        {category ? (
          <p className="mt-4 text-[15px] text-[var(--tk-muted)]">{category}</p>
        ) : null}
      </section>

      {hero ? (
        <section className="mx-auto mt-10 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
          <div className="relative overflow-hidden rounded-[8px] border border-[var(--tk-line)]">
            <img
              src={hero}
              alt=""
              className="aspect-[21/9] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(6,15,30,0.62))]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[13px] font-medium text-[var(--tk-text)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
                Editor verified
              </span>
              {address ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[13px] font-medium text-[var(--tk-text)]">
                  <MapPin className="h-3.5 w-3.5" /> {address}
                </span>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Quick-facts strip */}
      <section className="mx-auto mt-10 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <div className="grid gap-6 border-y border-[var(--slot4-stroke-strong)] py-8 sm:grid-cols-2 lg:grid-cols-4">
          <FactCell icon={MapPin} label="Where" value={address || '—'} />
          <FactCell icon={Phone} label="Call" value={phone || '—'} />
          <FactCell icon={Clock} label="Hours" value={hours} />
          <FactCell icon={CheckCircle2} label="Status" value="Verified by editors" />
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="mx-auto mt-16 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <article className="min-w-0">
            <h2 className="editable-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              About this record
            </h2>
            {leadText(post) ? (
              <p className={`mt-6 ${dc.type.lead}`}>{leadText(post)}</p>
            ) : null}
            <div className="mt-8">
              <BodyContent post={post} />
            </div>
            <TagsRow post={post} />

            {gallery.length ? (
              <div className="mt-14">
                <h3 className="editable-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                  From the record
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.slice(0, 6).map((image, i) => (
                    <div
                      key={image + i}
                      className="overflow-hidden rounded-[8px] border border-[var(--tk-line)]"
                    >
                      <img
                        src={image}
                        alt=""
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {mapSrc ? (
              <div className="mt-14 overflow-hidden rounded-[8px] border border-[var(--tk-line)]">
                <div className="flex items-center gap-2 border-b border-[var(--tk-line)] p-4 text-[14px] font-medium">
                  <MapPin className="h-4 w-4 text-[var(--tk-accent)]" />
                  {address || 'Map'}
                </div>
                <iframe
                  src={mapSrc}
                  title="Map"
                  loading="lazy"
                  className="h-80 w-full border-0"
                />
              </div>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[8px] border border-[var(--tk-line)] bg-white p-6">
              <p className="editable-mono text-[var(--tk-muted)]">Contact</p>
              <div className="mt-4 divide-y divide-[var(--tk-line)]">
                {address ? <SideRow icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <SideRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <SideRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? (
                  <SideRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} external />
                ) : null}
                <SideRow icon={Clock} label="Hours" value={hours} />
              </div>
              {(phone || email || website) ? (
                <Link
                  href={phone ? `tel:${phone}` : email ? `mailto:${email}` : website || '#'}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
                >
                  {phone ? 'Call the record' : email ? 'Write to them' : 'Visit website'}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            <div className="mt-6 rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6">
              <p className="editable-mono text-[var(--tk-muted)]">Editorial checklist</p>
              <ul className="mt-4 space-y-3 text-[14px] text-[var(--tk-text)]">
                {[
                  'Address checked against public records',
                  'Contact reached in the last review',
                  'Independently owned or community-run',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Ads slot="sidebar" size={sidebarAdSize} showLabel className="mx-auto w-full" />
            </div>
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function FactCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--tk-muted)]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="editable-display mt-2 text-[18px] font-medium leading-[1.25] tracking-[-0.02em]">
        {value}
      </p>
    </div>
  )
}

function SideRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const content = (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--tk-raised)] text-[var(--tk-text)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] text-[var(--tk-muted)]">{label}</p>
        <p className="mt-0.5 break-words text-[14px] font-medium">{value}</p>
      </div>
    </div>
  )
  if (href)
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block transition-colors duration-300 hover:text-[var(--tk-accent)]"
      >
        {content}
      </a>
    )
  return content
}

// ---------- CLASSIFIED ----------
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pt-12 sm:pt-16">
        <BackLink task="classified" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[.55fr_.45fr] lg:items-end">
          <div>
            <Eyebrow>Noticeboard entry</Eyebrow>
            <h1 className="editable-display mt-6 text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
              {post.title}
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="editable-display text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--tk-text)]">
              {price || 'Open offer'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {condition ? <span className={dc.badge.pill}>{condition}</span> : null}
              {location ? (
                <span className={dc.badge.pill}>
                  <MapPin className="h-3 w-3" /> {location}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <article className="min-w-0">
            {images.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {images.slice(0, 4).map((image, i) => (
                  <div key={image + i} className="overflow-hidden rounded-[8px] border border-[var(--tk-line)]">
                    <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-12">
              <BodyContent post={post} />
            </div>
            <TagsRow post={post} />
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[8px] border border-[var(--tk-line)] bg-white p-6">
              <p className="editable-mono text-[var(--tk-muted)]">Get in touch</p>
              <div className="mt-4 flex flex-col gap-2">
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--editable-border)] px-5 py-3 text-[14px] font-medium text-[var(--tk-text)] transition-colors duration-300 hover:border-[var(--tk-text)]"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--editable-border)] px-5 py-3 text-[14px] font-medium text-[var(--tk-text)] transition-colors duration-300 hover:border-[var(--tk-text)]"
                  >
                    <Globe2 className="h-4 w-4" /> Website
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

// ---------- IMAGE ----------
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : [`/placeholder.svg?height=900&width=1200`]
  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pt-12 sm:pt-16">
        <BackLink task="image" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[.35fr_.65fr] lg:items-end">
          <div>
            <Eyebrow>Contact sheet frame</Eyebrow>
            <h1 className="editable-display mt-6 text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              {post.title}
            </h1>
          </div>
          <p className={`${dc.type.bodyLg} lg:pb-2`}>{leadText(post)}</p>
        </div>
      </section>
      <section className="mx-auto mt-14 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((image, i) => (
            <figure
              key={image + i}
              className="overflow-hidden rounded-[8px] border border-[var(--tk-line)]"
            >
              <img src={image} alt="" className="aspect-[4/5] w-full object-cover" />
            </figure>
          ))}
        </div>
        <div className="mt-14">
          <BodyContent post={post} compact />
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

// ---------- BOOKMARK ----------
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-[var(--editable-container-sm)] px-[var(--editable-pad-x)] py-16 sm:py-24">
        <BackLink task="sbm" />
        <div className="mt-10">
          <Eyebrow>Saved to the shelf</Eyebrow>
        </div>
        <div className="mt-6 grid h-16 w-16 place-items-center rounded-full bg-[var(--tk-raised)] text-[var(--tk-text)]">
          <Bookmark className="h-6 w-6" />
        </div>
        <h1 className="editable-display mt-8 text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          {post.title}
        </h1>
        {leadText(post) ? <p className={`mt-8 ${dc.type.lead}`}>{leadText(post)}</p> : null}
        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
          >
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <div className="mt-12">
          <BodyContent post={post} />
        </div>
        <TagsRow post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

// ---------- PDF (Field Notes) — document workspace ----------
async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const category = categoryOf(post, 'Reference')
  const { size: fileSize, pages } = await resolvePdfStats(post, fileUrl)
  const uploader = SITE_CONFIG.name
  const bottomAdSize = pickRandom(getSlotSizes('article-bottom'))
  const sidebarAdSize = pickRandom(getSlotSizes('sidebar'))
  const sections = post.tags?.length ? post.tags.slice(0, 6) : ['Overview', 'How to use', 'References']

  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pt-12 sm:pt-16">
        <BackLink task="pdf" />
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <Eyebrow>Reference document</Eyebrow>
          <span className={dc.badge.pill}>Field Note</span>
          <span className={dc.badge.pill}>{category}</span>
        </div>
        {/* PDF h1 is deliberately LARGER than the listing h1 */}
        <h1 className="editable-display mt-8 text-[clamp(2.5rem,6.8vw,5rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]">
          {post.title}
        </h1>

        {leadText(post) ? (
          <blockquote className="editable-display mx-auto mt-10 max-w-3xl border-l-2 border-[var(--slot4-stroke-strong)] pl-6 text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-[1.4] tracking-[-0.02em] text-[var(--tk-text)]">
            “{leadText(post)}”
          </blockquote>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          {fileUrl ? (
            <>
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
              >
                Download <Download className="h-4 w-4" />
              </Link>
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-6 py-3 text-[14px] font-medium text-[var(--tk-text)] transition-colors duration-300 hover:border-[var(--tk-text)]"
              >
                Open in new tab <ExternalLink className="h-4 w-4" />
              </Link>
            </>
          ) : null}
        </div>
      </section>

      {/* Quick-facts strip */}
      <section className="mx-auto mt-12 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <div className="grid gap-6 border-y border-[var(--slot4-stroke-strong)] py-8 sm:grid-cols-2 lg:grid-cols-3">
          <FactCell icon={FileText} label="Pages" value={pages > 0 ? String(pages) : '—'} />
          <FactCell icon={Download} label="File size" value={fileSize || '—'} />
          <FactCell icon={Tag} label="Format" value="Open file" />
          
        </div>
      </section>

      {/* Large embedded preview + sidebar */}
      <section className="mx-auto mt-16 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <article className="min-w-0">
            {fileUrl ? (
              <div className="overflow-hidden rounded-[8px] border border-[var(--tk-line)] bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                  <span className="text-[13px] font-medium">File preview</span>
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--tk-text)]"
                  >
                    Open externally <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={post.title}
                  className="h-[78vh] min-h-[520px] w-full bg-[var(--tk-raised)]"
                />
              </div>
            ) : null}

            <div className="mt-16 grid gap-10 lg:grid-cols-[.35fr_.65fr]">
              <div>
                <h2 className="editable-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  What’s in this file
                </h2>
              </div>
              <div>
                <BodyContent post={post} />
                <TagsRow post={post} />
              </div>
            </div>

            {/* Repeated CTA callout */}
            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-8">
              <div>
                <p className="editable-mono text-[var(--tk-muted)]">Ready to keep?</p>
                <p className="editable-display mt-3 text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.02em]">
                  Download the file — read it later, share it forward.
                </p>
              </div>
              {fileUrl ? (
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
                >
                  Download <Download className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {/* Ads slot: article-bottom, before the related strip */}
            <div className="mt-14">
              <Ads slot="article-bottom" size={bottomAdSize} showLabel className="mx-auto w-full" />
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[8px] border border-[var(--tk-line)] bg-white p-6">
              <div
                aria-hidden
                className="editable-display flex h-32 items-center justify-center rounded-[8px] bg-[var(--tk-raised)] text-[clamp(2.5rem,4vw,3.5rem)] font-semibold tracking-[-0.04em] text-[var(--tk-muted)]"
              >
                Note
              </div>
              <p className="mt-4 editable-mono text-[var(--tk-muted)]">Filename</p>
              <p className="mt-2 line-clamp-2 text-[14px] font-medium">
                {post.slug || 'field-note'}
              </p>
              <div className="mt-6 divide-y divide-[var(--tk-line)] text-[14px]">
                <SideMeta label="Category" value={category} />
                <SideMeta label="Pages" value={pages > 0 ? String(pages) : '—'} />
                <SideMeta label="File size" value={fileSize || '—'} />
                <SideMeta label="Uploaded by" value={uploader} />
                
              </div>
              {fileUrl ? (
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
                >
                  Download <Download className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            <div className="mt-6 rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6">
              <p className="editable-mono text-[var(--tk-muted)]">What’s inside</p>
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {sections.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <Send className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--tk-accent)]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Ads slot="sidebar" size={sidebarAdSize} showLabel className="mx-auto w-full" />
            </div>
          </aside>
        </div>
      </section>

      <PdfRelatedStrip related={related} />
    </>
  )
}

function SideMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <span className="text-[12px] text-[var(--tk-muted)]">{label}</span>
      <span className="text-right text-[14px] font-medium">{value}</span>
    </div>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const tc = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="editable-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            More from {displayLabel('pdf')}
          </h2>
          <Link
            href={tc?.route || '/pdf'}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--tk-text)]"
          >
            Everything else <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((post, i) => (
            <Link
              key={post.id || post.slug || i}
              href={`${tc?.route || '/pdf'}/${post.slug}`}
              className="group/btn flex h-full flex-col justify-between rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6 transition-colors duration-300 hover:bg-white"
            >
              <div>
                <div
                  aria-hidden
                  className="editable-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-none tracking-[-0.04em] text-[var(--tk-muted)]/50"
                >
                  Note
                </div>
                <h3 className="editable-display mt-6 line-clamp-3 text-[18px] font-medium leading-[1.2] tracking-[-0.02em]">
                  {post.title}
                </h3>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className={dc.badge.metaChip}>{explicitFileSize(post) || 'Open file'}</span>
                <ArrowUpRight className="h-4 w-4 text-[var(--tk-text)] transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- PROFILE ----------
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] pt-12 sm:pt-16">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[.35fr_.65fr] lg:items-end">
          <div>
            <div className="grid h-40 w-40 place-items-center overflow-hidden rounded-[8px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {images[0] ? (
                <img src={images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
              )}
            </div>
          </div>
          <div className="lg:pb-2">
            <Eyebrow>Neighbour</Eyebrow>
            <h1 className="editable-display mt-6 text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              {post.title}
            </h1>
            {role ? <p className="mt-3 text-[15px] text-[var(--tk-muted)]">{role}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-[14px] font-medium text-[var(--tk-on-accent)] transition-colors duration-300 hover:bg-[var(--tk-text)] hover:text-white"
                >
                  Visit website <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 text-[14px] font-medium text-[var(--tk-text)] transition-colors duration-300 hover:border-[var(--tk-text)]"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]">
        <BodyContent post={post} />
        <TagsRow post={post} />
        {images.slice(1).length ? (
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.slice(1, 7).map((image, i) => (
              <div
                key={image + i}
                className="overflow-hidden rounded-[8px] border border-[var(--tk-line)]"
              >
                <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

// ---------- Related strip (non-PDF) ----------
function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const tc = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="editable-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            More from {displayLabel(task)}
          </h2>
          <Link
            href={tc?.route || '/'}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--tk-text)]"
          >
            Everything else <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((post) => (
            <Link
              key={post.id || post.slug}
              href={`${tc?.route || `/${task}`}/${post.slug}`}
              className="group/btn block overflow-hidden rounded-[8px] border border-[var(--tk-line)] bg-white transition-colors duration-300 hover:border-[var(--tk-text)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
                {getImages(post)[0] ? (
                  <img
                    src={getImages(post)[0]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/btn:scale-[1.04]"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    {task === 'listing' ? (
                      <Building2 className="h-7 w-7 text-[var(--tk-muted)]" />
                    ) : (
                      <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
                    )}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="editable-display line-clamp-2 text-[16px] font-medium leading-[1.2] tracking-[-0.02em]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-[1.5] text-[var(--tk-muted)]">
                  {stripHtml(summaryText(post))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
