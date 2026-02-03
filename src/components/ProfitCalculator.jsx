import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Target, BarChart3, Calendar, Loader2, ChevronDown } from 'lucide-react'

// All Time data (including January 2026)
const ALL_TIME_DATA = {
  totalBets: 3166,
  profitUnits: 336.51,
  roi: 10.63,
  totalStaked: 3166.80,
}

// Monthly data hardcoded from spreadsheet (oldest to newest)
// 24/25 Season: 1,967 bets, 233.73 profit, 1,836.75 staked, 12.73% ROI
// 25/26 Season (Aug-Jan): 1,199 bets, 102.78 profit, 1,330.05 staked, 7.73% ROI
const MONTHLY_DATA = [
  // 24/25 Season
  { month: 'August 2024', bets: 427, profit: 48.43, staked: 347.95 },
  { month: 'September 2024', bets: 238, profit: 41.94, staked: 213.85 },
  { month: 'October 2024', bets: 243, profit: 3.82, staked: 226.20 },
  { month: 'November 2024', bets: 124, profit: 13.86, staked: 123.05 },
  { month: 'December 2024', bets: 59, profit: 2.39, staked: 58.75 },
  { month: 'January 2025', bets: 146, profit: -0.91, staked: 136.00 },
  { month: 'February 2025', bets: 94, profit: 10.26, staked: 98.85 },
  { month: 'March 2025', bets: 84, profit: 13.68, staked: 86.50 },
  { month: 'April 2025', bets: 118, profit: 1.06, staked: 124.00 },
  { month: 'May 2025', bets: 150, profit: 18.13, staked: 148.20 },
  { month: 'June 2025', bets: 160, profit: 66.65, staked: 149.30 },
  { month: 'July 2025', bets: 124, profit: 14.42, staked: 124.10 },
  // 25/26 Season
  { month: 'August 2025', bets: 242, profit: 29.35, staked: 251.70 },
  { month: 'September 2025', bets: 205, profit: 9.16, staked: 214.45 },
  { month: 'October 2025', bets: 156, profit: -0.27, staked: 168.45 },
  { month: 'November 2025', bets: 227, profit: 32.90, staked: 260.45 },
  { month: 'December 2025', bets: 172, profit: 45.16, staked: 218.20 },
  { month: 'January 2026', bets: 197, profit: -13.52, staked: 216.80 },
]

// Generate month options from Aug 2024 to current (newest first in dropdown)
const MONTH_OPTIONS = [...MONTHLY_DATA].reverse().map(m => m.month)

// Animated number component
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0, duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTime = useRef(null)
  const animationFrame = useRef(null)

  useEffect(() => {
    startTime.current = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function - ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = value * easeOut

      setDisplayValue(current)

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [value, duration])

  const formattedValue = displayValue.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className="tabular-nums font-bold">
      {prefix}{formattedValue}{suffix}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, prefix, suffix, decimals, highlight, valueKey }) {
  return (
    <div className={`rounded-xl p-4 text-center transition-all duration-300 ${highlight ? 'card-accent' : 'card'}`}>
      <div className={`flex items-center justify-center gap-1.5 mb-2 ${highlight ? 'text-dark' : 'text-dark/60'}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-2xl md:text-3xl lg:text-4xl ${highlight ? 'text-dark' : 'text-dark'}`}>
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          key={valueKey}
        />
      </div>
    </div>
  )
}

// Calculate cumulative data from selected month onwards
function calculateFromMonth(startMonth) {
  // If "August 2024" is selected, return exact all-time data from spreadsheet
  if (startMonth === 'August 2024') {
    return ALL_TIME_DATA
  }

  const startIndex = MONTHLY_DATA.findIndex(m => m.month === startMonth)
  if (startIndex === -1) return ALL_TIME_DATA

  const relevantMonths = MONTHLY_DATA.slice(startIndex)

  const totalBets = relevantMonths.reduce((sum, m) => sum + m.bets, 0)
  const profitUnits = relevantMonths.reduce((sum, m) => sum + m.profit, 0)
  const totalStaked = relevantMonths.reduce((sum, m) => sum + m.staked, 0)
  const roi = totalStaked > 0 ? (profitUnits / totalStaked) * 100 : 0

  return {
    totalBets,
    profitUnits: Math.round(profitUnits * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    totalStaked,
  }
}

export default function ProfitCalculator() {
  const [inputValue, setInputValue] = useState('10')
  const [selectedMonth, setSelectedMonth] = useState('August 2024')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sectionRef = useRef(null)

  // Calculate data based on selected month
  const data = calculateFromMonth(selectedMonth)

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Parse input value for calculations (treat empty/invalid as 0)
  const unitValue = parseFloat(inputValue) || 0
  const totalProfit = data.profitUnits * unitValue
  const avgStake = data.totalBets > 0 ? (data.totalStaked / data.totalBets) * unitValue : 0

  return (
    <section
      ref={sectionRef}
      id="calculator"
      className="relative py-16 md:py-20 px-6 bg-[#333333] overflow-hidden"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none animate-gradient-shift"
        style={{
          background: `linear-gradient(110deg, #333333 0%, #333333 25%, rgba(208, 240, 192, 0.08) 40%, rgba(208, 240, 192, 0.12) 50%, rgba(208, 240, 192, 0.08) 60%, #333333 75%, #333333 100%)`,
          backgroundSize: '200% 100%',
        }}
      />
      <div className={`relative z-10 max-w-5xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
            Calculate Your Profit
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto">
            See what following my bets could have made you
          </p>
        </div>

        {/* Calculator container */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft-lg">
          {/* Controls row - equal width columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Unit input */}
            <div>
              <label className="block text-dark/60 text-xs font-medium mb-2 uppercase tracking-wide">
                Your £ per unit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 text-xl font-medium">£</span>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="10"
                  className="w-full h-[58px] bg-light border-2 border-dark/10 rounded-lg px-3 pl-10 text-2xl font-bold text-dark focus:border-primary focus:bg-white transition-all placeholder:text-dark/30"
                  min="0"
                />
              </div>
            </div>

            {/* Month selector */}
            <div>
              <label className="block text-dark/60 text-xs font-medium mb-2 uppercase tracking-wide">
                Results from
              </label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-[58px] bg-light border-2 border-dark/10 rounded-lg px-4 text-base font-semibold text-dark focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {MONTH_OPTIONS.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            /* Results grid - equal width columns */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={TrendingUp}
                label="Total Profit"
                value={totalProfit}
                prefix="£"
                decimals={0}
                highlight={true}
                valueKey={`profit-${inputValue}-${selectedMonth}`}
              />
              <StatCard
                icon={Target}
                label="ROI"
                value={data.roi}
                suffix="%"
                decimals={1}
                highlight={true}
                valueKey={`roi-${selectedMonth}`}
              />
              <StatCard
                icon={BarChart3}
                label="Total Bets"
                value={data.totalBets}
                decimals={0}
                valueKey={`bets-${selectedMonth}`}
              />
              <StatCard
                icon={Calendar}
                label="Avg Stake"
                value={avgStake}
                prefix="£"
                decimals={2}
                valueKey={`stake-${inputValue}-${selectedMonth}`}
              />
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-dark/40 text-xs text-center mt-6">
            Based on verified historical results. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </section>
  )
}
