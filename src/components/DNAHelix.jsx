import React, { useRef, useEffect } from 'react'

export default function DNAHelix() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const PIXEL = 8
    const WIDTH = 420
    const HEIGHT = 520

    canvas.width = WIDTH
    canvas.height = HEIGHT

    let rotation = 0
    let hologramFlicker = 0
    const helixHeight = 48 // number of levels
    const radius = 19 // radius in pixels
    const spacing = 11 // vertical spacing between levels

    // Energy particles
    const particles = []
    for (let i = 0; i < 20; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        level: Math.random() * helixHeight,
        speed: 0.02 + Math.random() * 0.03,
        size: 1 + Math.random() * 2,
        life: Math.random()
      })
    }

    // DNA data - binary sequences
    class DNABit {
      constructor(x, y, bit, side) {
        this.x = x
        this.y = y
        this.bit = bit // '0' or '1'
        this.side = side // 'left' or 'right'
        this.glow = 0
      }

      draw(ctx, alpha = 1) {
        const color = this.bit === '1' ? '#58a6ff' : '#79c0ff'

        ctx.save()
        ctx.globalAlpha = alpha * (0.7 + this.glow * 0.3)
        ctx.fillStyle = color
        ctx.font = 'bold 16px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Pixel text shadow
        ctx.shadowColor = '#58a6ff'
        ctx.shadowBlur = 8 + this.glow * 8

        ctx.fillText(this.bit, this.x, this.y)
        ctx.restore()
      }
    }

    // Connection lines between bits
    function drawConnection(ctx, x1, y1, x2, y2, alpha = 1) {
      ctx.save()
      ctx.strokeStyle = '#58a6ff'
      ctx.globalAlpha = alpha * 0.3
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      rotation += 0.0056
      hologramFlicker = Math.sin(Date.now() * 0.005) * 0.15

      const centerX = WIDTH / 2
      const startY = 40

      // Draw energy particles
      particles.forEach(p => {
        p.angle += p.speed
        p.level += 0.05
        if (p.level > helixHeight) p.level = 0
        p.life = (p.life + 0.01) % 1

        const y = startY + p.level * spacing
        const x = centerX + Math.cos(p.angle + rotation) * radius * PIXEL
        const z = Math.sin(p.angle + rotation) * radius

        const alpha = Math.sin(p.life * Math.PI) * (0.3 + (z + radius) / (radius * 2) * 0.3)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#00d9ff'
        ctx.shadowColor = '#00d9ff'
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw DNA helix
      for (let i = 0; i < helixHeight; i++) {
        const y = startY + i * spacing
        const angle = rotation + (i * Math.PI / 8)

        // Left strand position
        const leftX = centerX + Math.cos(angle) * radius * PIXEL
        const leftZ = Math.sin(angle) * radius // depth

        // Right strand position (opposite side)
        const rightX = centerX + Math.cos(angle + Math.PI) * radius * PIXEL
        const rightZ = Math.sin(angle + Math.PI) * radius

        // Calculate which strand is in front
        const leftInFront = leftZ > 0
        const rightInFront = rightZ > 0

        // Alpha based on depth (Z-position) + hologram flicker
        const baseLeftAlpha = 0.5 + (leftZ + radius) / (radius * 2) * 0.5
        const baseRightAlpha = 0.5 + (rightZ + radius) / (radius * 2) * 0.5
        const leftAlpha = baseLeftAlpha + hologramFlicker
        const rightAlpha = baseRightAlpha + hologramFlicker

        // Generate bit based on position (pseudo-random but consistent)
        const leftBit = Math.sin(i * 1.5 + rotation * 0.1) > 0 ? '1' : '0'
        const rightBit = Math.cos(i * 1.7 - rotation * 0.1) > 0 ? '1' : '0'

        // Draw connection first (behind bits)
        if (i % 3 === 0) { // Only draw some connections for clarity
          drawConnection(ctx, leftX, y, rightX, y, Math.min(leftAlpha, rightAlpha))
        }

        // Create bit objects
        const leftBitObj = new DNABit(leftX, y, leftBit, 'left')
        const rightBitObj = new DNABit(rightX, y, rightBit, 'right')

        // Add glow effect based on position
        leftBitObj.glow = Math.sin(rotation * 2 + i * 0.5) * 0.5 + 0.5
        rightBitObj.glow = Math.cos(rotation * 2 + i * 0.5) * 0.5 + 0.5

        // Draw back strand first, then front strand
        if (leftInFront && !rightInFront) {
          rightBitObj.draw(ctx, rightAlpha)
          leftBitObj.draw(ctx, leftAlpha)
        } else if (!leftInFront && rightInFront) {
          leftBitObj.draw(ctx, leftAlpha)
          rightBitObj.draw(ctx, rightAlpha)
        } else {
          // Both in front or both behind - draw based on alpha
          if (leftAlpha > rightAlpha) {
            rightBitObj.draw(ctx, rightAlpha)
            leftBitObj.draw(ctx, leftAlpha)
          } else {
            leftBitObj.draw(ctx, leftAlpha)
            rightBitObj.draw(ctx, rightAlpha)
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Interaction: click to speed up rotation
    let speedMultiplier = 1
    function handleClick() {
      speedMultiplier = 3
      setTimeout(() => {
        speedMultiplier = 1
      }, 1000)
    }

    function handleMouseEnter() {
      speedMultiplier = 2
    }

    function handleMouseLeave() {
      speedMultiplier = 1
    }

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="dna-helix-canvas"
      style={{
        width: '100%',
        maxWidth: '420px',
        height: 'auto',
        imageRendering: 'pixelated',
        cursor: 'pointer',
      }}
    />
  )
}
