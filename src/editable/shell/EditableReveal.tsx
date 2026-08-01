'use client'

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  className?: string
  delay?: number
  disabled?: boolean
}

export function EditableReveal({
  children,
  index = 0,
  className,
  delay,
  disabled = false,
}: EditableRevealProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const attach = useCallback((el: HTMLDivElement | null) => setNode(el), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || disabled || !node) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [mounted, disabled, node])

  const style: CSSProperties = {
    transitionDelay: `${delay ?? Math.min(index * 90, 480)}ms`,
  }
  const classes = [
    'editable-reveal',
    mounted && !disabled ? 'is-mounted' : '',
    visible ? 'is-visible' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={attach} className={classes} style={style}>
      {children}
    </div>
  )
}

export default EditableReveal
