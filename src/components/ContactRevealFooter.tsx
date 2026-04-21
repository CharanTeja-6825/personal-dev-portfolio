import { FormEvent, useLayoutEffect, useRef } from 'react'
import { ensureGsap } from '@/lib/gsap'
import MagneticButton from '@/components/MagneticButton'

const CONTACT_EMAIL = 'rcharanteja2006@gmail.com'

export default function ContactRevealFooter() {
  const footerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const footer = footerRef.current
    if (!footer) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      return
    }

    const { gsap } = ensureGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footer,
        { yPercent: 32 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1.05,
          },
        },
      )
    }, footer)

    return () => {
      ctx.revert()
    }
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') || ''
    const email = formData.get('email') || ''
    const message = formData.get('message') || ''

    const subject = `${String(name)} · Portfolio Inquiry`
    const body = `Sender: ${String(name)} (${String(email)})\n\n${String(
      message,
    )}`

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative flex min-h-screen items-center border-t border-chalk/10 px-6 py-20 md:px-12"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2 md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-electric">
            Contact
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.94] tracking-tight text-chalk">
            Let&apos;s build your next unfair advantage.
          </h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-cursor="interactive"
            className="mt-8 inline-block text-lg uppercase tracking-[0.22em] text-neon hover:text-chalk"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-chalk/65">
              Name
            </span>
            <input
              required
              name="name"
              type="text"
              data-cursor="interactive"
              className="w-full border-b border-chalk/30 bg-transparent px-0 py-3 text-base text-chalk outline-none transition-colors focus:border-neon"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-chalk/65">
              Email
            </span>
            <input
              required
              name="email"
              type="email"
              data-cursor="interactive"
              className="w-full border-b border-chalk/30 bg-transparent px-0 py-3 text-base text-chalk outline-none transition-colors focus:border-neon"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-chalk/65">
              Brief
            </span>
            <textarea
              required
              rows={4}
              name="message"
              data-cursor="interactive"
              className="w-full border-b border-chalk/30 bg-transparent px-0 py-3 text-base text-chalk outline-none transition-colors focus:border-neon"
            />
          </label>

          <MagneticButton type="submit">Launch Conversation</MagneticButton>
        </form>
      </div>
    </footer>
  )
}
