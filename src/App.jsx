import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Portfolio from './components/Portfolio'
import BudgetForm from './components/BudgetForm'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="noise relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" aria-hidden />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Portfolio />
        <BudgetForm />
        <Contact />
      </main>
    </div>
  )
}
