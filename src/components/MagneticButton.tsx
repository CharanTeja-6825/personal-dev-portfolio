import { motion, useMotionValue, useSpring } from 'framer-motion'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PointerEvent,
  ReactNode,
} from 'react'

interface BaseProps {
  children: ReactNode
  className?: string
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }
type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type MagneticButtonProps = ButtonProps | AnchorProps

const spring = { stiffness: 240, damping: 20, mass: 0.35 }

export default function MagneticButton(props: MagneticButtonProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, spring)
  const springY = useSpring(y, spring)

  const onPointerMove = (event: PointerEvent) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - bounds.left - bounds.width / 2
    const offsetY = event.clientY - bounds.top - bounds.height / 2

    x.set(offsetX * 0.25)
    y.set(offsetY * 0.25)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  const baseClass =
    'inline-flex items-center justify-center rounded-full border border-neon/70 bg-neon px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-obsidian transition-shadow duration-300 hover:shadow-neon'

  if ('href' in props && props.href) {
    const { children, className = '', href, ...anchorProps } = props

    return (
      <motion.a
        {...anchorProps}
        href={href}
        data-cursor="interactive"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.96 }}
        className={`${baseClass} ${className}`}
      >
        {children}
      </motion.a>
    )
  }

  const { children, className = '', type = 'button', ...buttonProps } = props

  return (
    <motion.button
      {...buttonProps}
      type={type}
      data-cursor="interactive"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`${baseClass} ${className}`}
    >
      {children}
    </motion.button>
  )
}
