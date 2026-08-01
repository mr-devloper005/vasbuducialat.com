'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks — a human editor will read it soon.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@yourstreet.com" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone" placeholder="Optional" />
        <Field name="subject" label="About" placeholder="Corrections, submissions, something else" />
      </div>
      <label className="grid gap-2 text-[13px] font-medium text-[var(--slot4-muted-text)]">
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need — an editor will reply."
          className="rounded-[8px] border border-[color:var(--editable-border)] bg-white px-4 py-3 text-[15px] text-[var(--slot4-page-text)] outline-none transition-colors duration-300 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div
          className={`flex items-start gap-2 rounded-[8px] border px-4 py-3 text-[14px] ${
            status === 'success'
              ? 'border-[color:var(--editable-border)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]'
              : 'border-[color:var(--editable-border)] bg-white text-[var(--slot4-page-text)]'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent-fill)]" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] text-[14px] font-medium text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-2 text-[13px] font-medium text-[var(--slot4-muted-text)]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-[8px] border border-[color:var(--editable-border)] bg-white px-4 text-[15px] text-[var(--slot4-page-text)] outline-none transition-colors duration-300 placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]"
      />
    </label>
  )
}
