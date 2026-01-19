import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProfitCalculator from './components/ProfitCalculator'
import ResultsBreakdown from './components/ResultsBreakdown'
import Testimonials from './components/Testimonials'
import Links from './components/Links'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ResultsBreakdown />
        <ProfitCalculator />
        <Testimonials />
        <Links />
        <Footer />
      </main>
    </div>
  )
}
