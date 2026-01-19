# SNY Betting Landing Page

A sleek, dark-themed landing page for SNY Betting sports tips service.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Vercel
1. Push to GitHub
2. Connect repo to Vercel
3. Deploy (auto-detects Vite)

### Netlify
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Configuration

### Update Links
Search and replace these placeholders in the code:
- `[TELEGRAM_LINK]` - Your Telegram channel link
- `[WAITLIST_LINK]` - VIP waiting list form/page
- `[DM_LINK]` - Direct message link (Twitter/Telegram)

Files to update:
- `src/components/Hero.jsx`
- `src/components/Links.jsx`

### Connect Google Sheets

1. Open your Google Sheet
2. Go to **File > Share > Publish to web**
3. Select the tab and choose **CSV** format
4. Copy the URL

Update `src/utils/fetchSheetData.js`:
```js
const SHEETS_CONFIG = {
  results: 'YOUR_RESULTS_CSV_URL',
  testimonials: 'YOUR_TESTIMONIALS_CSV_URL',
}
```

### Expected Sheet Structure

**Results Tab:**
| Period | TotalBets | ProfitUnits | ROI | TotalStaked |
|--------|-----------|-------------|-----|-------------|
| All Time | 847 | 142.5 | 8.4 | 1694 |
| Last 90 Days | 156 | 31.2 | 10.0 | 312 |
| Jan 25 | 68 | 12.5 | 9.2 | 136 |
| 24/25 | 423 | 89.2 | 10.5 | 846 |

**Testimonials Tab:**
| Name | Quote | MemberSince |
|------|-------|-------------|
| James M. | Been following SNY for 6 months... | Aug 2024 |

### Replace Logo
Replace the SVG in `src/components/Hero.jsx` with your actual logo, or:
1. Add your logo image to `public/` folder
2. Update the Hero component to use `<img src="/your-logo.png" />`

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Lucide React icons
