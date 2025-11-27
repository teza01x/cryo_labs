import React, { useRef, useEffect, useState } from 'react'

export default function GameField(){
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const simThrottleRef = useRef(0)
  const pointerRef = useRef({down:false,x:0,y:0})
  const [mode, setMode] = useState('ice') // 'ice' or 'fire'

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let cw = canvas.width = window.innerWidth
    let ch = canvas.height = window.innerHeight
    let cell = 8 // pixel size
    const cols = () => Math.ceil(window.innerWidth / cell)
    const rows = () => Math.ceil(window.innerHeight / cell)

    let COLS = cols()
    let ROWS = rows()
    let grid = new Uint8Array(COLS * ROWS) // 0 air, 1 water, 2 ice

    function idx(x,y){ return y*COLS + x }

    function initGrid(){
      COLS = cols(); ROWS = rows(); grid = new Uint8Array(COLS * ROWS)
      const waterLine = Math.floor(ROWS * 0.56)
      for(let y=0;y<ROWS;y++){
        for(let x=0;x<COLS;x++){
          if(y >= waterLine) grid[idx(x,y)] = 1
          else grid[idx(x,y)] = 0
        }
      }
    }
    initGrid()

    function onResize(){
      cw = canvas.width = window.innerWidth
      ch = canvas.height = window.innerHeight
      initGrid()
    }
    window.addEventListener('resize', onResize)

    // pointer interactions
    function toGrid(px,py){
      const x = Math.floor(px / cell)
      const y = Math.floor(py / cell)
      return {x,y}
    }

    function applyBrush(px,py){
      const {x,y} = toGrid(px,py)
      const r = Math.max(3, Math.floor(cell*1.6)) // radius in cells
      for(let dy=-r; dy<=r; dy++){
        for(let dx=-r; dx<=r; dx++){
          const gx = x+dx, gy = y+dy
          if(gx<0||gy<0||gx>=COLS||gy>=ROWS) continue
          if(dx*dx+dy*dy > r*r) continue
          const i = idx(gx,gy)
          if(mode === 'ice'){
            // freeze water into ice
            if(grid[i] === 1){ grid[i] = 2 }
          } else {
            // fire melts ice into water
            if(grid[i] === 2){ grid[i] = 1 }
          }
        }
      }
      // dispatch a burst event so other systems (Effects) can react visually
      try{
        window.dispatchEvent(new CustomEvent('cryo:melt-burst', { detail: { x: px, y: py, mode } }))
      }catch(e){ /* ignore */ }
    }

    function onPointerDown(e){
      pointerRef.current.down = true
      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      applyBrush(e.clientX, e.clientY)
      // notify start of local melt/freeze action
      try{ window.dispatchEvent(new CustomEvent('cryo:melt-start', { detail: { x: e.clientX, y: e.clientY, mode } })) }catch(e){}
    }
    function onPointerUp(){ pointerRef.current.down = false }
    function onPointerMove(e){
      pointerRef.current.x = e.clientX; pointerRef.current.y = e.clientY
      if(pointerRef.current.down) applyBrush(e.clientX, e.clientY)
    }

    // dispatch melt-stop when pointer up (global listener)
    window.addEventListener('pointerup', () => { try{ window.dispatchEvent(new CustomEvent('cryo:melt-stop')) }catch(e){} })

    // attach pointer events to canvas
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointermove', onPointerMove)

    // simple physics: ice rises through water by swapping upwards if water above
    let tick = 0
    function step(){
      tick++
      // every few frames, try to float ice upward
      if(tick % 3 === 0){
        for(let y=1; y<ROWS-1; y++){
          for(let x=0; x<COLS; x++){
            const i = idx(x,y)
            if(grid[i] === 2){
              // if above is water, swap (float)
              const above = idx(x,y-1)
              if(grid[above] === 1){ grid[above] = 2; grid[i] = 1 }
              else if(grid[above] === 0 && Math.random() < 0.02){ // slight chance to ascend through air
                grid[above] = 2; grid[i] = 0
              }
            }
          }
        }
      }

      // small smoothing: water spreads sideways slowly
      if(tick % 6 === 0){
        for(let y=ROWS-2; y>=0; y--){
          for(let x=0; x<COLS; x++){
            const i = idx(x,y)
            if(grid[i] === 1){
              const below = idx(x,y+1)
              if(grid[below] === 0){ grid[below] = 1; grid[i] = 0 }
            }
          }
        }
      }
    }

    // drawing
    function draw(){
      // throttle simulation updates to reduce CPU
      simThrottleRef.current += 1
      if(simThrottleRef.current >= 1){
        step(); simThrottleRef.current = 0
      }

      ctx.clearRect(0,0,cw,ch)

      // draw water and ice grid
      for(let y=0;y<ROWS;y++){
        for(let x=0;x<COLS;x++){
          const v = grid[idx(x,y)]
          if(v === 1){
            // water: draw semi-transparent blue
            ctx.fillStyle = 'rgba(80,160,200,0.18)'
            ctx.fillRect(x*cell, y*cell, cell, cell)
          } else if(v === 2){
            // ice: light pixel color
            ctx.fillStyle = 'rgba(200,240,255,0.95)'
            ctx.fillRect(x*cell, y*cell, cell, cell)
            // slight inner shading
            ctx.fillStyle = 'rgba(170,220,245,0.06)'
            ctx.fillRect(x*cell+1, y*cell+1, cell-2, cell-2)
          }
        }
      }

      // pointer preview / brush outline
      if(pointerRef.current){
        const px = pointerRef.current.x; const py = pointerRef.current.y
        ctx.strokeStyle = mode === 'ice' ? 'rgba(170,230,255,0.6)' : 'rgba(255,180,120,0.6)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(px, py, cell*2, 0, Math.PI*2)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointermove', onPointerMove)
      // cleanup
    }
  }, [mode])

  // controls overlay is rendered in App; we expose mode setter via props? keep local
  return (
    <div>
      <canvas ref={canvasRef} className="gamefield-canvas" style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',zIndex:0}} />
      <div className="game-controls" style={{position:'fixed',right:18,top:18,zIndex:1200}}>
        <button onClick={() => setMode('ice')} className={mode==='ice'? 'active':''}>Ice</button>
        <button onClick={() => setMode('fire')} className={mode==='fire'? 'active':''}>Fire</button>
        <button onClick={() => { window.location.reload() }}>Reset</button>
      </div>
    </div>
  )
}
