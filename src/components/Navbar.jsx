import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'Calculator', href: '#calculator' },
  { label: 'Results', href: '#results' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Links', href: '#links' },
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

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-100 flex items-center justify-between bg-dark rounded-full px-4 py-3 shadow-lg border border-white/10">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img
            src={logo}
            alt="SNY Betting"
            className="w-8 h-8 rounded-full object-cover"
          />
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`hamburger z-100 ${isMobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="text-white hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
