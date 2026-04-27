import { FormEvent, useLayoutEffect, useRef, useState } from 'react'
import { ensureGsap } from '@/lib/gsap'
import MagneticButton from '@/components/MagneticButton'

const CONTACT_EMAIL = 'rcharanteja2006@gmail.com'
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSeuYvoqo02ZUEe32Yc19tbwS6oQDSpNbwQ5ZG19PDV6eY-E0g/formResponse'
const GOOGLE_FORM_FIELDS = {
  name: 'entry.1725024348',
  email: 'entry.1155754001',
  message: 'entry.1192551353',
} as const

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactRevealFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const googleFormData = new FormData()

    googleFormData.append(
      GOOGLE_FORM_FIELDS.name,
      String(formData.get('name') || ''),
    )
    googleFormData.append(
      GOOGLE_FORM_FIELDS.email,
      String(formData.get('email') || ''),
    )
    googleFormData.append(
      GOOGLE_FORM_FIELDS.message,
      String(formData.get('message') || ''),
    )

    setSubmitState('submitting')

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData,
      })

      form.reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
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

          <div className="flex flex-col items-start gap-3">
            <MagneticButton
              type="submit"
              disabled={submitState === 'submitting'}
              className="disabled:cursor-wait disabled:opacity-70"
            >
              {submitState === 'submitting'
                ? 'Sending...'
                : 'Launch Conversation'}
            </MagneticButton>

            <p
              aria-live="polite"
              className="min-h-5 text-sm text-chalk/65"
            >
              {submitState === 'success' &&
                'Message sent. I will get back to you soon.'}
              {submitState === 'error' &&
                'Something went wrong. Please try again or email me directly.'}
            </p>
          </div>
        </form>
      </div>
    </footer>
  )
}
