'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

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

const fieldClass =
  'h-12 w-full rounded-[8px] border border-[color:var(--editable-border)] bg-white px-4 text-[14px] text-[var(--slot4-page-text)] outline-none transition-colors duration-300 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'
const textareaClass =
  'w-full rounded-[8px] border border-[color:var(--editable-border)] bg-white px-4 py-3 text-[14px] text-[var(--slot4-page-text)] outline-none transition-colors duration-300 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((t) => t.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((i) => i.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} py-24 sm:py-32`}>
            <div className="grid gap-10 rounded-[8px] border border-[color:var(--editable-border)] bg-white p-10 lg:grid-cols-[.45fr_.55fr]">
              <div className="grid place-items-center rounded-[8px] bg-[var(--slot4-panel-bg)] p-16">
                <Lock className="h-20 w-20 text-[var(--slot4-muted-text)]" />
              </div>
              <div className="self-center">
                <span className={dc.type.eyebrow}>
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
                  {pagesContent.create.locked.badge}
                </span>
                <h1 className="editable-display mt-8 text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className={`mt-6 ${dc.type.bodyLg}`}>{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-20 sm:pt-28`}>
          <span className={dc.type.eyebrow}>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
            {pagesContent.create.hero.badge}
          </span>
          <div className="mt-8 grid gap-10 lg:grid-cols-[.55fr_.45fr] lg:items-end">
            <h1 className="editable-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              {pagesContent.create.hero.title}
            </h1>
            <p className={`${dc.type.bodyLg} lg:pb-2`}>{pagesContent.create.hero.description}</p>
          </div>
        </section>

        <section className={`${dc.shell.section} pb-24 pt-16`}>
          <div className="grid gap-10 lg:grid-cols-[.35fr_.65fr] lg:items-start">
            {/* Task picker + preview rail */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="editable-mono text-[var(--slot4-muted-text)]">Choose a surface</p>
              <div className="mt-4 space-y-2">
                {enabledTasks.map((item, i) => {
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`flex w-full items-baseline justify-between gap-3 rounded-[8px] border p-4 text-left transition-colors duration-300 ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                          : 'border-[color:var(--editable-border)] bg-white text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="editable-mono opacity-70">
                          S/{String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="editable-display mt-2 text-[18px] font-medium leading-[1.2] tracking-[-0.02em]">
                          {displayLabel(item.key)}
                        </p>
                        <p className={`mt-2 text-[13px] leading-[1.5] ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>
                          {item.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 rounded-[8px] border border-[color:var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
                <p className="editable-mono text-[var(--slot4-muted-text)]">Preview</p>
                <p className="mt-3 text-[14px] font-medium">
                  {title || 'Your submission title'}
                </p>
                <p className="mt-2 text-[13px] text-[var(--slot4-muted-text)]">
                  {category || 'Uncategorised'} · Draft
                </p>
                <p className="mt-3 line-clamp-3 text-[13px] leading-[1.5] text-[var(--slot4-muted-text)]">
                  {summary || 'A short summary of what an editor should know before opening the record.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="rounded-[8px] border border-[color:var(--editable-border)] bg-white p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="editable-mono text-[var(--slot4-muted-text)]">
                    New {displayLabel(activeTask?.key || 'article').toLowerCase()}
                  </p>
                  <h2 className="editable-display mt-3 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                    {pagesContent.create.formTitle}
                  </h2>
                </div>
                <span className={dc.badge.pill}>{session.name}</span>
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  className={fieldClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className={fieldClass}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                  />
                  <input
                    className={fieldClass}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Source or website URL"
                  />
                </div>
                <input
                  className={fieldClass}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Featured image URL"
                />
                <textarea
                  className={`${textareaClass} min-h-[100px]`}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short summary an editor will see first"
                  required
                />
                <textarea
                  className={`${textareaClass} min-h-[200px]`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Full details, notes, address, hours, sources — anything an editor needs"
                  required
                />
              </div>

              {created ? (
                <div className="mt-6 flex items-start gap-2 rounded-[8px] border border-[color:var(--editable-border)] bg-[var(--slot4-panel-bg)] p-4 text-[14px]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent-fill)]" />
                  <div>
                    <p className="font-medium">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-[13px] text-[var(--slot4-muted-text)]">
                      Saved locally as “{created.title}”. An editor will read it soon.
                    </p>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] text-[14px] font-medium text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white"
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
