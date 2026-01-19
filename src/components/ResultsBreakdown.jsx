import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

// Google Sheets CSV URL (same as calculator)
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpM86U7-XEQwXg2kRotwkID8Sa-jW85Tmc2hWRWVpOhHfqwd5kJlmpeDT_i_HNZPlDAMngNUvhEA/pub?gid=869956905&single=true&output=csv'

// Fallback monthly data (most recent first)
const FALLBACK_MONTHLY = [
  { month: 'January 2026', profit: 0.23, bets: 108, roi: 0.21 },
  { month: 'December 2025', profit: 45.16, bets: 172, roi: 20.70 },
  { month: 'November 2025', profit: 32.90, bets: 227, roi: 12.63 },
  { month: 'October 2025', profit: -0.27, bets: 156, roi: -0.16 },
  { month: 'September 2025', profit: 9.16, bets: 205, roi: 4.27 },
  { month: 'August 2025', profit: 29.35, bets: 242, roi: 11.66 },
]

// Fallback season data
const FALLBACK_SEASONS = {
  '2025/2026': {
    totalBets: 1110,
    profit: 116.53,
    roi: 9.53,
    status: 'current',
  },
  '2024/2025': {
    totalBets: 1967,
    profit: 233.73,
    roi: 12.73,
    status: 'completed',
  },
}

// Fallback all-time data
const FALLBACK_ALLTIME = {
  totalBets: 3077,
  profit: 350.26,
  roi: 11.45,
}

// Cache for fetched data
let cachedResultsData = null

function MonthCard({ month, profit, bets, roi, delay }) {
  const isPositive = profit >= 0
  const valueColor = isPositive ? 'text-primary' : 'text-red-400'

  return (
    <div
      className="bg-[#3d3d3d] rounded-xl p-6 min-w-[200px] flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Month name - white */}
      <div className="text-white text-sm mb-4">{month}</div>

      {/* Profit - colored value, bold, large */}
      <div className={`text-2xl font-bold mb-3 ${valueColor}`}>
        {isPositive ? '+' : ''}{profit.toFixed(2)} units
      </div>

      {/* ROI - colored based on profit */}
      <div className={`text-sm mb-2 ${valueColor}`}>
        {isPositive ? '+' : ''}{roi.toFixed(2)}% ROI
      </div>

      {/* Bets - white */}
      <div className="text-sm text-white">{bets} bets</div>
    </div>
  )
}

