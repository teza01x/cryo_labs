import React, { useRef, useEffect } from 'react'
import { PERFORMANCE, FEATURES } from '../config'

export default function Snowfall(){
  // Check for reduced motion preference
  if (FEATURES.RESPECT_REDUCED_MOTION && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    function onResize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const flakes = []
    // Use config values for min/max snowflakes
    const F = Math.min(
      PERFORMANCE.SNOWFLAKE_COUNT.MAX,
      Math.max(PERFORMANCE.SNOWFLAKE_COUNT.MIN, Math.floor((w*h) / 90000))
    )
    for(let i=0;i<F;i++){
      flakes.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: 0.8 + Math.random()*2.4,
        vx: (Math.random()-0.5)*0.2,
        vy: 0.2 + Math.random()*0.7,
        sway: Math.random()*Math.PI*2
      })
    }

    function draw(){
      ctx.clearRect(0,0,w,h)
      ctx.fillStyle = '#79c0ff'
      for(const f of flakes){
        f.x += f.vx + Math.sin(f.sway) * 0.3
        f.y += f.vy
        f.sway += 0.01 + Math.random()*0.01
        if(f.y > h + 10){ f.y = -10; f.x = Math.random()*w }
        if(f.x < -10) f.x = w + 10
        if(f.x > w + 10) f.x = -10
        ctx.globalAlpha = 0.3 + (f.r/4)*0.2
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI*2)
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="snow-canvas" style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:150}} />
}
