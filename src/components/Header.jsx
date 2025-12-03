import React from 'react'

export default function Header(){
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#" className="brand">
          <div className="logo-ice" aria-hidden="true"></div>
          <div>
            <div className="brand-name">CRYO LABS</div>
            <div className="brand-tag">&lt;/&gt; ICE.LAB.v2.0</div>
          </div>
        </a>
        <nav className="nav">
          <a href="#services">[MODULES]</a>
          <a href="#portfolio">[EXPERIMENTS]</a>
          <a href="#contact">[CONTACT]</a>
        </nav>
      </div>
    </header>
  )
}
