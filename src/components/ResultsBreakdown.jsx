import { useState, useEffect, useRef } from 'react'
import { Loader2, TrendingUp, ChevronDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

// Cumulative profit data for the graph
const CUMULATIVE_PROFIT_DATA = [
  { month: 'Aug 24', profit: 48.43 },
  { month: 'Sep 24', profit: 90.37 },
  { month: 'Oct 24', profit: 94.19 },
  { month: 'Nov 24', profit: 108.05 },
  { month: 'Dec 24', profit: 110.44 },
  { month: 'Jan 25', profit: 109.53 },
  { month: 'Feb 25', profit: 119.79 },
  { month: 'Mar 25', profit: 133.47 },
  { month: 'Apr 25', profit: 134.53 },
  { month: 'May 25', profit: 152.66 },
  { month: 'Jun 25', profit: 219.31 },
  { month: 'Jul 25', profit: 233.73 },
  { month: 'Aug 25', profit: 263.08 },
  { month: 'Sep 25', profit: 272.24 },
  { month: 'Oct 25', profit: 271.97 },
  { month: 'Nov 25', profit: 304.87 },
  { month: 'Dec 25', profit: 350.03 },
]

// Google Sheets CSV URL (same as calculator)
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpM86U7-XEQwXg2kRotwkID8Sa-jW85Tmc2hWRWVpOhHfqwd5kJlmpeDT_i_HNZPlDAMngNUvhEA/pub?gid=869956905&single=true&output=csv'

// Monthly data (most recent first) - August 2024 to December 2025
const FALLBACK_MONTHLY = [
  // 25/26 Season
  { month: 'December 2025', profit: 45.16, bets: 172, roi: 20.70 },
  { month: 'November 2025', profit: 32.90, bets: 227, roi: 12.63 },
  { month: 'October 2025', profit: -0.27, bets: 156, roi: -0.16 },
  { month: 'September 2025', profit: 9.16, bets: 205, roi: 4.27 },
  { month: 'August 2025', profit: 29.35, bets: 242, roi: 11.66 },
  // 24/25 Season
  { month: 'July 2025', profit: 14.42, bets: 124, roi: 11.62 },
  { month: 'June 2025', profit: 66.65, bets: 160, roi: 44.64 },
  { month: 'May 2025', profit: 18.13, bets: 150, roi: 12.23 },
  { month: 'April 2025', profit: 1.06, bets: 118, roi: 0.85 },
  { month: 'March 2025', profit: 13.68, bets: 84, roi: 15.82 },
  { month: 'February 2025', profit: 10.26, bets: 94, roi: 10.38 },
  { month: 'January 2025', profit: -0.91, bets: 146, roi: -0.67 },
  { month: 'December 2024', profit: 2.39, bets: 59, roi: 4.07 },
  { month: 'November 2024', profit: 13.86, bets: 124, roi: 11.26 },
  { month: 'October 2024', profit: 3.82, bets: 243, roi: 1.69 },
  { month: 'September 2024', profit: 41.94, bets: 238, roi: 19.61 },
  { month: 'August 2024', profit: 48.43, bets: 427, roi: 13.92 },
]

// Season data (excluding incomplete January 2026)
const FALLBACK_SEASONS = {
  '2025/2026': {
    totalBets: 1002,
    profit: 116.30,
    roi: 10.45,
    status: 'current',
  },
  '2024/2025': {
    totalBets: 1967,
    profit: 233.73,
    roi: 12.73,
    status: 'completed',
  },
}

// All-time data (excluding incomplete January 2026)
const FALLBACK_ALLTIME = {
  totalBets: 2969,
  profit: 350.03,
  roi: 11.86,
}

// Cache for fetched data
let cachedResultsData = null

function MonthCard({ month, profit, bets, roi, delay }) {
  const isPositive = profit >= 0
  const profitColor = isPositive ? 'text-primary' : 'text-red-400'

  return (
    <div
      className="bg-[#404040] rounded-xl p-5 min-w-[190px] flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Month label - small, lighter */}
      <div className="text-white/80 text-xs font-medium uppercase tracking-wide mb-3">{month}</div>

      {/* Profit - hero stat, large and bold */}
      <div className={`text-3xl font-bold mb-4 ${profitColor}`}>
        {isPositive ? '+' : ''}{profit.toFixed(2)}
        <span className="text-lg font-semibold ml-1">units profit</span>
      </div>

      {/* Secondary stats - ROI (colored, medium) • Bets (lighter, smaller) */}
      <div className="flex items-center gap-2">
        <span className={`text-base font-semibold ${profitColor}`}>{isPositive ? '+' : ''}{roi.toFixed(1)}% ROI</span>
        <span className="text-white/40">•</span>
        <span className="text-white/80 text-sm">{bets} bets</span>
      </div>
    </div>
  )
}

function SeasonCard({ season, data }) {
  const isPositive = data.profit >= 0
  const isCurrent = data.status === 'current'
  const profitColor = isPositive ? 'text-primary' : 'text-red-400'

  return (
    <div className={`bg-[#404040] rounded-2xl p-6 md:p-8 flex-1 relative shadow-lg ${isCurrent ? 'border border-primary/30' : ''}`}>
      {/* Current badge */}
      {isCurrent && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary text-dark text-xs font-semibold rounded-full uppercase tracking-wide">
            Current
          </span>
        </div>
      )}

      {/* Season label - small, lighter */}
      <div className="text-white/80 text-xs font-medium uppercase tracking-wide mb-1">Season</div>
      <div className="text-2xl md:text-3xl text-white font-bold mb-5">{season}</div>

      {/* Profit - hero stat */}
      <div className={`text-4xl md:text-5xl font-bold mb-4 ${profitColor}`}>
        {isPositive ? '+' : ''}{data.profit.toFixed(2)}
        <span className="text-xl font-semibold ml-1">units profit</span>
      </div>

      {/* Secondary stats - ROI (colored, larger) • Bets (white, smaller) */}
      <div className="flex items-center gap-3">
        <span className={`text-base font-semibold ${profitColor}`}>{isPositive ? '+' : ''}{data.roi.toFixed(2)}% ROI</span>
        <span className="text-white/40">•</span>
        <span className="text-white/80 text-sm">{data.totalBets.toLocaleString()} bets</span>
      </div>
    </div>
  )
}

