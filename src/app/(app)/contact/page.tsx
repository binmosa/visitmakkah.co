'use client'

import { useState, useRef, useCallback } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Mail01Icon, Loading03Icon, CheckmarkCircle02Icon, Alert02Icon } from '@hugeicons/core-free-icons'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

const TOPICS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'contribution', label: 'Contribution' },
  { value: 'collaboration', label: 'Collaboration' },
] as const

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

type TopicType = typeof TOPICS[number]['value']

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'general' as TopicType,
    message: '',
    website: '', // Honeypot
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileStatus, setTurnstileStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const turnstileRef = useRef<TurnstileInstance>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.website) {
      setStatus('success')
      return
    }

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error')
      setErrorMessage('Please fill in all required fields.')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    // Check Turnstile token (if configured)
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus('error')
      setErrorMessage('Please wait for security verification to complete.')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          topic: formData.topic,
          message: formData.message,
          turnstileToken: turnstileToken || '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        topic: 'general',
        message: '',
        website: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
      setTurnstileToken(null)
      setTurnstileStatus('loading')
      turnstileRef.current?.reset()
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="size-7 text-primary-600 dark:text-primary-400"
                strokeWidth={1.5}
              />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
              Contact Us
            </h1>
            <p className="mt-2 text-sm text-neutral-500 sm:text-base dark:text-neutral-400">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-900">
            {status === 'success' ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-8 text-green-600 dark:text-green-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Message Sent!
                </h2>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot */}
                <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {TOPICS.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Turnstile Widget */}
                {TURNSTILE_SITE_KEY && (
                  <div className="flex flex-col items-center gap-2">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      options={{
                        theme: 'light',
                        size: 'normal',
                      }}
                      onSuccess={(token) => {
                        setTurnstileToken(token)
                        setTurnstileStatus('ready')
                      }}
                      onError={() => {
                        setTurnstileStatus('error')
                      }}
                      onExpire={() => {
                        setTurnstileToken(null)
                        setTurnstileStatus('loading')
                        turnstileRef.current?.reset()
                      }}
                    />
                    {turnstileStatus === 'loading' && (
                      <p className="text-xs text-neutral-500">Verifying...</p>
                    )}
                    {turnstileStatus === 'error' && (
                      <p className="text-xs text-red-500">
                        Security check failed.{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setTurnstileStatus('loading')
                            turnstileRef.current?.reset()
                          }}
                          className="underline hover:no-underline"
                        >
                          Try again
                        </button>
                      </p>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <HugeiconsIcon icon={Alert02Icon} className="size-5 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || (!!TURNSTILE_SITE_KEY && turnstileStatus !== 'ready')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>

                <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
                  We typically respond within 24-48 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
