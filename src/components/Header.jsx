import React from 'react'

export default function Header(){
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <div className="logo-ice" aria-hidden>❄️</div>
          <div>
            <h1 className="brand-name">Cryo Labs</h1>
            <div className="brand-tag">Web2 & Web3 development agency</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#services">Услуги</a>
          <a href="#portfolio">Портфолио</a>
          <a href="#contact">Контакты</a>
        </nav>
      </div>
    </header>
  )
}
