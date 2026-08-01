import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`
  return (
    <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <section className={`${dc.shell.section} pb-16 pt-20 sm:pt-28`}>
        <span className={dc.type.eyebrow}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
          {voice.eyebrow}
        </span>
        <div className="mt-8 grid gap-10 lg:grid-cols-[.55fr_.45fr] lg:items-end">
          <h1 className="editable-display text-[clamp(2.25rem,5.4vw,4.125rem)] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
            {voice.headline}
          </h1>
          <p className={`${dc.type.bodyLg} lg:pb-2`}>{voice.description}</p>
        </div>
        <form action={basePath} className="mt-10 flex flex-wrap items-center gap-3">
          <select
            name="category"
            defaultValue={category || 'all'}
            className="h-11 min-w-[220px] rounded-full border border-[color:var(--editable-border)] bg-white px-5 text-[14px] font-medium outline-none transition-colors duration-300 focus:border-[var(--slot4-page-text)]"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            className="inline-flex h-11 items-center rounded-full bg-[var(--slot4-accent-fill)] px-6 text-[14px] font-medium text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white"
          >
            Filter
          </button>
        </form>
      </section>

      <section className={`${dc.shell.section} pb-24`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <ArticleListCard
                key={post.id}
                post={post}
                href={postHref('article', post, basePath)}
                index={index + (page - 1) * pagination.limit}
              />
            ))}
          </div>
        ) : (
          <div className="border-y border-[var(--slot4-stroke-strong)] py-24 text-center">
            <h2 className="editable-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
              Nothing published in this category — yet.
            </h2>
            <p className="mt-4 text-[15px] text-[var(--slot4-muted-text)]">
              Try another topic, or return to the full journal.
            </p>
          </div>
        )}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-[14px]">
          {pagination.hasPrevPage ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 font-medium transition-colors duration-300 hover:border-[var(--slot4-page-text)]"
            >
              Previous
            </Link>
          ) : null}
          <span className="rounded-full bg-[var(--slot4-panel-bg)] px-5 py-2.5 font-medium text-[var(--slot4-muted-text)]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 font-medium transition-colors duration-300 hover:border-[var(--slot4-page-text)]"
            >
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({
  slug,
  post,
}: {
  slug: string
  post: SitePost | null
}) {
  const voice = taskPageVoices.article
  return (
    <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <article className="mx-auto max-w-[var(--editable-container-sm)] px-[var(--editable-pad-x)] py-16 sm:py-24">
        <Link
          href="/article"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Field journal
        </Link>
        <span className={`${dc.type.eyebrow} mt-10 inline-flex`}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
          {voice.eyebrow}
        </span>
        <h1 className="editable-display mt-6 text-[clamp(2rem,5vw,3.875rem)] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
          {post?.title || pagesContent.detailPages.article.fallbackTitle}
        </h1>
        <p className={`mt-8 ${dc.type.lead}`}>
          {post?.summary ||
            `The full entry will appear here once an editor publishes ${slug}.`}
        </p>
        <div className="mt-10">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 text-[14px] font-medium text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)]">
            Reach an editor <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </main>
  )
}
