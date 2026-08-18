import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProfitCalculator from './components/ProfitCalculator'
import ResultsBreakdown from './components/ResultsBreakdown'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Links from './components/Links'
import Footer from './components/Footer'
import { capture } from './lib/analytics'

// DOM id -> reported section name.
const TRACKED_SECTIONS = [
  ['hero', 'hero'],
  ['results', 'results'],
  ['calculator', 'calculator'],
  ['reviews', 'testimonials'],
  ['faq', 'faq'],
  ['links', 'get_started'],
]

// A plain 0.5 threshold never fires for a section taller than the viewport,
// because its visible ratio can never reach 50%. Observing at a fine-grained
// set of ratios lets the callback run as such a section scrolls through, where
// the height check below decides whether it counts as viewed.
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20)

export default function App() {
  // Reporting only. This observer never sets state and never gates rendering,
  // so it cannot affect what paints or when.
  useEffect(() => {
    const names = new Map()
    const seen = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const name = names.get(entry.target)
          if (!name || seen.has(name)) continue

          // Viewed = half the section is on screen, or the section covers half
          // the viewport (the case for sections taller than the viewport).
          const viewportHeight = entry.rootBounds?.height || window.innerHeight
          const viewed =
            entry.intersectionRatio >= 0.5 ||
            entry.intersectionRect.height >= viewportHeight * 0.5
          if (!viewed) continue

          seen.add(name)
          capture('section_viewed', { section: name })
          // Fire once per page load - never again on scroll-back.
          observer.unobserve(entry.target)
        }
      },
      { threshold: THRESHOLDS }
    )

    for (const [id, name] of TRACKED_SECTIONS) {
      const el = document.getElementById(id)
      if (!el) continue
      names.set(el, name)
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ResultsBreakdown />
        <ProfitCalculator />
        <Testimonials />
        <FAQ />
        <Links />
        <Footer />
      </main>
    </div>
  )
}
