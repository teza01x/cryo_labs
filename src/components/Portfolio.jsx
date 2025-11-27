import React from 'react'

const examples = [
  { title: 'Project Aurora', type: 'Web3 marketplace', desc: 'Маркетплейс NFT с быстрой синхронизацией и кастомными индексами.' },
  { title: 'FrostApp', type: 'Web2 SaaS', desc: 'Панель управления для B2B клиентов с аналитикой и уведомлениями.' },
  { title: 'Glacier UI Kit', type: 'Design System', desc: 'Компонентная библиотека с поддержкой тем и accessibility.' }
]

export default function Portfolio(){
  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h3 className="section-title">Портфолио</h3>
        <div className="grid">
          {examples.map(e => (
            <article className="work" key={e.title}>
              <div className="frost-overlay" aria-hidden></div>
              <div className="thumb" aria-hidden></div>
              <div className="work-body">
                <h4>{e.title}</h4>
                <div className="muted">{e.type}</div>
                <p>{e.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
