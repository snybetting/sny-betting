/**
 * Utility functions for fetching data from Google Sheets
 *
 * To use with Google Sheets:
 * 1. Open your Google Sheet
 * 2. Go to File > Share > Publish to web
 * 3. Select the tab you want to publish
 * 4. Choose CSV format
 * 5. Copy the URL
 *
 * Example URLs:
 * - Results: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Results
 * - Testimonials: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Testimonials
 */

// Replace these with your actual Google Sheets CSV URLs
const SHEETS_CONFIG = {
  results: '[RESULTS_SHEET_URL]',
  testimonials: '[TESTIMONIALS_SHEET_URL]',
}

/**
 * Parse CSV text into an array of objects
 */
function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  const headers = parseCSVLine(lines[0])

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const obj = {}
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim() || ''
    })
    return obj
  })
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)

  return values.map(v => v.replace(/^"|"$/g, ''))
}

/**
 * Fetch and parse results data from Google Sheets
 */
export async function fetchResultsData() {
  try {
    const response = await fetch(SHEETS_CONFIG.results)
    if (!response.ok) throw new Error('Failed to fetch results')

    const csv = await response.text()
    const data = parseCSV(csv)

    // Transform the data into the expected format
    // Adjust this based on your actual sheet structure
    return transformResultsData(data)
  } catch (error) {
    console.error('Error fetching results:', error)
    return null
  }
}

/**
 * Fetch and parse testimonials data from Google Sheets
 */
export async function fetchTestimonialsData() {
  try {
    const response = await fetch(SHEETS_CONFIG.testimonials)
    if (!response.ok) throw new Error('Failed to fetch testimonials')

    const csv = await response.text()
    const data = parseCSV(csv)

    // Transform to expected format: { name, quote, memberSince }
    return data.map(row => ({
      name: row.Name || row.name || '',
      quote: row.Quote || row.quote || '',
      memberSince: row.MemberSince || row.memberSince || row['Member Since'] || '',
    })).filter(t => t.name && t.quote)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return null
  }
}

/**
 * Transform raw results data into the app's expected format
 * Adjust this function based on your actual sheet structure
 */
function transformResultsData(data) {
  // Expected sheet structure:
  // Period, TotalBets, ProfitUnits, ROI, TotalStaked
  // Where Period can be: "All Time", "Last 90 Days", "Jan 25", "Dec 24", etc.

  const result = {
    allTime: null,
    last90Days: null,
    monthly: [],
    seasons: {},
  }

  data.forEach(row => {
    const period = row.Period || row.period || ''
    const stats = {
      totalBets: parseFloat(row.TotalBets || row.totalBets || 0),
      profitUnits: parseFloat(row.ProfitUnits || row.profitUnits || row.Profit || 0),
      roi: parseFloat(row.ROI || row.roi || 0),
      totalStaked: parseFloat(row.TotalStaked || row.totalStaked || 0),
    }

    if (period.toLowerCase() === 'all time') {
      result.allTime = stats
    } else if (period.toLowerCase() === 'last 90 days') {
      result.last90Days = stats
    } else if (period.includes('/')) {
      // Season format: "24/25", "23/24"
      result.seasons[period] = {
        ...stats,
        status: period === '24/25' ? 'current' : 'completed',
      }
    } else {
      // Monthly format: "Jan 25", "Dec 24"
      result.monthly.push({
        month: period,
        profit: stats.profitUnits,
        bets: stats.totalBets,
        roi: stats.roi,
      })
    }
  })

  return result
}

/**
 * Example usage in a component:
 *
 * import { fetchResultsData, fetchTestimonialsData } from '../utils/fetchSheetData'
 *
 * useEffect(() => {
 *   async function loadData() {
 *     const results = await fetchResultsData()
 *     const testimonials = await fetchTestimonialsData()
 *     if (results) setResultsData(results)
 *     if (testimonials) setTestimonialsData(testimonials)
 *   }
 *   loadData()
 * }, [])
 */
