import { FormEvent, useLayoutEffect, useRef, useState } from 'react'
import { ensureGsap } from '@/lib/gsap'
import MagneticButton from '@/components/MagneticButton'

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSeuYvoqo02ZUEe32Yc19tbwS6oQDSpNbwQ5ZG19PDV6eY-E0g/formResponse'
const GOOGLE_FORM_FIELDS = {
  name: 'entry.1725024348',
  email: 'entry.1155754001',
  message: 'entry.1192551353',
} as const

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const CONTACT_LINKS = [
  {
    label: 'GitHub',
    value: 'CharanTeja-6825',
    href: 'https://github.com/CharanTeja-6825',
    icon: 'github-line-icon',
  },
  {
    label: 'LinkedIn',
    value: 'charan-teja-rathikindi',
    href: 'https://www.linkedin.com/in/charan-teja-rathikindi/',
    icon: 'linkedin-icon',
  },
  {
    label: 'Email',
    value: 'rcharanteja2006@gmail.com',
    href: 'mailto:rcharanteja2006@gmail.com',
    icon: 'mail-icon',
  },
] as const

function SpriteIcon({ id }: { id: string }) {
  return (
    <svg
      className="block h-5 w-5 shrink-0"
      style={{ height: '1.25rem', width: '1.25rem' }}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons.svg#${id}`} />
    </svg>
  )
}

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
        { yPercent: 24 },
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

      gsap.fromTo(
        '.contact-link',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: footer,
            start: 'top 68%',
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
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(26rem,1.12fr)] lg:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-electric">
            Contact
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.94] tracking-tight text-chalk">
            Let&apos;s build your next unfair advantage.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-chalk/65">
            Send a brief through the form, or reach me directly through the
            links below.
          </p>

          <div className="mt-8 grid gap-3">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={
                  link.href.startsWith('mailto:') ? undefined : 'noreferrer'
                }
                data-cursor="interactive"
                className="contact-link group grid gap-3 border border-chalk/10 bg-white/[0.035] p-4 transition-colors hover:border-neon/70 hover:bg-neon/10 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full border border-chalk/15 text-neon transition-colors group-hover:border-neon group-hover:text-chalk"
                  style={{ height: '2.75rem', width: '2.75rem' }}
                >
                  <SpriteIcon id={link.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-[0.28em] text-chalk/50">
                    {link.label}
                  </span>
                  <span className="mt-1 block break-words text-base font-semibold text-chalk">
                    {link.value}
                  </span>
                </span>
                <span className="hidden text-chalk/35 transition-colors group-hover:text-neon sm:block">
                  <SpriteIcon id="external-link-icon" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <section aria-labelledby="look-me-up-title" className="space-y-8">
          <p className="text-xs uppercase tracking-[0.42em] text-neon">
            Look Me Up
          </p>
          <h3
            id="look-me-up-title"
            className="mt-4 font-display text-3xl font-semibold tracking-tight text-chalk md:text-5xl"
          >
            Direct lines plus a proper brief.
          </h3>

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

              <p aria-live="polite" className="min-h-5 text-sm text-chalk/65">
                {submitState === 'success' &&
                  'Message sent. I will get back to you soon.'}
                {submitState === 'error' &&
                  'Something went wrong. Please try again or email me directly.'}
              </p>
            </div>
          </form>
        </section>
      </div>
    </footer>
  )
}
