import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.18 })
  const springY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.18 })

  const [hoveringInteractive, setHoveringInteractive] = useState(false)

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    const selectors =
      'a, button, input, textarea, [data-cursor="interactive"], [role="button"]'
    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      setHoveringInteractive(Boolean(target?.closest(selectors)))
    }
    const onMouseOut = (event: MouseEvent) => {
      const target = event.relatedTarget as HTMLElement | null
      setHoveringInteractive(Boolean(target?.closest(selectors)))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [x, y])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden md:block"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-chalk/70 mix-blend-difference"
        animate={{
          scale: hoveringInteractive ? 2.8 : 1,
          backgroundColor: hoveringInteractive
            ? 'rgba(204, 255, 0, 0.42)'
            : 'rgba(245, 245, 245, 0.2)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      />
    </motion.div>
  )
}
