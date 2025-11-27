import React from 'react'

const services = [
  { title: 'Веб-разработка', desc: 'SPA, SSR, PWAs, высокопроизводительные frontend-решения.' },
  { title: 'Web3 интеграции', desc: 'Smart contracts, dApps, wallet integration, token flows.' },
  { title: 'UI/UX и дизайн', desc: 'Пользовательские интерфейсы с акцентом на простоту и стиль.' },
  { title: 'Консалтинг и архитектура', desc: 'Архитектура приложений, выбор стека и масштабируемость.' }
]

export default function Services(){
  return (
    <section id="services" className="services">
      <div className="container">
        <h3 className="section-title">Услуги</h3>
        <div className="cards">
          {services.map(s => (
            <div className="card" key={s.title}>
              <div className="frost-overlay" aria-hidden></div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
