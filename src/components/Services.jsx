import React from 'react'

const services = [
  {
    icon: '▓',
    title: '[ FRONTEND_DEV ]',
    desc: '> React/Next.js apps\n> Lightning-fast SPAs\n> 100/100 performance\n> SEO optimized'
  },
  {
    icon: '◆',
    title: '[ BLOCKCHAIN ]',
    desc: '> Smart contracts\n> dApp integration\n> Wallet connect\n> Web3 solutions'
  },
  {
    icon: '◢',
    title: '[ UI_UX_DESIGN ]',
    desc: '> Pixel-perfect layouts\n> Interactive animations\n> Modern aesthetics\n> User-focused'
  },
  {
    icon: '◣',
    title: '[ OPTIMIZATION ]',
    desc: '> Performance audit\n> Code refactoring\n> Speed boost 2-5x\n> Core Web Vitals'
  }
]

export default function Services(){
  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">// LAB_MODULES</h2>
        <div className="cards">
          {services.map(s => (
            <div className="card" key={s.title}>
              <div className="frost-overlay" aria-hidden></div>
              <span className="icon" aria-hidden>{s.icon}</span>
              <h3>{s.title}</h3>
              <p style={{whiteSpace: 'pre-line'}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
