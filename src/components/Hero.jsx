import React, { useEffect, useRef } from 'react'
import PixelIceberg from './PixelIceberg'

function wait(ms){ return new Promise(res => setTimeout(res, ms)) }

export default function Hero(){
  const visualRef = useRef(null)
  const shapeRef = useRef(null)

  useEffect(() => {
    const visualEl = visualRef.current
    const shapeEl = shapeRef.current

    let mounted = true

    function getCenter(){
      if(!shapeEl) return { x: window.innerWidth/2, y: window.innerHeight/2 }
      const r = shapeEl.getBoundingClientRect()
      return { x: r.left + r.width/2, y: r.top + r.height/2 }
    }

    async function cycle(){
      const frozenTime = 6000 + Math.random()*4000
      const meltTime = 3000 + Math.random()*2000
      while(mounted){
        shapeEl && shapeEl.classList.remove('melting')
        window.dispatchEvent(new CustomEvent('cryo:melt-stop'))
        await wait(frozenTime)

        const center = getCenter()
        shapeEl && shapeEl.classList.add('melting')
        window.dispatchEvent(new CustomEvent('cryo:melt-start', { detail: center }))
        const burstCount = 3 + Math.floor(Math.random()*3)
        for(let i=0;i<burstCount;i++){
          window.dispatchEvent(new CustomEvent('cryo:melt-burst', { detail: { x: center.x + (Math.random()-0.5)*60, y: center.y + (Math.random()-0.5)*30 } }))
          await wait(350 + Math.random()*450)
        }

        await wait(meltTime)
        shapeEl && shapeEl.classList.remove('melting')
        window.dispatchEvent(new CustomEvent('cryo:melt-stop'))

        await wait(1200 + Math.random()*1800)
      }
    }

    function onPointerEnter(e){
      const center = getCenter()
      shapeEl && shapeEl.classList.add('melting')
      window.dispatchEvent(new CustomEvent('cryo:melt-start', { detail: center }))
      window.dispatchEvent(new CustomEvent('cryo:melt-burst', { detail: center }))
      setTimeout(()=>{ shapeEl && shapeEl.classList.remove('melting'); window.dispatchEvent(new CustomEvent('cryo:melt-stop')) }, 1200)
    }

    visualEl && visualEl.addEventListener('pointerenter', onPointerEnter)

    cycle()

    return () => { mounted = false; visualEl && visualEl.removeEventListener('pointerenter', onPointerEnter) }
  }, [])

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <h2>Мы замораживаем сложности. Вы — развиваете бизнес.</h2>
          <p className="lead">Cryo Labs — агентство разработки web-приложений и Web3-продуктов. Создаём быстрые, надёжные и красивые интерфейсы с акцентом на UX и масштабируемость.</p>
          <div className="hero-ctas">
            <a className="btn primary" href="#contact">Заказать услугу</a>
            <a className="btn ghost" href="#portfolio">Посмотреть работы</a>
          </div>
        </div>
        <div ref={visualRef} className="hero-visual" aria-hidden>
          <PixelIceberg ref={shapeRef} />
        </div>
      </div>
    </section>
  )
}
