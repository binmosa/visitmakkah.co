// FAQ Data - Easy to update questions and answers

export type FAQItem = {
  id: string
  question: string
  answer: string
}

export type FAQCategory = {
  id: string
  title: string
  items: FAQItem[]
}

export const faqData: FAQCategory[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      {
        id: 'what-is-visit-makkah',
        question: 'What is Visit Makkah?',
        answer:
          'Visit Makkah is an AI-powered platform created by a Makkah local to help pilgrims plan and navigate their journey. We provide authentic, firsthand insights that go beyond generic travel information.',
      },
      {
        id: 'who-created',
        question: 'Who created this platform?',
        answer:
          'Visit Makkah was developed by a citizen of Makkah who wanted to share genuine local knowledge and make the pilgrimage experience easier and more meaningful for visitors from around the world.',
      },
      {
        id: 'is-it-free',
        question: 'Is Visit Makkah free to use?',
        answer:
          'Yes, Visit Makkah is completely free. Our mission is to help every pilgrim have a smooth and memorable journey to the Holy City.',
      },
    ],
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    items: [
      {
        id: 'how-ai-works',
        question: 'How does the AI assistant work?',
        answer:
          'Our AI assistant is trained on local knowledge and Islamic guidelines to answer your questions about Umrah, Hajj, prayer times, local tips, and more. Just ask naturally and get instant, helpful responses.',
      },
      {
        id: 'ai-accuracy',
        question: 'How accurate is the AI information?',
        answer:
          'We strive for accuracy by combining authentic Islamic sources with local expertise. However, for religious rulings, we always recommend consulting with qualified scholars.',
      },
      {
        id: 'languages',
        question: 'What languages does the AI support?',
        answer:
          'The AI assistant supports multiple languages including English, Arabic, Urdu, Indonesian, Turkish, and more. It will respond in the language you use.',
      },
    ],
  },
  {
    id: 'pilgrimage',
    title: 'Pilgrimage',
    items: [
      {
        id: 'umrah-requirements',
        question: 'What do I need for Umrah?',
        answer:
          'For Umrah, you need a valid passport, Umrah visa (or tourist visa for eligible countries), appropriate clothing (Ihram for men), and basic knowledge of the rituals. Our guides section provides detailed preparation information.',
      },
      {
        id: 'best-time',
        question: 'When is the best time to visit Makkah?',
        answer:
          'The best time depends on your preferences. Ramadan is spiritually significant but crowded. The months after Hajj season (Muharram to Rabi) are less crowded. Weather-wise, winter months (November to February) are most comfortable.',
      },
      {
        id: 'first-timer-tips',
        question: 'Any tips for first-time visitors?',
        answer:
          'Start with our First-Timer guides, use comfortable footwear, stay hydrated, download offline maps, keep important documents accessible, and most importantly - take your time and focus on the spiritual experience.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical',
    items: [
      {
        id: 'save-conversations',
        question: 'Can I save my conversations?',
        answer:
          'Yes! Create a free account to save your chat history, bookmark helpful responses, and access them anytime - even offline.',
      },
      {
        id: 'offline-access',
        question: 'Does Visit Makkah work offline?',
        answer:
          'Some features like saved guides and prayer times work offline. The AI assistant requires an internet connection, but saved conversations can be viewed offline.',
      },
      {
        id: 'report-issue',
        question: 'How do I report an issue or give feedback?',
        answer:
          'We value your feedback! Use the contact form on our Contact page, or reach out through our social media channels. Your input helps us improve.',
      },
    ],
  },
]

// Flatten all FAQs for search functionality
export const getAllFAQs = (): FAQItem[] => {
  return faqData.flatMap((category) => category.items)
}
