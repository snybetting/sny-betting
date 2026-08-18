import React from 'react'
import ReactDOM from 'react-dom/client'
import posthog from 'posthog-js'
import App from './App.jsx'
import './index.css'

// Analytics is optional: with no VITE_POSTHOG_KEY set (local dev, previews,
// forks) PostHog is never initialised and every capture() call is a no-op.
const posthogKey = import.meta.env.VITE_POSTHOG_KEY

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
