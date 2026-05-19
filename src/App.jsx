import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      if (pathname === '/') window.scrollTo(0, 0)
      return
    }
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [pathname, hash])

  return null
}

function AppShell() {
  return (
    <div className="noise relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" aria-hidden />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projeto/:slug" element={<Navigate to="/#portfolio" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
