import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Visit Makkah - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-li:text-neutral-600 dark:prose-li:text-neutral-400">

            <section>
              <h2>1. Introduction</h2>
              <p>
                Welcome to Visit Makkah ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website visitmakkah.co and use our services.
              </p>
              <p>
                By accessing or using our website and services, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>

              <h3>2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Create an account or register on our platform</li>
                <li>Complete our onboarding questionnaire (journey type, travel dates, group composition)</li>
                <li>Use our AI chat assistant</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name and email address</li>
                <li>Country of residence</li>
                <li>Gender (for personalized religious guidance)</li>
                <li>Travel dates and preferences</li>
                <li>Journey type (Hajj or Umrah)</li>
                <li>First-time pilgrim status</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <p>When you visit our website, we automatically collect certain information, including:</p>
              <ul>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and general location</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3>2.3 AI Chat Data</h3>
              <p>
                When you interact with our AI assistant, we collect and store your conversation history to provide personalized guidance and improve our services. This data is processed securely and used solely for the purpose of enhancing your experience.
              </p>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide personalized pilgrimage guidance and recommendations</li>
                <li>Customize your experience based on your profile and preferences</li>
                <li>Improve and optimize our website and services</li>
                <li>Send you relevant updates, tips, and information (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to enhance our AI assistant</li>
                <li>Protect against fraudulent or unauthorized activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2>4. Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating our website (e.g., hosting, analytics, AI processing)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity</li>
                <li><strong>Protection of Rights:</strong> We may disclose information to protect our rights, privacy, safety, or property</li>
              </ul>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Secure server infrastructure</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2>6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookie preferences through your browser settings.
              </p>
              <p>Types of cookies we use:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section>
              <h2>7. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us at info@visitmakkah.co.
              </p>
            </section>

            <section>
              <h2>8. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Chat conversation data is retained to provide continuity in your pilgrimage planning experience.
              </p>
            </section>

            <section>
              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We take appropriate measures to ensure your information remains protected in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2>11. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2>12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <ul>
                <li>Email: <a href="mailto:info@visitmakkah.co" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">info@visitmakkah.co</a></li>
                <li>Website: <a href="https://www.visitmakkah.co" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">www.visitmakkah.co</a></li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
