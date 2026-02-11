import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions for Visit Makkah - Read the terms governing your use of our services.',
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen">
      <div className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-li:text-neutral-600 dark:prose-li:text-neutral-400">

            <section>
              <h2>1. Agreement to Terms</h2>
              <p>
                Welcome to Visit Makkah. These Terms and Conditions ("Terms") govern your access to and use of the Visit Makkah website located at visitmakkah.co ("Website") and all related services, features, content, and applications (collectively, the "Services").
              </p>
              <p>
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our Services.
              </p>
            </section>

            <section>
              <h2>2. Description of Services</h2>
              <p>
                Visit Makkah provides an AI-powered platform designed to assist users in planning and preparing for Hajj and Umrah pilgrimages. Our Services include:
              </p>
              <ul>
                <li>AI-powered pilgrimage guidance and recommendations</li>
                <li>Itinerary planning tools</li>
                <li>Educational content about Islamic rituals and practices</li>
                <li>Accommodation and travel information</li>
                <li>Personalized tips and suggestions based on user preferences</li>
              </ul>
              <p>
                <strong>Important:</strong> Our Services are for informational and educational purposes only. We are not a licensed travel agency, religious authority, or official government entity.
              </p>
            </section>

            <section>
              <h2>3. User Accounts</h2>

              <h3>3.1 Account Creation</h3>
              <p>
                Some features of our Services may require you to create an account. When creating an account, you agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3>3.2 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time, without notice, for any reason, including violation of these Terms.
              </p>
            </section>

            <section>
              <h2>4. Acceptable Use</h2>
              <p>You agree to use our Services only for lawful purposes. You shall not:</p>
              <ul>
                <li>Use the Services in any way that violates applicable laws or regulations</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Services</li>
                <li>Use automated systems or software to extract data from the Services</li>
                <li>Upload or transmit viruses, malware, or other harmful code</li>
                <li>Engage in any activity that could damage, disable, or impair the Services</li>
                <li>Use the Services to send spam or unsolicited communications</li>
                <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Services without express permission</li>
              </ul>
            </section>

            <section>
              <h2>5. AI Assistant and Content</h2>

              <h3>5.1 AI-Generated Content</h3>
              <p>
                Our AI assistant provides guidance based on general knowledge about Hajj, Umrah, and Islamic practices. You acknowledge that:
              </p>
              <ul>
                <li>AI-generated content is for informational purposes only</li>
                <li>AI responses may not be 100% accurate or complete</li>
                <li>AI content should not replace consultation with qualified religious scholars</li>
                <li>Travel information should be verified with official sources</li>
              </ul>

              <h3>5.2 Religious Guidance Disclaimer</h3>
              <p>
                <strong>Important:</strong> Visit Makkah provides general Islamic guidance based on widely accepted practices. For specific religious rulings (fatwas) or matters of personal religious practice, please consult qualified Islamic scholars or your local religious authority. Different schools of thought (madhabs) may have varying interpretations.
              </p>

              <h3>5.3 User-Generated Content</h3>
              <p>
                By submitting content through our Services (including chat messages), you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process such content for the purpose of providing and improving our Services.
              </p>
            </section>

            <section>
              <h2>6. Intellectual Property</h2>

              <h3>6.1 Our Content</h3>
              <p>
                All content on the Website, including text, graphics, logos, images, audio, video, software, and other materials, is owned by Visit Makkah or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3>6.2 Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use the Services for personal, non-commercial purposes. This license does not include the right to:
              </p>
              <ul>
                <li>Modify or copy our content</li>
                <li>Use our content for commercial purposes</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Transfer access to another person</li>
              </ul>
            </section>

            <section>
              <h2>7. Third-Party Services and Links</h2>
              <p>
                Our Services may contain links to third-party websites, services, or resources. We are not responsible for:
              </p>
              <ul>
                <li>The availability or accuracy of third-party services</li>
                <li>The content, products, or services on third-party sites</li>
                <li>Any transactions you enter into with third parties</li>
              </ul>
              <p>
                Your use of third-party services is at your own risk and subject to their respective terms and conditions.
              </p>
            </section>

            <section>
              <h2>8. Disclaimers</h2>

              <h3>8.1 Services Provided "As Is"</h3>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h3>8.2 No Guarantee</h3>
              <p>We do not guarantee that:</p>
              <ul>
                <li>The Services will meet your specific requirements</li>
                <li>The Services will be uninterrupted, timely, secure, or error-free</li>
                <li>The results from using the Services will be accurate or reliable</li>
                <li>Any errors in the Services will be corrected</li>
              </ul>

              <h3>8.3 Travel Disclaimer</h3>
              <p>
                We are not a travel agency. Any travel-related information (hotels, flights, transportation) is for informational purposes only. Always verify travel arrangements directly with service providers and check official government travel advisories.
              </p>
            </section>

            <section>
              <h2>9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VISIT MAKKAH AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
              </p>
              <ul>
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Any loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Any damages resulting from your use or inability to use the Services</li>
                <li>Any damages resulting from unauthorized access to your account</li>
                <li>Any damages resulting from reliance on information provided through the Services</li>
              </ul>
              <p>
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US, IF ANY, IN THE PAST TWELVE MONTHS.
              </p>
            </section>

            <section>
              <h2>10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Visit Makkah and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of:
              </p>
              <ul>
                <li>Your use of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit through the Services</li>
              </ul>
            </section>

            <section>
              <h2>11. Modifications to Services and Terms</h2>

              <h3>11.1 Service Modifications</h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Services at any time without notice. We shall not be liable for any modification, suspension, or discontinuance.
              </p>

              <h3>11.2 Terms Modifications</h3>
              <p>
                We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on the Website and updating the "Last updated" date. Your continued use of the Services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2>12. Governing Law and Disputes</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Visit Makkah operates, without regard to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Services shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to binding arbitration or the appropriate courts in our jurisdiction.
              </p>
            </section>

            <section>
              <h2>13. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2>14. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Visit Makkah regarding your use of the Services and supersede any prior agreements.
              </p>
            </section>

            <section>
              <h2>15. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at:
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
