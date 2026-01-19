import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Target, BarChart3, Calendar, Loader2 } from 'lucide-react'

// Google Sheets CSV URL
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpM86U7-XEQwXg2kRotwkID8Sa-jW85Tmc2hWRWVpOhHfqwd5kJlmpeDT_i_HNZPlDAMngNUvhEA/pub?gid=869956905&single=true&output=csv'

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

// Parse CSV and extract data from specific cells
function parseCSV(csvText) {
  const rows = csvText.split('\n').map(row => {
    // Handle CSV parsing with potential commas in values
    const result = []
    let current = ''
    let inQuotes = false

    for (let char of row) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  })

  // Find the rows by looking for the labels in column A
  let totalBets = FALLBACK_DATA.totalBets
  let profitUnits = FALLBACK_DATA.profitUnits
  let roi = FALLBACK_DATA.roi
  let totalStaked = FALLBACK_DATA.totalStaked

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const label = row[0]?.toLowerCase().trim()

    if (label === 'total bets') {
      totalBets = parseFloat(row[2]?.replace(/[^0-9.-]/g, '')) || FALLBACK_DATA.totalBets
    } else if (label === 'profit') {
      profitUnits = parseFloat(row[2]?.replace(/[^0-9.-]/g, '')) || FALLBACK_DATA.profitUnits
    } else if (label === 'roi') {
      // Remove % sign and parse
      roi = parseFloat(row[2]?.replace(/[^0-9.-]/g, '')) || FALLBACK_DATA.roi
    } else if (label === 'total staked') {
      totalStaked = parseFloat(row[2]?.replace(/[^0-9.-]/g, '')) || FALLBACK_DATA.totalStaked
    }
  }

  return {
    totalBets,
    profitUnits,
    roi,
    totalStaked,
  }
}

export default function ProfitCalculator() {
  const [inputValue, setInputValue] = useState('10')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(FALLBACK_DATA)
  const sectionRef = useRef(null)

  // Fetch data from Google Sheets
  useEffect(() => {
    async function fetchData() {
      // Use cached data if available
      if (cachedData) {
        setData(cachedData)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(SHEETS_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch')

        const csvText = await response.text()
        const parsedData = parseCSV(csvText)

        // Cache the data
        cachedData = parsedData
        setData(parsedData)
      } catch (error) {
        console.error('Error fetching sheet data:', error)
        // Use fallback data on error
        setData(FALLBACK_DATA)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
  const avgStake = (data.totalStaked / data.totalBets) * unitValue

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

            {/* All Time label */}
            <div className="bg-primary/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold text-dark">All time results since August 2024</span>
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
                valueKey={`profit-${inputValue}`}
              />
              <StatCard
                icon={Target}
                label="ROI"
                value={data.roi}
                suffix="%"
                decimals={1}
                highlight={true}
                valueKey={`roi`}
              />
              <StatCard
                icon={BarChart3}
                label="Total Bets"
                value={data.totalBets}
                decimals={0}
                valueKey={`bets`}
              />
              <StatCard
                icon={Calendar}
                label="Avg Stake"
                value={avgStake}
                prefix="£"
                decimals={2}
                valueKey={`stake-${inputValue}`}
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
