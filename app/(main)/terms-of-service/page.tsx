export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                Welcome to Bulletproof Fitness ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our fitness application, website, and related services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
              <p>
                If you do not agree to these Terms, please do not use our Service. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="mb-4">
                Bulletproof Fitness provides a comprehensive fitness platform that includes:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Exercise library with instructional videos and guides</li>
                <li>Customized workout plans and exercise setups</li>
                <li>Fitness tracking and progress monitoring</li>
                <li>Nutritional guidance and meal planning</li>
                <li>Demo center locations and equipment information</li>
                <li>Community features and user interaction tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Account and Registration</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="mb-4">
                To access certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Security</h3>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Account Termination</h3>
              <p className="mb-4">
                We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason we deem appropriate.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Upload or share harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service for any commercial purpose without our prior written consent</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Distribute spam, malware, or other malicious content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Our Content</h3>
              <p className="mb-4">
                All content provided through our Service, including but not limited to text, graphics, videos, exercise routines, and software, is owned by Bulletproof Fitness or our licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 User-Generated Content</h3>
              <p className="mb-4">
                By uploading or submitting content to our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, reproduce, and distribute such content in connection with our Service.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.3 Copyright Infringement</h3>
              <p className="mb-4">
                We respect intellectual property rights and will respond to valid copyright infringement claims in accordance with applicable law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Health and Safety Disclaimer</h2>
              <p className="mb-4">
                <strong>Important:</strong> Our Service provides fitness and nutritional information for educational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Always consult with a healthcare professional before starting any exercise program</li>
                <li>Listen to your body and stop exercising if you experience pain or discomfort</li>
                <li>We are not responsible for any injuries that may occur from following our exercise programs</li>
                <li>Individual results may vary, and we make no guarantees about fitness outcomes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you also agree to our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Subscription and Payment Terms</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">8.1 Subscription Plans</h3>
              <p className="mb-4">
                We may offer various subscription plans with different features and pricing. Subscription fees are charged in advance and are non-refundable except as required by law.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">8.2 Automatic Renewal</h3>
              <p className="mb-4">
                Subscriptions automatically renew at the end of each billing period unless canceled before the renewal date. You may cancel your subscription at any time through your account settings.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">8.3 Price Changes</h3>
              <p className="mb-4">
                We reserve the right to change subscription prices with reasonable advance notice. Price changes will not affect your current billing period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitation of Liability</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">9.1 Service Availability</h3>
              <p className="mb-4">
                We strive to maintain continuous service availability but do not guarantee that our Service will be uninterrupted or error-free. We may temporarily suspend the Service for maintenance or updates.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">9.2 Limitation of Liability</h3>
              <p className="mb-4">
                To the maximum extent permitted by law, Bulletproof Fitness shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">9.3 Disclaimer of Warranties</h3>
              <p className="mb-4">
                Our Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Bulletproof Fitness, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Third-Party Services</h2>
              <p>
                Our Service may integrate with or link to third-party services, websites, or applications. We are not responsible for the content, privacy practices, or terms of service of any third-party services. Your use of third-party services is subject to their respective terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p className="mb-4">
                Either party may terminate these Terms at any time. Upon termination:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your right to use the Service will cease immediately</li>
                <li>We may delete your account and all associated data</li>
                <li>Sections relating to intellectual property, disclaimers, and limitation of liability will survive termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">13.1 Governing Law</h3>
              <p className="mb-4">
                These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">13.2 Dispute Resolution</h3>
              <p className="mb-4">
                Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration in accordance with the rules of [Arbitration Organization], except where prohibited by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of significant changes through the Service or by email. Your continued use of the Service after changes are made constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> legal@bulletprooffitness.com</p>
                <p><strong>Address:</strong> [Your Company Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any additional terms that apply to specific features of our Service, constitute the entire agreement between you and Bulletproof Fitness regarding your use of the Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
