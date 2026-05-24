import { motion } from 'framer-motion'
import { DRAW_EASE } from '../lib/drawMotion'

/** Borda que “desenha” ao redor do painel (efeito traço neon). */
export default function DrawnBorder({ className = '', stroke = 'rgba(0,255,157,0.45)' }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
      preserveAspectRatio="none"
    >
      <motion.rect
        x="0.75%"
        y="0.75%"
        width="98.5%"
        height="98.5%"
        rx="15"
        ry="15"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0.35 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.95, ease: DRAW_EASE, delay: 0.1 }}
      />
    </svg>
  )
}
