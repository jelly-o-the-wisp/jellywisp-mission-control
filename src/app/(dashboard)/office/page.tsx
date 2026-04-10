'use client'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const TILE = 28
const ROOMS = [
  { label: 'dev zone', x: 0.05, y: 0.05, w: 0.38, h: 0.40 },
  { label: 'content studio', x: 0.55, y: 0.05, w: 0.40, h: 0.40 },
  { label: 'ops hub', x: 0.05, y: 0.58, w: 0.55, h: 0.36 },
  { label: 'lounge', x: 0.72, y: 0.58, w: 0.23, h: 0.36 },
]

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { agents, activity, paused, setPaused, updatePosition } = useStore()
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [selId, setSelId] = useState<string | null>(null)
  const frameRef = useRef(0)

  // Initialize positions
  useEffect(() => {
    agents.forEach(agent => {
      if (!useStore.getState().agentPositions[agent.id]) {
        const sx = 80 + Math.random() * 400
        const sy = 80 + Math.random() * 400
        updatePosition(agent.id, {
          x: sx, y: sy, tx: sx, ty: sy,
          bobOffset: Math.random() * Math.PI * 2,
          moveTimer: Math.floor(Math.random() * 120),
          speech: null, speechTimer: 0
        })
      }
    })
  }, [agents])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const pct = (v: number, base: number) => Math.round(v * base)
    const roomPx = (r: typeof ROOMS[0]) => ({
      x: pct(r.x, canvas.width), y: pct(r.y, canvas.height),
      w: pct(r.w, canvas.width), h: pct(r.h, canvas.height)
    })

    const loop = () => {
      if (!paused) frameRef.current++
      const frame = frameRef.current
      const W = canvas.width
      const H = canvas.height
      const { agentPositions } = useStore.getState()

      ctx.clearRect(0, 0, W, H)

      // Floor
      for (let r = 0; r < Math.ceil(H / TILE); r++) {
        for (let c = 0; c < Math.ceil(W / TILE); c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(120,120,120,0.04)' : 'rgba(120,120,120,0.02)'
          ctx.fillRect(c * TILE, r * TILE, TILE, TILE)
        }
      }

      // Rooms
      ROOMS.forEach(r => {
        const p = roomPx(r)
        ctx.strokeStyle = 'rgba(155,127,232,0.1)'
        ctx.strokeRect(p.x, p.y, p.w, p.h)
        ctx.fillStyle = 'rgba(155,127,232,0.02)'
        ctx.fillRect(p.x, p.y, p.w, p.h)
        ctx.fillStyle = 'rgba(155,127,232,0.3)'
        ctx.font = '10px sans-serif'
        ctx.fillText(r.label, p.x + 8, p.y + 14)
      })

      // Agents
      agents.forEach(agent => {
        const pos = agentPositions[agent.id]
        if (!pos) return

        if (!paused) {
          let { x, y, tx, ty, moveTimer, speechTimer } = pos
          moveTimer--
          if (moveTimer <= 0) {
            const room = ROOMS[Math.floor(Math.random() * ROOMS.length)]
            const p = roomPx(room)
            tx = p.x + 20 + Math.random() * (p.w - 40)
            ty = p.y + 20 + Math.random() * (p.h - 40)
            moveTimer = 120 + Math.floor(Math.random() * 200)
          }

          const dx = tx - x
          const dy = ty - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 1) {
            x += dx / dist * (agent.status === 'idle' ? 0.4 : 0.8)
            y += dy / dist * (agent.status === 'idle' ? 0.4 : 0.8)
          }

          updatePosition(agent.id, { x, y, tx, ty, moveTimer })
        }

        const bob = Math.sin(frame * 0.05 + pos.bobOffset) * 2
        const ax = pos.x
        const ay = pos.y + bob
        const r = 12

        // Glow
        if (agent.status !== 'idle') {
          ctx.beginPath()
          ctx.arc(ax, ay, r + 5 + Math.sin(frame * 0.04) * 2, 0, Math.PI * 2)
          ctx.fillStyle = agent.color + '15'
          ctx.fill()
        }

        // Body
        ctx.beginPath()
        ctx.arc(ax, ay, r, 0, Math.PI * 2)
        ctx.fillStyle = agent.color
        ctx.fill()

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        const tw = ctx.measureText(agent.name).width + 8
        ctx.fillRect(ax - tw / 2, ay + r + 4, tw, 14)
        ctx.fillStyle = agent.color
        ctx.fillText(agent.name, ax, ay + r + 14)
      })

      requestAnimationFrame(loop)
    }
    const animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [agents, paused])

  return (
    <div className="flex flex-col h-full bg-jw-bg">
      <div className="flex items-center justify-between p-4 border-b border-jw-border bg-jw-surface">
        <div>
          <h2 className="text-sm font-medium">Office</h2>
          <p className="text-[11px] text-jw-muted">{agents.filter(a => a.status !== 'idle').length} agents active</p>
        </div>
        <div className="flex gap-2">
          <button className="jw-btn" onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</button>
          <button className="jw-btn jw-btn-primary">Chat Jellywisp</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-black/20">
          <canvas ref={canvasRef} className="block w-full h-full" />
        </div>

        <aside className="w-64 border-l border-jw-border bg-jw-surface flex flex-col">
          <div className="p-4 border-b border-jw-border text-[11px] font-medium uppercase tracking-wider text-jw-muted">
            Agents
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-jw-surf2 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: agent.color }}>
                  {agent.avatar}
                </div>
                <div className="min-width-0">
                  <div className="text-sm font-medium truncate">{agent.name}</div>
                  <div className="text-[10px] text-jw-muted truncate">{agent.current_task || agent.role}</div>
                </div>
                <div className={cn("ml-auto w-1.5 h-1.5 rounded-full", agent.status === 'active' ? 'bg-jw-green' : agent.status === 'busy' ? 'bg-jw-amber' : 'bg-jw-subtle')} />
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-jw-border">
            <div className="text-[10px] font-medium uppercase tracking-wider text-jw-muted mb-3">Live Feed</div>
            <div className="space-y-3">
              {activity.slice(0, 5).map(item => (
                <div key={item.id} className="text-[11px] leading-relaxed">
                  <span className="font-medium text-jw-text">{item.agents?.name}</span>
                  <span className="text-jw-muted"> {item.action}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="p-4 bg-jw-surface border-t border-jw-border flex gap-3">
        <input className="flex-1 jw-input" placeholder="Ask Jellywisp..." />
        <button className="jw-btn jw-btn-primary px-6">Send</button>
      </div>
    </div>
  )
}
