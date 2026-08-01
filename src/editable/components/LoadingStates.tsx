import { cn } from '@/lib/utils'

type LoadingStateProps = { label?: string; className?: string }

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[8px] bg-[var(--slot4-panel-bg)]', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)] py-16', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <p className="editable-mono text-[var(--slot4-muted-text)]">{label}</p>
      <PulseBlock className="mt-8 h-16 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-1/2 max-w-xl" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[8px] border border-[color:var(--editable-border)] p-6">
            <PulseBlock className="h-40 w-full" />
            <PulseBlock className="mt-5 h-4 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({
  count = 6,
  className,
}: LoadingStateProps & { count?: number }) {
  return (
    <div
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
      aria-live="polite"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[8px] border border-[color:var(--editable-border)] p-5"
        >
          <PulseBlock className="h-40 w-full" />
          <PulseBlock className="mt-4 h-4 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-[var(--editable-pad-x)] py-16 lg:grid-cols-[1fr_360px]',
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div>
        <p className="editable-mono text-[var(--slot4-muted-text)]">{label}</p>
        <PulseBlock className="mt-6 h-16 w-4/5" />
        <PulseBlock className="mt-6 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-8 aspect-[16/9] w-full" />
      </div>
      <PulseBlock className="h-96 w-full" />
    </div>
  )
}
