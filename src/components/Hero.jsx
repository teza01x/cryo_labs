import React from 'react'
import DNAHelix from './DNAHelix'

export default function Hero(){
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1>CRYO<br/>LABS</h1>
          <p className="lead">&gt; INITIALIZING_LAB...<br/>&gt; LOADING_MODULES: [FRONTEND] [BLOCKCHAIN] [DESIGN]<br/>&gt; STATUS: READY</p>
          <div className="hero-ctas">
            <a className="btn primary" href="#contact">&gt; CONTACT_</a>
            <a className="btn ghost" href="#portfolio">&gt; PROJECTS_</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <DNAHelix />
        </div>
      </div>
    </section>
  )
}
