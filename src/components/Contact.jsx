import React from 'react'

export default function Contact(){
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h3 className="section-title">Связаться</h3>
        <p>Готовы обсудить проект? Напишите письмо или оставьте заявку — отвечаю быстро.</p>
        <div className="contact-grid">
          <div className="contact-card">
            <strong>Email</strong>
            <div>hello@cryo-labs.example</div>
          </div>
          <div className="contact-card">
            <strong>Telegram</strong>
            <div>@your_handle</div>
          </div>
        </div>
      </div>
    </section>
  )
}
