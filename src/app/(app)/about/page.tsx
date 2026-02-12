'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { InformationCircleIcon, Add01Icon, Remove01Icon } from '@hugeicons/core-free-icons'
import { faqData, FAQItem } from '@/data/faq'

// FAQ Accordion Item Component
const FAQAccordion = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-neutral-900 sm:text-base dark:text-white">
          {item.question}
        </span>
        <HugeiconsIcon
          icon={isOpen ? Remove01Icon : Add01Icon}
          className="size-5 shrink-0 text-neutral-500"
          strokeWidth={2}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.answer}</p>
      </div>
    </div>
  )
}

export default function PageAbout() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container py-6 sm:py-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-3 shadow-lg shadow-primary-500/20">
            <HugeiconsIcon icon={InformationCircleIcon} className="size-6 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">About Us</h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Built by a local, for the world
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 p-6 sm:p-8 dark:from-primary-900/20 dark:to-emerald-900/20">
            <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">
              Our Story
            </h2>
            <div className="mt-4 space-y-4 text-neutral-600 dark:text-neutral-400">
              <p>
                <strong className="text-neutral-900 dark:text-white">Visit Makkah</strong> is a passion project developed by a citizen of Makkah City, bringing you deep and authentic experiences far from generic travel information.
              </p>
              <p>
                As someone who has lived in the blessed city my entire life, I understand that every pilgrim deserves more than just basic instructions. You deserve the insider knowledge, the hidden gems, and the practical wisdom that only a local can provide.
              </p>
              <p>
                This modern, AI-powered platform is designed to make your journey to Makkah easy, meaningful, and truly memorable. Whether it's your first visit or you're returning, we're here to guide you every step of the way.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="mt-6 border-t border-primary-200 pt-6 dark:border-primary-800">
              <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
                "Making every pilgrimage journey smooth, informed, and spiritually fulfilling."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Find answers to common questions about Visit Makkah
          </p>

          <div className="mt-8 space-y-8">
            {faqData.map((category) => (
              <div key={category.id}>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {category.title}
                </h3>
                <div className="rounded-xl border border-neutral-200 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                  {category.items.map((item, index) => (
                    <FAQAccordion
                      key={item.id}
                      item={item}
                      isOpen={openFAQ === item.id}
                      onToggle={() => toggleFAQ(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 p-6 text-center dark:from-primary-900/20 dark:to-teal-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Have questions or feedback?</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              We&apos;d love to hear from you
            </p>
            <a
              href="/contact"
              className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-neutral-100 p-6 text-center dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Ready to start your journey?</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Explore our guides and let AI assist you
            </p>
            <a
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
