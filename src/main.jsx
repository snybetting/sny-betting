import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initAnalytics } from './lib/analytics'

// Analytics is optional: with no VITE_POSTHOG_KEY set (local dev, previews,
// forks) posthog-js is never fetched and every capture() call is a no-op.
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
