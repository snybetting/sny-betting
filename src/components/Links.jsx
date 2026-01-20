import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Users, ArrowRight } from 'lucide-react'

// X (Twitter) icon
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Telegram icon
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const LINKS = [
  {
    title: 'Get free bets daily',
    href: 'https://t.me/+KRBoF_MnFuhhZDVk',
    icon: TelegramIcon,
  },
  {
    title: 'Copy every bet I place',
    href: 'https://t.me/+67pZuXXVM6pmZmRk',
    icon: Users,
  },
  {
    title: 'Message me directly',
    href: 'https://t.me/snybetting',
    icon: MessageCircle,
  },
  {
    title: 'Follow me on Twitter',
    href: 'https://x.com/snybetting',
    icon: XIcon,
  },
]

function LinkCard({ title, href, icon: Icon, delay }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-5 rounded-xl transition-all duration-300 bg-[#4a4a4a] hover:bg-[#555555] hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/15 text-primary group-hover:bg-primary/25 transition-colors">
          <Icon />
        </div>
        <div className="font-semibold text-white">{title}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-white/40 transition-all group-hover:text-primary group-hover:translate-x-1" />
    </a>
  )
}

export default function Links() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="links"
      className="relative py-24 md:py-32 px-6 bg-[#333333] overflow-hidden"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none animate-gradient-shift"
        style={{
          background: `linear-gradient(
            110deg,
            #333333 0%,
            #333333 25%,
            rgba(208, 240, 192, 0.08) 40%,
            rgba(208, 240, 192, 0.12) 50%,
            rgba(208, 240, 192, 0.08) 60%,
            #333333 75%,
            #333333 100%
          )`,
          backgroundSize: '200% 100%',
        }}
      />

      <div className={`relative z-10 max-w-2xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Get Started
          </h2>
        </div>

        {/* Links grid - 2x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LINKS.map((link, index) => (
            <LinkCard key={index} {...link} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
