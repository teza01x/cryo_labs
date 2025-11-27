import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'

// Pixel-style iceberg with simple melting cellular automata and pixel steam
const PixelIceberg = forwardRef(function PixelIceberg(_, ref){
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useImperativeHandle(ref, () => canvasRef.current)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // pixel grid size (small -> big pixels) — increased for larger area
    const PW = 224
    const PH = 140
    canvas.width = PW
    canvas.height = PH
    // display size controlled by CSS; use nearest-neighbor

    let mounted = true

    // grid: 0 empty, 1 ice, 2 water
    const grid = new Uint8Array(PW * PH)

    function idx(x,y){ return y*PW + x }

    // initialize iceberg silhouette (blocky pixel iceberg)
    for(let x=0;x<PW;x++){
      // make a flatter top, bulging underwater base and jagged columns
      const nx = (x / PW)
      const topBase = Math.floor(PH * 0.28 + Math.sin(nx * Math.PI * 2) * 3)
      const hull = Math.floor(PH * (0.38 + (0.18 * (1 - Math.abs(nx - 0.5) * 2))))
      const jag = Math.floor((Math.random()-0.5) * 6)
      const topY = Math.max(3, topBase + jag)
      for(let y=topY; y<hull; y++){
        // create some vertical column irregularity
        if(Math.random() < 0.92) grid[idx(x,y)] = 1
      }
      // add a few floating ice blocks above
      if(Math.random() < 0.05){
        const y = topY - 2 - Math.floor(Math.random()*3)
        if(y>1) grid[idx(x,y)] = 1
      }
    }

    // water under iceberg starts empty

    const steamParticles = []

    let melting = false

    function onMeltStart(e){
      melting = true
    }
    function onMeltStop(){ melting = false }

    function onMeltBurst(e){
      const d = e && e.detail
      const rect = canvas.getBoundingClientRect()
      const cx = d && d.x ? Math.max(0, Math.min(PW-1, Math.floor((d.x - rect.left) * (PW / rect.width)))) : Math.floor(PW/2)
      const cy = d && d.y ? Math.max(0, Math.min(PH-1, Math.floor((d.y - rect.top) * (PH / rect.height)))) : Math.floor(PH/2)
      for(let i=0;i<18;i++){
        steamParticles.push({ x: cx + (Math.random()-0.5)*6, y: cy + (Math.random()-0.5)*4, vy: -0.18 - Math.random()*0.18, life: 40 + Math.random()*40, age:0 })
      }
    }

    // pointer-based local melting (friction)
    function onPointerMove(e){
      const rect = canvas.getBoundingClientRect()
      const px = Math.floor((e.clientX - rect.left) * (PW / rect.width))
      const py = Math.floor((e.clientY - rect.top) * (PH / rect.height))
      if(px < 0 || px >= PW || py < 0 || py >= PH) return
      // melt radius in grid pixels
      const r = 8
      for(let dy = -r; dy<=r; dy++){
        for(let dx = -r; dx<=r; dx++){
          const x = px + dx
          const y = py + dy
          if(x < 0 || x >= PW || y < 0 || y >= PH) continue
          if(dx*dx + dy*dy <= r*r){
            const i = idx(x,y)
            if(grid[i] === 1){
              // remove ice and create water below if possible
              grid[i] = 0
              if(y+1 < PH && grid[idx(x,y+1)] === 0) grid[idx(x,y+1)] = 2
              // small steam
              steamParticles.push({ x: x + (Math.random()-0.5)*2, y: y + (Math.random()-0.5)*2, vy: -0.12 - Math.random()*0.16, life: 36 + Math.random()*40, age:0 })
            }
          }
        }
      }
      // also dispatch global burst to sync Effects
      window.dispatchEvent(new CustomEvent('cryo:melt-burst', { detail: { x: e.clientX, y: e.clientY } }))
    }

    canvas.addEventListener('pointermove', onPointerMove)

    window.addEventListener('cryo:melt-start', onMeltStart)
    window.addEventListener('cryo:melt-stop', onMeltStop)
    window.addEventListener('cryo:melt-burst', onMeltBurst)

    function spawnMeltingDrops(){
      // find random surface ice pixels (near bottom of ice) and turn into water
      for(let trial=0; trial<12; trial++){
        const x = Math.floor(Math.random()*PW)
        // find top-most ice at column x
        for(let y=PH-7; y>2; y--){
          if(grid[idx(x,y)] === 1 && grid[idx(x,y+1)] !== 1){
            // this is a surface pixel
            if(Math.random() < 0.35){
              grid[idx(x,y)] = 0 // remove ice
              grid[idx(x,y+1)] = 2 // create water below
              // small steam burst
              steamParticles.push({ x: x + (Math.random()-0.5)*2, y: y, vy: -0.12 - Math.random()*0.12, life: 30 + Math.random()*30, age:0 })
            }
            break
          }
        }
      }
    }

    function step(){
      // water gravity pass
      for(let y=PH-2; y>=0; y--){
        for(let x=0; x<PW; x++){
          const i = idx(x,y)
          if(grid[i] === 2){
            const below = idx(x,y+1)
            if(grid[below] === 0){ grid[below] = 2; grid[i] = 0; }
            else {
              // try flow sideways
              const side = Math.random() < 0.5 ? -1 : 1
              const sx = x + side
              if(sx >= 0 && sx < PW && grid[idx(sx,y+1)] === 0){ grid[idx(sx,y+1)] = 2; grid[i] = 0 }
            }
          }
        }
      }

      // melting dynamics
      if(melting){
        if(Math.random() < 0.8) spawnMeltingDrops()
      } else {
        // slight refreeze chance: small random growth back
        if(Math.random() < 0.02){
          const x = Math.floor(Math.random()*PW)
          for(let y=3;y<PH-6;y++){
            if(grid[idx(x,y)] === 0 && grid[idx(x,y+1)] === 1){ grid[idx(x,y)] = 1; break }
          }
        }
      }

      // steam particles update
      for(let i = steamParticles.length-1; i>=0; i--){
        const p = steamParticles[i]
        p.age += 1
        p.x += (Math.random()-0.5)*0.2
        p.y += p.vy
        p.vy *= 0.995
        if(p.age > p.life) steamParticles.splice(i,1)
      }
    }

    function draw(){
      if(!mounted) return
      // clear
      ctx.clearRect(0,0,PW,PH)

      // draw background (deep water)
      ctx.fillStyle = '#031421'
      ctx.fillRect(0,0,PW,PH)

      // draw ice and water pixels
      for(let y=0;y<PH;y++){
        for(let x=0;x<PW;x++){
          const v = grid[idx(x,y)]
          if(v === 1){
            // ice color gradient
            const shade = 200 - Math.floor((y / PH) * 80) + ( (x%3===0)?6:0 )
            ctx.fillStyle = `rgb(${shade}, ${230}, ${255})`
            ctx.fillRect(x, y, 1, 1)
          } else if(v === 2){
            // water pixel
            const a = 0.85 - ((PH - y)/PH)*0.5
            ctx.fillStyle = `rgba(120,200,255,${a})`
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }

      // draw steam (pixel-ish, blurred a bit)
      for(const p of steamParticles){
        const alpha = 1 - (p.age / p.life)
        ctx.fillStyle = `rgba(230,250,255,${alpha*0.9})`
        // draw small cluster to feel pixelated but soft
        const px = Math.floor(p.x)
        const py = Math.floor(p.y)
        ctx.fillRect(px, py, 1, 1)
        if(alpha > 0.6) ctx.fillRect(px+1, py, 1, 1)
        if(alpha > 0.3) ctx.fillRect(px, py-1, 1, 1)
      }

      // step logic occasionally
      if(Math.random() < 0.5) step()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      mounted = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('cryo:melt-start', onMeltStart)
      window.removeEventListener('cryo:melt-stop', onMeltStop)
      window.removeEventListener('cryo:melt-burst', onMeltBurst)
    }
  }, [])

  // scale canvas up via CSS and force nearest-neighbor
  return (
    <canvas ref={canvasRef} className="pixel-iceberg-canvas" style={{width: '380px', height: '260px', imageRendering: 'pixelated'}} />
  )
})

export default PixelIceberg
