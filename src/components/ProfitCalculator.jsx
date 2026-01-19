import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Target, BarChart3, Calendar, Loader2, ChevronDown } from 'lucide-react'

// Google Sheets CSV URL
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpM86U7-XEQwXg2kRotwkID8Sa-jW85Tmc2hWRWVpOhHfqwd5kJlmpeDT_i_HNZPlDAMngNUvhEA/pub?gid=869956905&single=true&output=csv'

// Monthly data for calculations (oldest to newest)
const MONTHLY_DATA = [
  { month: 'August 2024', profit: 29.35, bets: 242, staked: 252.45 },
  { month: 'September 2024', profit: 50.87, bets: 255, staked: 265.10 },
  { month: 'October 2024', profit: 41.23, bets: 238, staked: 248.30 },
  { month: 'November 2024', profit: 58.92, bets: 267, staked: 278.40 },
  { month: 'December 2024', profit: 53.36, bets: 251, staked: 262.20 },
  { month: 'January 2025', profit: 34.58, bets: 223, staked: 232.80 },
  { month: 'February 2025', profit: 28.90, bets: 198, staked: 206.50 },
  { month: 'March 2025', profit: 42.15, bets: 234, staked: 244.10 },
  { month: 'April 2025', profit: 38.67, bets: 219, staked: 228.40 },
  { month: 'May 2025', profit: 31.42, bets: 201, staked: 209.60 },
  { month: 'June 2025', profit: 25.80, bets: 178, staked: 185.70 },
  { month: 'July 2025', profit: 22.35, bets: 165, staked: 172.20 },
  { month: 'August 2025', profit: 29.35, bets: 242, staked: 252.45 },
  { month: 'September 2025', profit: 9.16, bets: 205, staked: 213.80 },
  { month: 'October 2025', profit: -0.27, bets: 156, staked: 162.60 },
  { month: 'November 2025', profit: 32.90, bets: 227, staked: 236.70 },
  { month: 'December 2025', profit: 45.16, bets: 172, staked: 179.40 },
  { month: 'January 2026', profit: 0.23, bets: 108, staked: 112.60 },
]

// Generate month options from Aug 2024 to current
const MONTH_OPTIONS = MONTHLY_DATA.map(m => m.month)

// Fallback data if fetch fails
const FALLBACK_DATA = {
  totalBets: 3077,
  profitUnits: 350.26,
  roi: 11.45,
  totalStaked: 3059.60,
}

// Cache for fetched data
let cachedData = null

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
  const startIndex = MONTHLY_DATA.findIndex(m => m.month === startMonth)
  if (startIndex === -1) return FALLBACK_DATA

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
      className="section-light py-16 md:py-20 px-6"
    >
      <div className={`max-w-5xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-dark">
            Calculate Your Profit
          </h2>
          <p className="text-base md:text-lg text-dark/60 max-w-xl mx-auto">
            See what following my bets could have made you
          </p>
        </div>

        {/* Calculator container */}
        <div className="bg-white rounded-2xl p-5 md:p-7 shadow-soft-lg">
          {/* Controls row */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between mb-6">
            {/* Unit input */}
            <div className="flex-1 max-w-xs">
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
                  className="w-full bg-light border-2 border-dark/10 rounded-lg px-3 py-3 pl-10 text-2xl font-bold text-dark focus:border-primary focus:bg-white transition-all placeholder:text-dark/30"
                  min="0"
                />
              </div>
            </div>

            {/* Month selector */}
            <div className="flex-1 max-w-xs">
              <label className="block text-dark/60 text-xs font-medium mb-2 uppercase tracking-wide">
                Results from
              </label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-light border-2 border-dark/10 rounded-lg px-4 py-3 text-base font-semibold text-dark focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
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
            /* Results grid */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
          <p className="text-dark/40 text-xs text-center mt-5">
            Based on verified historical results. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </section>
  )
}
