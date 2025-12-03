import React from 'react'

const projects = [
  {
    title: 'AURORA_PROTOCOL',
    type: '[WEB3] • [DEFI]',
    desc: '> Decentralized platform\n> Smart contract integration\n> Wallet connection system',
    tech: ['REACT', 'ETHERS.JS', 'WAGMI']
  },
  {
    title: 'FROST_DASHBOARD',
    type: '[ANALYTICS] • [B2B]',
    desc: '> Real-time data viz\n> Optimized rendering\n> Enterprise SaaS platform',
    tech: ['NEXT.JS', 'REACT-QUERY', 'D3.JS']
  },
  {
    title: 'PIXEL_SANDBOX',
    type: '[INTERACTIVE] • [CANVAS]',
    desc: '> Particle physics sim\n> Procedural generation\n> WebGL acceleration',
    tech: ['CANVAS', 'WEBGL', 'TYPESCRIPT']
  }
]

export default function Portfolio(){
  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2 className="section-title">// EXPERIMENT_RESULTS</h2>
        <div className="grid">
          {projects.map(p => (
            <article className="work" key={p.title}>
              <div className="frost-overlay" aria-hidden></div>
              <div className="thumb" aria-hidden></div>
              <div className="work-body">
                <h3>{p.title}</h3>
                <div className="muted">{p.type}</div>
                <p style={{whiteSpace: 'pre-line'}}>{p.desc}</p>
                <div className="tech-tags">
                  {p.tech.map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
