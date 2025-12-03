import React, { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('') // 'success' | 'error' | ''

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Simulate form submission
    setStatus('loading')

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })

      // Reset success message after 3 seconds
      setTimeout(() => setStatus(''), 3000)
    }, 1000)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">// INITIATE_CONTACT</h2>
        <p style={{ textAlign: 'center', color: 'var(--frost)', marginBottom: 'var(--grid-4)', fontSize: '12px', opacity: 0.8 }}>
          &gt; SYSTEM_READY_TO_RECEIVE_REQUESTS
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>[ COMMUNICATION_PROTOCOLS ]</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-3)', marginTop: 'var(--grid-3)' }}>
              <div>
                <div style={{ color: 'var(--ice-crystal)', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>&gt; EMAIL_PROTOCOL</div>
                <a href="mailto:hello@cryo-labs.dev" style={{ color: 'var(--ice-primary)', textDecoration: 'none', fontSize: '12px' }}>
                  hello@cryo-labs.dev
                </a>
              </div>
              <div>
                <div style={{ color: 'var(--ice-crystal)', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>&gt; TELEGRAM_CHANNEL</div>
                <a href="https://t.me/your_handle" style={{ color: 'var(--ice-primary)', textDecoration: 'none', fontSize: '12px' }}>
                  @your_handle
                </a>
              </div>
              <div>
                <div style={{ color: 'var(--ice-crystal)', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>&gt; GITHUB_REPOSITORY</div>
                <a href="https://github.com/cryo-labs" style={{ color: 'var(--ice-primary)', textDecoration: 'none', fontSize: '12px' }}>
                  github.com/cryo-labs
                </a>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <h3>[ SEND_REQUEST ]</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className={`form-group ${errors.name ? 'error' : ''}`}>
                <label htmlFor="name">NAME</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  disabled={status === 'loading'}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={status === 'loading'}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.message ? 'error' : ''}`}>
                <label htmlFor="message">MESSAGE</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  disabled={status === 'loading'}
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="btn primary"
                disabled={status === 'loading'}
                style={{ width: '100%' }}
              >
                {status === 'loading' ? '> SENDING...' : '> SEND_MESSAGE'}
              </button>

              {status === 'success' && (
                <div style={{
                  padding: 'var(--grid-2)',
                  background: 'rgba(88, 166, 255, 0.1)',
                  border: '2px solid var(--ice-primary)',
                  textAlign: 'center',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}>
                  &gt; MESSAGE_SENT_SUCCESSFULLY
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
