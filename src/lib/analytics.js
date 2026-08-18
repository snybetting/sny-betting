/**
 * Optional PostHog analytics.
 *
 * posthog-js is loaded with a dynamic import so it is emitted as its own chunk
 * and only ever fetched when VITE_POSTHOG_KEY is set. ENABLED is derived from a
 * build-time env var, so with no key it is a constant false and the import()
 * below is never reached. The chunk is still emitted into dist, but nothing
 * ever requests it and index.html does not preload it.
 *
 * capture() is fire-and-forget and never returns a promise, so call sites - in
 * particular link onClick handlers - never await anything and navigation is
 * never blocked or delayed. Events fired before the import resolves are queued
 * and flushed once PostHog is ready rather than dropped.
 */

const KEY = import.meta.env.VITE_POSTHOG_KEY
const ENABLED = Boolean(KEY)

// Bounded so a pathological case (import stalls forever while the user clicks
// repeatedly) cannot grow memory without limit.
const MAX_QUEUED = 100

let client = null
let queue = []
let started = false
let failed = false

function flush() {
  const pending = queue
  queue = []
  for (const [event, properties] of pending) {
    send(event, properties)
  }
}

function send(event, properties) {
  try {
    client.capture(event, properties)
  } catch {
    // A capture must never take the page down with it.
  }
}

/**
 * Kick off the PostHog load. Safe to call more than once; a no-op when no key
 * is configured.
 */
export function initAnalytics() {
  if (!ENABLED || started) return
  started = true

  import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
      })
      client = posthog
      flush()
    })
    .catch(() => {
      // Blocked by an ad blocker, offline, or the chunk failed to load.
      // Analytics is optional - give up quietly and stop queueing.
      failed = true
      queue = []
    })
}

/**
 * Record an event. No-op when analytics is disabled or failed to load.
 */
export function capture(event, properties) {
  if (!ENABLED || failed) return

  if (client) {
    send(event, properties)
    return
  }

  if (queue.length < MAX_QUEUED) {
    queue.push([event, properties])
  }
}
