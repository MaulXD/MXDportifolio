import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'

const ACCENTS = {
  green: {
    stroke: '#00FF9D',
    strokeEnd: '#0EA5E9',
    border: 'border-neon-green/40',
    bg: 'bg-neon-green/10',
    glow: 'shadow-[0_0_12px_rgba(0,255,157,0.2)]',
  },
  cyan: {
    stroke: '#0EA5E9',
    strokeEnd: '#00FF9D',
    border: 'border-neon-cyan/40',
    bg: 'bg-neon-cyan/10',
    glow: 'shadow-[0_0_12px_rgba(14,165,233,0.2)]',
  },
  violet: {
    stroke: '#8B5CF6',
    strokeEnd: '#0EA5E9',
    border: 'border-neon-violet/40',
    bg: 'bg-neon-violet/10',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.25)]',
  },
}

const STROKE_INSET = 1
const CORNER_RX = 12

export default function NeonSelectButton({
  active,
  accent = 'cyan',
  onClick,
  children,
  className = '',
  layout = 'row',
}) {
  const a = ACCENTS[accent] ?? ACCENTS.cyan
  const uid = useId()
  const cardRef = useRef(null)
  const [strokeKey, setStrokeKey] = useState(0)
  const [size, setSize] = useState({ w: 0, h: 0 })

  const measure = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
  }, [])

  useLayoutEffect(() => {
    measure()
    const el = cardRef.current
    if (!el) return undefined

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  useLayoutEffect(() => {
    if (strokeKey > 0) measure()
  }, [strokeKey, measure])

  const layoutClass =
    layout === 'col'
      ? 'flex-col items-center gap-2 px-3 py-4 text-center'
      : 'items-center gap-2.5 px-3 py-2.5 text-left text-sm'

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
    measure()
    setStrokeKey((k) => k + 1)
  }

  const { w, h } = size
  const rectW = Math.max(0, w - STROKE_INSET * 2)
  const rectH = Math.max(0, h - STROKE_INSET * 2)

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative w-full rounded-xl ${className}`}
    >
      <span
        ref={cardRef}
        className={`relative flex w-full rounded-xl border transition-colors duration-300 ${layoutClass} ${
          active
            ? `${a.border} ${a.bg} text-white ${a.glow}`
            : 'border-white/10 bg-bg-900/50 text-white/60 hover:border-white/20'
        }`}
      >
        {strokeKey > 0 && w > 0 && h > 0 && (
          <svg
            key={strokeKey}
            width={w}
            height={h}
            className="neon-card-stroke pointer-events-none absolute left-0 top-0 z-10 overflow-visible"
            aria-hidden
          >
            <defs>
              <linearGradient id={`stroke-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={a.stroke} />
                <stop offset="100%" stopColor={a.strokeEnd} />
              </linearGradient>
            </defs>
            <rect
              x={STROKE_INSET}
              y={STROKE_INSET}
              width={rectW}
              height={rectH}
              rx={CORNER_RX}
              ry={CORNER_RX}
              fill="none"
              stroke={`url(#stroke-${uid})`}
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
            />
          </svg>
        )}

        <span className={`relative z-[1] flex w-full ${layout === 'col' ? 'flex-col items-center gap-2' : 'items-center gap-2.5'}`}>
          {children}
        </span>
      </span>
    </button>
  )
}
