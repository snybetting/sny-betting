import posthog from 'posthog-js'

/**
 * Thin wrapper around posthog.capture.
 *
 * PostHog is only initialised in src/main.jsx when VITE_POSTHOG_KEY is set, so
 * this guard keeps every call site safe when it is not. capture() is
 * fire-and-forget - PostHog queues and sends in the background - so calling it
 * from a link's onClick never blocks or delays navigation.
 */
export function capture(event, properties) {
  if (!import.meta.env.VITE_POSTHOG_KEY) return
  posthog.capture(event, properties)
}
