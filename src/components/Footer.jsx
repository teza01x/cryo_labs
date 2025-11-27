import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>© {new Date().getFullYear()} Cryo Labs</div>
        <div className="muted">Разработка web2 · Web3 · UI/UX</div>
      </div>
    </footer>
  )
}
