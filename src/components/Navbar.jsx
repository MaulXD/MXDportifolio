import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Mail } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#about' },
  { label: 'Habilidades', href: '#skills' },
  { label: 'Experiência', href: '#experience' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Contato', href: '#contact' },
]

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
        scrolled ? 'border-b border-white/5 bg-bg-900/70 py-3 backdrop-blur-xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('#hero')
          }}
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
        </a>

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
                className="relative px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg border border-neon-green/20 bg-neon-green/10"
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
          href="mailto:contato@raulxd.eu"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="glass-hover hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-neon-green md:flex"
        >
          <Mail size={16} />
          E-mail
        </motion.a>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white md:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass absolute left-4 right-4 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 md:hidden"
          >
            <nav className="flex flex-col p-2">
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
                      isActive ? 'bg-neon-green/10 text-neon-green' : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                )
              })}
              <a
                href="mailto:contato@raulxd.eu"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-neon-green/10 px-4 py-3 text-sm font-medium text-neon-green"
              >
                <Mail size={16} />
                contato@raulxd.eu
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
