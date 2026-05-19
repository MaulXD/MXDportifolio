import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#about' },
  { label: 'Como trabalho', href: '#como-trabalho' },
  { label: 'Habilidades', href: '#skills' },
  { label: 'Experiência', href: '#experience' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Contato', href: '#contact' },
]

const SECTION_IDS = [...NAV_LINKS.map((l) => l.href.slice(1)), 'orcamento']

const NAVBAR_SOLID = 'border-white/10 bg-bg-950/85 backdrop-blur-md'

const MOBILE_MENU_PANEL =
  'border border-white/10 bg-bg-950 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [barHeight, setBarHeight] = useState(72)
  const barRef = useRef(null)

  const isSolid = scrolled || menuOpen

  useEffect(() => {
    const measure = () => {
      if (barRef.current) setBarHeight(barRef.current.offsetHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [menuOpen, scrolled])

  useEffect(() => {
    if (!isHome) return undefined

    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      const offset = 120
      let current = 'hero'
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    if (isHome) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate(`/${href}`)
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] border-b transition-all duration-500 ${
        isSolid ? `${NAVBAR_SOLID} py-3` : 'border-transparent bg-transparent py-5'
      }`}
    >
      <motion.div
        ref={barRef}
        className={`relative z-[102] mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 ${
          isSolid ? 'bg-bg-950/95' : ''
        }`}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-2.5"
        >
          <img
            src="/favicon-mxd.png"
            alt="Raul Luz"
            className="h-9 w-9 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Raul<span className="text-neon-green">.</span>Luz
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1)
            const isActive = activeSection === id
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="relative px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg border border-neon-green/30 bg-neon-green/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-neon-green' : ''}`}>
                  {link.label}
                </span>
              </a>
            )
          })}
        </nav>

        <motion.a
          href="#orcamento"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('#orcamento')
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hidden items-center gap-2 rounded-xl bg-neon-green px-4 py-2 text-sm font-semibold text-bg-950 transition-shadow hover:shadow-[0_0_20px_rgba(0,255,157,0.35)] md:flex"
        >
          Solicitar Orçamento
        </motion.a>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg-950/85 text-white backdrop-blur-md md:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 bottom-0 z-[99] bg-bg-950/95 backdrop-blur-md md:hidden"
              style={{ top: barHeight }}
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              key="menu-panel"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute left-4 right-4 top-full z-[101] mt-2 overflow-hidden rounded-2xl ${MOBILE_MENU_PANEL} md:hidden`}
            >
              <nav className="flex flex-col bg-bg-950 p-2">
                {NAV_LINKS.map((link, i) => {
                  const id = link.href.slice(1)
                  const isActive = activeSection === id
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href)
                      }}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'text-white hover:bg-bg-800'
                      }`}
                    >
                      {link.label}
                    </motion.a>
                  )
                })}
                <a
                  href="#orcamento"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('#orcamento')
                  }}
                  className="mt-2 flex items-center justify-center rounded-xl bg-neon-green px-4 py-3.5 text-sm font-semibold text-bg-950 transition-shadow hover:shadow-[0_0_24px_rgba(0,255,157,0.35)]"
                >
                  Solicitar Orçamento
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
