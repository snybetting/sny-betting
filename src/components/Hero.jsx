import { Send, Users, ArrowRight } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Hero() {
  return (
    <section className="relative h-[78vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-[#333333]">
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

      {/* Static subtle green ambient glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 100% 40% at 50% 55%,
            rgba(208, 240, 192, 0.06) 0%,
            rgba(208, 240, 192, 0.03) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* Bottom transition glow towards white section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(208, 240, 192, 0.08) 100%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mt-2">
        {/* Pill badge */}
        <a
          href="https://t.me/+KRBoF_MnFuhhZDVk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-10 animate-fade-up transition-shadow duration-300 ease-out hover:shadow-[0_0_15px_rgba(208,240,192,0.25),0_0_30px_rgba(208,240,192,0.15)]"
          style={{
            backgroundColor: '#D0F0C0',
            color: '#333333',
            fontSize: '0.875rem',
            fontWeight: '700',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
          }}
        >
          Free bet shared for tonight
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Logo */}
        <div className="mb-7 animate-fade-up delay-100">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden border-2 border-primary/30">
            <img
              src={logo}
              alt="SNY Betting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 animate-fade-up delay-200 text-white leading-tight">
          Bet on sports like a professional
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed animate-fade-up delay-300 px-2">
          Join <span className="text-[#D0F0C0] font-semibold">10,000+</span> members beating the bookies, consistently.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-up delay-400 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="https://t.me/+KRBoF_MnFuhhZDVk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <Send className="w-5 h-5" />
            Join Free Telegram
          </a>

          <a
            href="https://t.me/+67pZuXXVM6pmZmRk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <Users className="w-5 h-5" />
            Copy every bet I place
          </a>
        </div>
      </div>
    </section>
  )
}
