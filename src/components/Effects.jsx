import React, { useRef, useEffect } from 'react'
import { PERFORMANCE, FEATURES } from '../config'

// Layered, flow-field driven vapor effect
export default function Effects(){
  // Check for reduced motion preference
  if (FEATURES.RESPECT_REDUCED_MOTION && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }
  const bgRef = useRef(null)
  const fgRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current
    const fg = fgRef.current
    const bgCtx = bg.getContext('2d')
    const fgCtx = fg.getContext('2d')

    let w = bg.width = fg.width = window.innerWidth
    let h = bg.height = fg.height = window.innerHeight

    function onResize(){
      w = bg.width = fg.width = window.innerWidth
      h = bg.height = fg.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // create a soft elongated particle sprite on an offscreen canvas
    const sprite = document.createElement('canvas')
    const sctx = sprite.getContext('2d')
    sprite.width = 128
    sprite.height = 64
    function makeSprite(){
      sctx.clearRect(0,0,sprite.width,sprite.height)
      const g = sctx.createLinearGradient(0,0,sprite.width,0)
      g.addColorStop(0, 'rgba(255,255,255,0.0)')
      // reduce center intensity to avoid bright glow
      g.addColorStop(0.2, 'rgba(240,250,255,0.03)')
      g.addColorStop(0.5, 'rgba(200,240,255,0.05)')
      g.addColorStop(0.8, 'rgba(160,230,255,0.02)')
      g.addColorStop(1, 'rgba(255,255,255,0.0)')
      sctx.fillStyle = g
      sctx.beginPath()
      sctx.ellipse(sprite.width/2, sprite.height/2, sprite.width*0.5, sprite.height*0.6, 0, 0, Math.PI*2)
      sctx.fill()
      // soft blur using multiple draws
      sctx.globalCompositeOperation = 'lighter'
      for(let i=0;i<3;i++){
        sctx.globalAlpha = 0.015
        sctx.drawImage(sprite, -1 + Math.random()*2, -1 + Math.random()*2)
      }
      sctx.globalAlpha = 1
      sctx.globalCompositeOperation = 'source-over'
    }
    makeSprite()

    // particle system
    const particles = []
    const auroraParticles = []

    // simple coherent noise-like field using sines for flow
    function flowAngle(x,y,t){
      const nx = x * 0.002
      const ny = y * 0.002
      return (Math.sin(nx + t*0.0009) + Math.cos(ny - t*0.0013)) * Math.PI * 0.7
    }

    function spawn(x,y,opts = {}){
      // Enforce particle limit
      if (particles.length >= PERFORMANCE.MAX_PARTICLES) {
        // Remove oldest particles first
        particles.splice(0, Math.floor(PERFORMANCE.MAX_PARTICLES * 0.1))
      }

      const life = opts.life || (80 + Math.random()*80)
      const size = opts.size || (22 + Math.random()*36)
      const type = opts.type || 'steam'
      particles.push({
        x, y,
        vx: (Math.random()-0.5)*0.6,
        vy: -0.2 - Math.random()*0.6,
        life,
        size,
        type,
        age:0,
        omega: (Math.random()-0.5)*0.02,
        swirl: (Math.random()-0.5)*0.6
      })
    }

    // melt-driven steam control
    let meltActive = false
    let meltMode = 'ice'
    let meltPos = { x: w/2, y: h/2 }

    function onMeltStart(e){
      const d = e && e.detail
      meltActive = true
      if(d && typeof d.x === 'number') meltPos = { x: d.x, y: d.y }
      if(d && d.mode) meltMode = d.mode
    }
    function onMeltStop(){ meltActive = false }
    function onMeltBurst(e){
      const d = e && e.detail
      const cx = d && typeof d.x === 'number' ? d.x : (pointer.x || w/2)
      const cy = d && typeof d.y === 'number' ? d.y : (pointer.y || h/2)
      // spawn a dense burst tuned to the mode (ice -> steam, fire -> embers+smoke)
      const mode = d && d.mode ? d.mode : 'ice'
      if(mode === 'fire'){
        for(let i=0;i<PERFORMANCE.SMOKE_PARTICLES_PER_BURST;i++){
          const sx = cx + (Math.random()-0.5)*90
          const sy = cy + (Math.random()-0.5)*50
          // embers: small, short-lived, warm color
          spawn(sx, sy, { type: 'ember', size: 6 + Math.random()*8, life: 30 + Math.random()*40 })
        }
        for(let i=0;i<8;i++){
          const sx = cx + (Math.random()-0.5)*120
          const sy = cy + (Math.random()-0.5)*60
          // smoke: larger, slower, darker
          spawn(sx, sy, { type: 'smoke', size: 20 + Math.random()*40, life: 80 + Math.random()*80 })
        }
      } else {
        // steam burst (reduced from 12 to configurable amount)
        const steamCount = Math.floor(PERFORMANCE.STEAM_PARTICLES_PER_BURST * 0.7)
        for(let i=0;i<steamCount;i++){
          const sx = cx + (Math.random()-0.5)*80
          const sy = cy + (Math.random()-0.5)*40
          spawn(sx, sy, { type: 'steam', size: 18 + Math.random()*36, life: 60 + Math.random()*100 })
        }
      }
    }

    window.addEventListener('cryo:melt-start', onMeltStart)
    window.addEventListener('cryo:melt-stop', onMeltStop)
    window.addEventListener('cryo:melt-burst', onMeltBurst)

    const pointer = { x: w/2, y: h/2, active:false }

    let lastMove = Date.now()
    function onMove(e){
      const rect = fg.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
      lastMove = Date.now()
      // spawn very subtle plumes near cursor, but not bright
      const count = 1
      for(let i=0;i<count;i++){
        const jitterX = (Math.random()-0.5)*8
        const jitterY = (Math.random()-0.5)*6
        spawn(pointer.x + jitterX, pointer.y + jitterY, { size: 10 + Math.random()*12, life: 30 + Math.random()*40 })
      }
    }

    function onEnter(){
      // burst (reduced from 40 to 20 for better performance)
      const burstCount = 20
      for(let i=0;i<burstCount;i++){
        spawn(pointer.x + (Math.random()-0.5)*80, pointer.y + (Math.random()-0.5)*60, { size: 30 + Math.random()*60, life: 80 + Math.random()*120 })
      }
    }

    function onLeave(){ /* no-op for now */ }

    window.addEventListener('pointermove', onMove)

    const freezeEls = document.querySelectorAll('.card, .work, .hero-visual')
    freezeEls.forEach(el => {
      // when entering iceberg/cards: trigger steam burst but DO NOT create aurora (no cursor-like glow on elements)
      el.addEventListener('pointerenter', (e) => { onEnter(); el.classList.add('freeze-hit'); setTimeout(()=>el.classList.remove('freeze-hit'), 900) })
      el.addEventListener('pointerleave', onLeave)
    })

    let t0 = performance.now()
    function updateAndDraw(t){
      const dt = Math.min(32, t - t0)
      t0 = t

      // background fog - draw subtle moving radial blobs
      bgCtx.clearRect(0,0,w,h)
      const grad = bgCtx.createLinearGradient(0,0,w,h)
      grad.addColorStop(0, 'rgba(6,20,30,0.0)')
      grad.addColorStop(1, 'rgba(6,20,30,0.1)')
      bgCtx.fillStyle = grad
      bgCtx.fillRect(0,0,w,h)

      // moving soft blobs
      const time = t
      for(let i=0;i<6;i++){
        const bx = (Math.sin(time*0.0002 + i) * 0.5 + 0.5) * w
        const by = (Math.cos(time*0.00017 + i*1.2) * 0.5 + 0.5) * h
        const br = 200 + (i*24)
        const g = bgCtx.createRadialGradient(bx,by,0,bx,by,br)
        // very subtle ambient glow only
        g.addColorStop(0, 'rgba(180,230,255,0.006)')
        g.addColorStop(1, 'rgba(180,230,255,0.0)')
        bgCtx.fillStyle = g
        bgCtx.fillRect(bx-br, by-br, br*2, br*2)
      }

      // particles and aurora update
      fgCtx.clearRect(0,0,w,h)
      // draw aurora particles (pixel-style northern lights)
      fgCtx.save()
      fgCtx.imageSmoothingEnabled = false
      fgCtx.globalCompositeOperation = 'lighter'
      for(let ai = auroraParticles.length-1; ai>=0; ai--){
        const a = auroraParticles[ai]
        a.age += dt
        const lifeRatioA = 1 - (a.age / a.life)
        if(lifeRatioA <= 0){ auroraParticles.splice(ai,1); continue }
        // slight horizontal waving
        a.x += Math.sin((t + a.age*6) * 0.001) * 0.12
        a.y -= 0.02 * dt
        const alphaA = Math.max(0, Math.min(1, lifeRatioA)) * 0.9
        // pixel columns
        const colW = 3
        const cols = Math.max(1, Math.floor(a.width / colW))
        for(let c=0;c<cols;c++){
          const cx = Math.round(a.x + c*colW - (cols*colW)/2)
          const ch = Math.round(a.height * (0.5 + Math.random()*0.6) * lifeRatioA)
          const cy = Math.round(a.y - ch/2)
          fgCtx.fillStyle = `hsla(${a.hue + c*4}, 90%, 60%, ${alphaA * 0.6})`
          fgCtx.fillRect(cx, cy, colW, ch)
        }
      }
      fgCtx.restore()

      for(let i = particles.length -1; i>=0; i--){
        const p = particles[i]
        p.age += dt
        const lifeRatio = 1 - (p.age / p.life)
        if(lifeRatio <= 0){ particles.splice(i,1); continue }

        // flow field influence
        const angle = flowAngle(p.x, p.y, t)
        const fx = Math.cos(angle) * 0.06
        const fy = Math.sin(angle) * 0.03
        p.vx += fx * (0.5 + Math.random()*0.6) + (Math.random()-0.5)*0.02
        p.vy += fy * (0.5 + Math.random()*0.6) - 0.001

        // apply basic physics
        p.vx *= 0.985
        p.vy *= 0.995
        p.x += p.vx * (dt*0.06)
        p.y += p.vy * (dt*0.06)

          // draw particle based on its type with toned-down alpha to avoid bloom
          const alpha = Math.max(0, Math.min(1, lifeRatio))
          const drawSize = p.size * (1 + (1-lifeRatio)*0.6)
          if(p.type === 'ember'){
            // small glowing ember, additive
            fgCtx.save()
            fgCtx.globalCompositeOperation = 'lighter'
            const g = fgCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize)
            g.addColorStop(0, `rgba(255,220,140,${0.9 * alpha})`)
            g.addColorStop(0.4, `rgba(255,140,40,${0.45 * alpha})`)
            g.addColorStop(1, `rgba(120,40,20,${0.02 * alpha})`)
            fgCtx.fillStyle = g
            fgCtx.beginPath()
            fgCtx.arc(p.x, p.y, Math.max(1, drawSize*0.35), 0, Math.PI*2)
            fgCtx.fill()
            fgCtx.restore()
          } else if(p.type === 'smoke'){
            // soft smoke cloud
            fgCtx.save()
            fgCtx.globalCompositeOperation = 'source-over'
            const g2 = fgCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize)
            const smoky = Math.max(0.06, 0.28 * (1-lifeRatio))
            g2.addColorStop(0, `rgba(180,180,190,${0.18 * alpha})`)
            g2.addColorStop(0.5, `rgba(120,120,130,${0.08 * alpha})`)
            g2.addColorStop(1, `rgba(100,100,110,0.0)`)
            fgCtx.fillStyle = g2
            fgCtx.beginPath()
            fgCtx.ellipse(p.x, p.y - (1-lifeRatio)*8, drawSize*0.7, drawSize*0.45, 0, 0, Math.PI*2)
            fgCtx.fill()
            fgCtx.restore()
          } else {
            // default: steam — sprite-based elongated puff
            fgCtx.save()
            fgCtx.globalAlpha = alpha * 0.45
            fgCtx.translate(p.x, p.y + (1-lifeRatio)*12)
            const rot = Math.atan2(p.vy, p.vx) + p.omega
            fgCtx.rotate(rot)
            fgCtx.drawImage(sprite, -drawSize/2, -drawSize*0.25, drawSize, drawSize*0.5)
            fgCtx.restore()
          }
      }

      // if melt is active, spawn gentle steam near meltPos (toned down)
      if(meltActive){
        const density = 1 + Math.floor(Math.random()*2)
        for(let i=0;i<density;i++){
          const sx = meltPos.x + (Math.random()-0.5)*60
          const sy = meltPos.y + (Math.random()-0.5)*30
          if(meltMode === 'fire'){
            // fire mode: occasional embers + smoke
            if(Math.random() < 0.22){
              spawn(sx + (Math.random()-0.5)*20, sy + (Math.random()-0.5)*10, { type: 'ember', size: 4 + Math.random()*8, life: 30 + Math.random()*50 })
            } else {
              spawn(sx + (Math.random()-0.5)*30, sy + (Math.random()-0.5)*20, { type: 'smoke', size: 18 + Math.random()*32, life: 70 + Math.random()*90 })
            }
          } else {
            spawn(sx, sy, { type: 'steam', size: 18 + Math.random()*28, life: 60 + Math.random()*80 })
          }
        }
      }

      // ambient spawn when idle
      if(Date.now() - lastMove > 1400){
        if(Math.random() < 0.08) spawn(Math.random()*w, h*0.6 + Math.random()*h*0.3, { size: 40 + Math.random()*60, life: 120 + Math.random()*80 })
      }

      rafRef.current = requestAnimationFrame(updateAndDraw)
    }

    rafRef.current = requestAnimationFrame(updateAndDraw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('cryo:melt-start', onMeltStart)
      window.removeEventListener('cryo:melt-stop', onMeltStop)
      window.removeEventListener('cryo:melt-burst', onMeltBurst)
      freezeEls.forEach(el => {
        el.removeEventListener('pointerenter', onEnter)
        el.removeEventListener('pointerleave', onLeave)
      })
    }
  }, [])

  // two canvases stacked; bg for fog blobs, fg for particles
  return (
    <>
      <canvas ref={bgRef} className="cryo-effects-canvas bg" style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:100}}></canvas>
      <canvas ref={fgRef} className="cryo-effects-canvas fg" style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:601}}></canvas>
    </>
  )
}
