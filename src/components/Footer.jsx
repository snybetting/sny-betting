export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="section-dark py-8 px-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Copyright */}
          <div className="text-white/50 text-sm">
            © {currentYear} SNY Betting
          </div>

          {/* Disclaimer */}
          <div className="text-white/40 text-xs">
            Gamble responsibly. 18+ only. If you need support, visit{' '}
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              BeGambleAware.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