function AllTimeCard({ data }) {
  const isPositive = data.profit >= 0
  const profitColor = isPositive ? 'text-primary' : 'text-red-400'

  return (
    <div className="bg-[#404040] rounded-2xl p-6 md:p-8 flex-1 shadow-lg">
      {/* Title - small, lighter */}
      <div className="text-white/80 text-xs font-medium uppercase tracking-wide mb-1">Since August 2024</div>
      <div className="text-2xl md:text-3xl text-white font-bold mb-5">All Time</div>

      {/* Profit - hero stat */}
      <div className={`text-4xl md:text-5xl font-bold mb-4 ${profitColor}`}>
        {isPositive ? '+' : ''}{data.profit.toFixed(2)}
        <span className="text-xl font-semibold ml-1">units profit</span>
      </div>

      {/* Secondary stats - ROI (colored, larger) • Bets (white, smaller) */}
      <div className="flex items-center gap-3">
        <span className={`text-base font-semibold ${profitColor}`}>{isPositive ? '+' : ''}{data.roi.toFixed(2)}% ROI</span>
        <span className="text-white/40">•</span>
        <span className="text-white/80 text-sm">{data.totalBets.toLocaleString()} bets</span>
      </div>
    </div>
  )
}

// Custom tooltip for the chart
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#333333] border border-white/20 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white/70 text-sm mb-1">{label}</p>
        <p className="text-primary font-bold text-lg">+{payload[0].value.toFixed(2)} units</p>
      </div>
    )
  }
  return null
}

function ProfitGraph() {
  return (
    <div className="bg-[#404040] rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-white font-bold text-lg">Cumulative Profit</h3>
      </div>
      <div className="h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CUMULATIVE_PROFIT_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D0F0C0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D0F0C0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#D0F0C0"
              strokeWidth={3}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-white/50 text-xs text-center mt-4">
        Cumulative units profit from August 2024 to December 2025
      </p>
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
  const [showGraph, setShowGraph] = useState(false)
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
      className="section-light py-16 md:py-20 px-6"
    >
      <div className={`max-w-5xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-dark">
            Fully Tracked Results
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-dark/60 max-w-2xl mx-auto">
            Every bet tracked. Full transparency.
          </p>
        </div>

        {/* Monthly performance - horizontal scroll */}
        <div className="mb-8">
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

              {/* View Profit Graph button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowGraph(!showGraph)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#404040] hover:bg-[#4a4a4a] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-medium">{showGraph ? 'Hide Profit Graph' : 'View Profit Graph'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showGraph ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expandable Profit Graph */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showGraph ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ProfitGraph />
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