function SeasonCard({ season, data }) {
  const isPositive = data.profit >= 0
  const isCurrent = data.status === 'current'

  return (
    <div className={`card-dark rounded-2xl p-6 md:p-8 flex-1 relative overflow-hidden ${isCurrent ? 'border-primary/30' : ''}`}>
      {/* Current badge */}
      {isCurrent && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary text-dark text-xs font-semibold rounded-full uppercase tracking-wide">
            Current
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="text-white/50 text-sm font-medium uppercase tracking-wide mb-1">Season</div>
        <div className="text-3xl md:text-4xl text-white font-bold">{season}</div>
      </div>

      <div className="flex justify-between gap-6">
        <div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Profit</div>
          <div className={`text-xl md:text-2xl font-bold ${isPositive ? 'text-primary' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{data.profit.toFixed(2)}u
          </div>
        </div>
        <div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">ROI</div>
          <div className={`text-xl md:text-2xl font-bold ${isPositive ? 'text-primary' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{data.roi.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Bets</div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {data.totalBets.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

function AllTimeCard({ data }) {
  const isPositive = data.profit >= 0

  return (
    <div className="card-dark rounded-2xl p-6 md:p-8 flex-1 relative overflow-hidden">
      <div className="mb-6">
        <div className="text-3xl md:text-4xl text-white font-bold">All Time</div>
        <div className="text-white/50 text-sm mt-1">Since August 2024</div>
      </div>

      <div className="flex justify-between gap-6">
        <div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Profit</div>
          <div className={`text-xl md:text-2xl font-bold ${isPositive ? 'text-primary' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{data.profit.toFixed(2)}u
          </div>
        </div>
        <div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">ROI</div>
          <div className={`text-xl md:text-2xl font-bold ${isPositive ? 'text-primary' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{data.roi.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Bets</div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {data.totalBets.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

// Parse CSV for results data
function parseResultsCSV(csvText) {
  const rows = csvText.split('\n').map(row => {
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

  // Try to extract season data from the CSV
  // Looking for rows with season labels like "25/26" or "24/25"
  const seasons = { ...FALLBACK_SEASONS }
  const monthly = [...FALLBACK_MONTHLY]
  const allTime = { ...FALLBACK_ALLTIME }

  // Parse data from sheet
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const label = row[0]?.toLowerCase().trim()

    // Check for all-time data (same as calculator)
    if (label === 'total bets') {
      const bets = parseInt(row[2]?.replace(/[^0-9]/g, ''))
      if (!isNaN(bets)) allTime.totalBets = bets
    } else if (label === 'profit') {
      const profit = parseFloat(row[2]?.replace(/[^0-9.-]/g, ''))
      if (!isNaN(profit)) allTime.profit = profit
    } else if (label === 'roi') {
      const roi = parseFloat(row[2]?.replace(/[^0-9.-]/g, ''))
      if (!isNaN(roi)) allTime.roi = roi
    }

    // Check for season 25/26 data (current)
    if (row[0]?.includes('25/26') || row[0]?.includes('2025/26') || row[0]?.includes('2025/2026')) {
      const profit = parseFloat(row[2]?.replace(/[^0-9.-]/g, ''))
      const roi = parseFloat(row[3]?.replace(/[^0-9.-]/g, ''))
      const bets = parseInt(row[4]?.replace(/[^0-9]/g, ''))
      if (!isNaN(profit)) seasons['2025/2026'].profit = profit
      if (!isNaN(roi)) seasons['2025/2026'].roi = roi
      if (!isNaN(bets)) seasons['2025/2026'].totalBets = bets
    }
    // Check for season 24/25 data
    if (row[0]?.includes('24/25') || row[0]?.includes('2024/25') || row[0]?.includes('2024/2025')) {
      const profit = parseFloat(row[2]?.replace(/[^0-9.-]/g, ''))
      const roi = parseFloat(row[3]?.replace(/[^0-9.-]/g, ''))
      const bets = parseInt(row[4]?.replace(/[^0-9]/g, ''))
      if (!isNaN(profit)) seasons['2024/2025'].profit = profit
      if (!isNaN(roi)) seasons['2024/2025'].roi = roi
      if (!isNaN(bets)) seasons['2024/2025'].totalBets = bets
    }
  }

  return { monthly, seasons, allTime }
}

export default function ResultsBreakdown() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState(FALLBACK_MONTHLY)
  const [seasonData, setSeasonData] = useState(FALLBACK_SEASONS)
  const [allTimeData, setAllTimeData] = useState(FALLBACK_ALLTIME)
  const sectionRef = useRef(null)

  // Fetch data from Google Sheets
  useEffect(() => {
    async function fetchData() {
      if (cachedResultsData) {
        setMonthlyData(cachedResultsData.monthly)
        setSeasonData(cachedResultsData.seasons)
        setAllTimeData(cachedResultsData.allTime)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(SHEETS_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch')

        const csvText = await response.text()
        const parsedData = parseResultsCSV(csvText)

        cachedResultsData = parsedData
        setMonthlyData(parsedData.monthly)
        setSeasonData(parsedData.seasons)
        setAllTimeData(parsedData.allTime)
      } catch (error) {
        console.error('Error fetching results data:', error)
        // Use fallback data on error
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
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="results"
      className="section-light py-24 md:py-32 px-6"
    >
      <div className={`max-w-5xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-dark">
            Fully Tracked Results
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-dark/60 max-w-2xl mx-auto">
            Every bet tracked. Full transparency.
          </p>
        </div>

        {/* Monthly performance - horizontal scroll */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-dark" />
            <h3 className="text-lg font-semibold text-dark">Monthly Performance</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              <div className="flex gap-5">
                {monthlyData.map((data, index) => (
                  <MonthCard key={data.month} {...data} delay={index * 100} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Season breakdown */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* All Time card - centered on top */}
              <div className="max-w-md mx-auto">
                <AllTimeCard data={allTimeData} />
              </div>

              {/* Season cards - two columns */}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(seasonData).map(([season, data]) => (
                  <SeasonCard key={season} season={season} data={data} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
