import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Effects from './components/Effects'
import Snowfall from './components/Snowfall'
import GameField from './components/GameField'
import DevEffectsTester from './components/DevEffectsTester'

export default function App() {
  return (
    <div className="app-root">
      <GameField />
      <Effects />
      <DevEffectsTester />
      <Snowfall />
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
