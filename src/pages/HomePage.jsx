import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import CreativeProcess from '../components/CreativeProcess'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Portfolio from '../components/Portfolio'
import BudgetForm from '../components/BudgetForm'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <CreativeProcess />
        <Skills />
        <Experience />
        <Portfolio />
        <BudgetForm />
        <Contact />
      </main>
    </>
  )
}
