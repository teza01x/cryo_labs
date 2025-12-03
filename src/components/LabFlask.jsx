import React, { useRef, useEffect } from 'react'

export default function LabFlask() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const PIXEL = 8
    const WIDTH = 224
    const HEIGHT = 280

    canvas.width = WIDTH
    canvas.height = HEIGHT

    // Flask shape parameters
    const FLASK_WIDTH = 18 // pixels
    const FLASK_HEIGHT = 28 // pixels
    const NECK_WIDTH = 6
    const NECK_HEIGHT = 4

    // Liquid simulation
    const liquid = {
      level: 20, // height in pixels
      targetLevel: 20,
      wave: 0,
      color: '#58a6ff',
    }

    // Bubbles
    const bubbles = []
    const MAX_BUBBLES = 12

    class Bubble {
      constructor() {
        this.x = 4 + Math.random() * (FLASK_WIDTH - 8)
        this.y = FLASK_HEIGHT - liquid.level + Math.random() * 4
        this.size = 1 + Math.random() * 2
        this.speed = 0.3 + Math.random() * 0.4
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = 0.05 + Math.random() * 0.05
      }

      update() {
        this.y -= this.speed
        this.wobble += this.wobbleSpeed
        this.x += Math.sin(this.wobble) * 0.2

        // Remove if reached top
        return this.y > -2
      }

      draw(ctx, offsetX, offsetY) {
        ctx.fillStyle = '#79c0ff'
        ctx.fillRect(
          Math.floor(offsetX + this.x),
          Math.floor(offsetY + this.y),
          Math.ceil(this.size),
          Math.ceil(this.size)
        )
      }
    }

    // Spawn bubble
    function spawnBubble() {
      if (bubbles.length < MAX_BUBBLES && Math.random() < 0.08) {
        bubbles.push(new Bubble())
      }
    }

    // Draw pixel-perfect flask
    function drawFlask() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      const centerX = Math.floor(WIDTH / 2)
      const startY = Math.floor((HEIGHT - FLASK_HEIGHT - NECK_HEIGHT) / 2)

      // Flask body outline (pixel-perfect)
      ctx.strokeStyle = '#58a6ff'
      ctx.lineWidth = 2

      // Draw flask shape pixel by pixel
      const flaskLeft = centerX - Math.floor(FLASK_WIDTH / 2)
      const flaskRight = centerX + Math.floor(FLASK_WIDTH / 2)
      const neckLeft = centerX - Math.floor(NECK_WIDTH / 2)
      const neckRight = centerX + Math.floor(NECK_WIDTH / 2)

      // Left side
      ctx.fillStyle = '#58a6ff'
      // Neck
      ctx.fillRect(neckLeft, startY, 2, NECK_HEIGHT * PIXEL)
      // Body
      ctx.fillRect(flaskLeft, startY + NECK_HEIGHT * PIXEL, 2, FLASK_HEIGHT * PIXEL)
      // Bottom
      ctx.fillRect(flaskLeft, startY + (NECK_HEIGHT + FLASK_HEIGHT) * PIXEL, FLASK_WIDTH * PIXEL, 2)
      // Right side
      ctx.fillRect(flaskRight * PIXEL - 2, startY + NECK_HEIGHT * PIXEL, 2, FLASK_HEIGHT * PIXEL)
      // Neck right
      ctx.fillRect(neckRight * PIXEL - 2, startY, 2, NECK_HEIGHT * PIXEL)
      // Neck bottom (shoulder)
      ctx.fillRect(neckLeft, startY + NECK_HEIGHT * PIXEL, (FLASK_WIDTH - NECK_WIDTH) * PIXEL / 2, 2)
      ctx.fillRect(neckRight * PIXEL, startY + NECK_HEIGHT * PIXEL, (FLASK_WIDTH - NECK_WIDTH) * PIXEL / 2, 2)

      // Liquid
      liquid.level += (liquid.targetLevel - liquid.level) * 0.05
      liquid.wave += 0.08

      const liquidTop = startY + NECK_HEIGHT * PIXEL + (FLASK_HEIGHT - liquid.level) * PIXEL

      // Draw liquid with wave effect
      ctx.fillStyle = 'rgba(88, 166, 255, 0.4)'

      for (let x = 0; x < FLASK_WIDTH; x++) {
        const waveOffset = Math.sin(liquid.wave + x * 0.3) * 2
        const pixelX = (flaskLeft + x) * PIXEL + 2
        const pixelY = liquidTop + waveOffset
        const height = startY + (NECK_HEIGHT + FLASK_HEIGHT) * PIXEL - pixelY - 2

        if (height > 0) {
          ctx.fillRect(pixelX, pixelY, PIXEL, height)
        }
      }

      // Liquid glow
      ctx.fillStyle = 'rgba(88, 166, 255, 0.6)'
      for (let x = 2; x < FLASK_WIDTH - 2; x++) {
        const waveOffset = Math.sin(liquid.wave + x * 0.3) * 2
        const pixelX = (flaskLeft + x) * PIXEL + 2
        const pixelY = liquidTop + waveOffset + 2
        const height = Math.max(0, PIXEL * 3)

        ctx.fillRect(pixelX, pixelY, PIXEL, height)
      }

      // Update and draw bubbles
      const offsetX = flaskLeft * PIXEL + 2
      const offsetY = startY + NECK_HEIGHT * PIXEL

      spawnBubble()

      for (let i = bubbles.length - 1; i >= 0; i--) {
        if (!bubbles[i].update()) {
          bubbles.splice(i, 1)
        } else {
          bubbles[i].draw(ctx, offsetX, offsetY)
        }
      }

      // Flask glow effect
      ctx.shadowColor = '#58a6ff'
      ctx.shadowBlur = 16
      ctx.strokeStyle = '#58a6ff'
      ctx.lineWidth = 1
      ctx.strokeRect(
        flaskLeft * PIXEL,
        startY,
        FLASK_WIDTH * PIXEL,
        (NECK_HEIGHT + FLASK_HEIGHT) * PIXEL
      )
      ctx.shadowBlur = 0
    }

    function animate() {
      drawFlask()
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Interaction: click to add liquid
    function handleClick(e) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is inside flask
      const centerX = WIDTH / 2
      const startY = (HEIGHT - FLASK_HEIGHT * PIXEL - NECK_HEIGHT * PIXEL) / 2
      const flaskLeft = centerX - (FLASK_WIDTH * PIXEL) / 2
      const flaskRight = centerX + (FLASK_WIDTH * PIXEL) / 2
      const flaskTop = startY
      const flaskBottom = startY + (NECK_HEIGHT + FLASK_HEIGHT) * PIXEL

      if (x >= flaskLeft && x <= flaskRight && y >= flaskTop && y <= flaskBottom) {
        // Add liquid
        liquid.targetLevel = Math.min(FLASK_HEIGHT - 2, liquid.targetLevel + 3)

        // Spawn burst of bubbles
        for (let i = 0; i < 5; i++) {
          bubbles.push(new Bubble())
        }
      }
    }

    function handleMouseEnter() {
      liquid.targetLevel = Math.min(FLASK_HEIGHT - 2, liquid.level + 4)
    }

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="lab-flask-canvas"
      style={{
        width: '100%',
        height: 'auto',
        imageRendering: 'pixelated',
        cursor: 'pointer',
      }}
    />
  )
}
