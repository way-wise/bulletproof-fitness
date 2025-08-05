export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to Bulletproof Fitness ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fitness application and services.
              </p>
              <p>
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="mb-4">We may collect personal information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Age, gender, and fitness goals</li>
                <li>Physical measurements (height, weight, body composition)</li>
                <li>Health and fitness data</li>
                <li>Workout preferences and history</li>
                <li>Nutrition information and dietary preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <p className="mb-4">When you use our app, we automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Device information (device type, operating system, unique identifiers)</li>
                <li>Usage data (app features used, time spent, interaction patterns)</li>
                <li>Location data (with your permission)</li>
                <li>Log information (access times, pages viewed, app crashes)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for various purposes, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Providing and maintaining our fitness services</li>
                <li>Personalizing your workout and nutrition plans</li>
                <li>Tracking your fitness progress and achievements</li>
                <li>Sending you important updates and notifications</li>
                <li>Improving our app functionality and user experience</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Ensuring the security and integrity of our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our app and providing services</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights, property, or safety</li>
                <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience with our app. These technologies help us:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze app usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure proper app functionality</li>
              </ul>
              <p>
                You can control cookie settings through your device or browser settings, but disabling cookies may affect app functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">You have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt out of certain communications and data processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
              <p className="mb-4">
                Our app may contain links to third-party websites or integrate with third-party services (such as fitness trackers or social media platforms). This Privacy Policy does not apply to these third-party services. We encourage you to review the privacy policies of any third-party services you use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We may also retain information as required by law or for legitimate business purposes, such as fraud prevention and safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this policy and notify you through the app or by email. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> privacy@bulletprooffitness.com</p>
                <p><strong>Address:</strong> [Your Company Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
