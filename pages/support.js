import React, { useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabaseClient'
import { Mail, HelpCircle, BookOpen, Shield, MessageSquare, Clock } from 'lucide-react'

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Insert contact request into Supabase
      const { error } = await supabase.from('contact_requests').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ])

      if (error) {
        throw error
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00] text-white flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-3">
            <img src="/images/bhasha.jpeg" alt="LearnWithBhasha" className="h-10 w-10 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
            <div>
              <p className="text-xl font-extrabold tracking-tight">LearnWithBhasha</p>
              <p className="text-xs text-orange-200/80">Support Center</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/" className="text-orange-200/80 hover:text-orange-100 transition-colors">Home</Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-10">
        <div className="container mx-auto max-w-4xl">
          {/* App Info Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img src="/images/bhasha.jpeg" alt="LearnWithBhasha Logo" className="h-16 w-16 rounded-full ring-2 ring-orange-300/60" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                  LearnWithBhasha
                </h1>
                <p className="text-orange-100/90 mt-2">
                  Learn Indian Languages - Your personalized journey to mastering India's beautiful languages
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <Mail className="text-orange-300" size={28} />
              Get in Touch
            </h2>

            <div className="mb-6">
              <p className="text-orange-100/90 mb-4">
                We're here to help! Reach out to us using any of the methods below:
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <a 
                  href="mailto:support@learnwithbhasha.com" 
                  className="text-orange-300 hover:text-orange-200 transition-colors flex items-center gap-2 text-lg font-medium"
                >
                  <Mail size={20} />
                  support@learnwithbhasha.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-orange-100/80 text-sm">
                <Clock size={16} />
                <p>We usually respond within 24–48 hours.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-orange-100 mb-4">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-orange-100/90 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-orange-100/90 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-orange-100/90 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-orange-100/90 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-orange-200/50 focus:outline-none focus:ring-2 focus:ring-orange-300/50 resize-none"
                    placeholder="Tell us about your question or feedback..."
                  />
                </div>
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
                    Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                    Something went wrong. Please try again or email us directly at support@learnwithbhasha.com
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-400 to-amber-300 text-black font-semibold rounded-lg hover:from-orange-300 hover:to-amber-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <HelpCircle className="text-orange-300" size={28} />
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">How do I create an account?</h3>
                <p className="text-orange-100/90">
                  You can create an account by signing in with Google. Simply tap the "Sign In" button on the app's home screen and follow the prompts. Your account will be created automatically when you sign in for the first time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">I forgot my password. How do I reset it?</h3>
                <p className="text-orange-100/90">
                  Since we use Google Sign-In, you don't need a separate password. If you're having trouble signing in, make sure you're using the same Google account you used when you first created your account. If issues persist, please contact our support team.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">How do I change my learning language?</h3>
                <p className="text-orange-100/90">
                  You can change your learning language at any time from the app settings. Go to your profile, select "Settings," and choose "Change Language" to switch to a different Indian language.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">My progress isn't saving. What should I do?</h3>
                <p className="text-orange-100/90">
                  Make sure you're signed in to your account and have a stable internet connection. If your progress still isn't saving, try signing out and signing back in. If the problem continues, please contact support with details about when this started happening.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">The app is crashing or freezing. How can I fix this?</h3>
                <p className="text-orange-100/90">
                  First, try closing and reopening the app. If that doesn't help, try restarting your device. Make sure you have the latest version of the app installed. If the issue persists, please contact us with your device model and the version of the app you're using.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">Can I use the app offline?</h3>
                <p className="text-orange-100/90">
                  Some features require an internet connection, but you can download lessons for offline use. Go to your course, tap on a lesson, and select "Download for Offline" to access it without internet.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-2">How do I delete my account?</h3>
                <p className="text-orange-100/90">
                  To delete your account, please contact our support team at support@learnwithbhasha.com with your request. We'll process your account deletion within 7 business days. Note that this action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Help Resources Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <BookOpen className="text-orange-300" size={28} />
              Help Resources
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-3">Legal & Privacy</h3>
                <ul className="space-y-2 text-orange-100/90">
                  <li>• <Link href="/privacy" className="text-orange-300 hover:text-orange-200 transition-colors underline">Privacy Policy</Link> - How we protect your data</li>
                  <li>• <Link href="/terms" className="text-orange-300 hover:text-orange-200 transition-colors underline">Terms & Conditions</Link> - Terms of service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-100 mb-3">Connect With Us</h3>
                <ul className="space-y-2 text-orange-100/90">
                  <li>• <a href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj" target="_blank" rel="noopener noreferrer" className="text-orange-300 hover:text-orange-200 transition-colors underline">Instagram</a> - Follow us for updates and tips</li>
                </ul>
              </div>
            </div>
          </div>

          {/* App Version Info */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-xl font-semibold text-orange-100 mb-4">App Information</h2>
            <div className="space-y-2 text-orange-100/90">
              <p><span className="font-medium">Current Version:</span> 1.0.0</p>
              <p><span className="font-medium">Last Updated:</span> January 2025</p>
              <p className="text-sm text-orange-200/70 mt-4">
                Make sure you're using the latest version to get the best experience and latest features. You can check for updates in your device's app store.
              </p>
            </div>
          </div>

          {/* Apple Review Statement */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10">
            <div className="flex items-start gap-3">
              <Shield className="text-orange-300 mt-1" size={24} />
              <div>
                <p className="text-orange-100/90 leading-relaxed">
                  <strong className="text-orange-100">This page is for support of LearnWithBhasha app users.</strong> If you experience any issues, please contact us using the information above. We're committed to providing you with the best learning experience and are here to help with any questions or concerns you may have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-xs text-orange-200/70">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© LearnWithBhasha 2025</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-orange-100 transition-colors">Privacy</Link>
            <span className="text-orange-200/40">|</span>
            <Link href="/terms" className="hover:text-orange-100 transition-colors">Terms</Link>
            <span className="text-orange-200/40">|</span>
            <Link href="/" className="hover:text-orange-100 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

