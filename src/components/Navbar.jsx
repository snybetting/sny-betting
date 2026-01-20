import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'Results', href: '#results' },
  { label: 'Profit Calculator', href: '#calculator' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Get Started', href: '#links' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`nav-pill hidden md:flex items-center gap-2 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 pr-4 border-r border-white/10">
          <img
            src={logo}
            alt="SNY Betting"
            className="w-8 h-8 rounded-full object-cover"
          />
        </a>

        {/* Nav Links */}
        <div className="flex items-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Floating Hamburger */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`md:hidden fixed top-5 right-5 z-[100] p-3 rounded-full backdrop-blur-sm bg-[#333333]/80 shadow-lg ${isMobileMenuOpen ? 'active' : ''}`}
        aria-label="Toggle menu"
        style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
      >
        <div className={`hamburger-icon ${isMobileMenuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav z-[95] ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="absolute inset-0 z-0 pointer-events-none animate-gradient-shift" style={{
          background: `linear-gradient(110deg, #333333 0%, #333333 25%, rgba(208, 240, 192, 0.08) 40%, rgba(208, 240, 192, 0.12) 50%, rgba(208, 240, 192, 0.08) 60%, #333333 75%, #333333 100%)`,
          backgroundSize: '200% 100%',
        }} />
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="relative z-10 text-white text-2xl font-semibold py-4 px-8 rounded-xl hover:text-primary hover:bg-white/5 transition-all"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
