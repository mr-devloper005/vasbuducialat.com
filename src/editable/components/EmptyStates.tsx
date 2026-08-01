import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Not available yet',
  description = 'New entries will appear here once an editor publishes them.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'border-y border-[var(--slot4-stroke-strong)] py-20 text-center',
        className,
      )}
    >
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--slot4-panel-bg)]">
        <SearchX className="h-5 w-5 text-[var(--slot4-page-text)]" />
      </div>
      <h2 className="editable-display mt-6 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.55] text-[var(--slot4-muted-text)]">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-5 py-2.5 text-[14px] font-medium text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)]"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({
  taskLabel = 'entries',
  className,
}: {
  taskLabel?: string
  className?: string
}) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Once an editor publishes new ${taskLabel}, they will land here — the layout is ready for them.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="A human editor will read it within two working days. Thanks for writing in."
      actionLabel="Back to home"
      actionHref="/"
    />
  )
}
