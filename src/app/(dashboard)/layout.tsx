'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { db } from '@/lib/db'
import { openClawBridge } from '@/lib/openclaw'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/office',   label: 'Office'   },
  { href: '/tasks',    label: 'Tasks'    },
  { href: '/agents',   label: 'Agents'   },
  { href: '/content',  label: 'Content'  },
  { href: '/calendar', label: 'Calendar' },
  { href: '/projects', label: 'Projects' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/memory',   label: 'Memory'   },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const {
    setAgents, setTasks, setContent, setActivity,
    setPipeline, setMemory, setOpenClawOnline,
    addActivity, updateTask, updateAgent,
  } = useStore()

  // Load all data from Supabase on mount
  useEffect(() => {
    async function load() {
      const [ag, tk, co, ac, pi, me] = await Promise.all([
        db.agents.getAll(),
        db.tasks.getAll(),
        db.content.getAll(),
        db.activity.getRecent(),
        db.pipeline.getAll(),
        db.memory.getAll(),
      ])
      if (ag.data) setAgents(ag.data)
      if (tk.data) setTasks(tk.data)
      if (co.data) setContent(co.data)
      if (ac.data) setActivity(ac.data)
      if (pi.data) setPipeline(pi.data)
      if (me.data) setMemory(me.data)
    }
    load()
  }, [])

  // Supabase realtime — live updates from OpenClaw writing to DB
  useEffect(() => {
    const channel = db.agents.getAll().then(() => {
        return supabase.channel('mc-realtime')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' },
            (p: any) => addActivity(p.new))
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' },
            (p: any) => updateTask(p.new.id, p.new))
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agents' },
            (p: any) => updateAgent(p.new.id, p.new))
          .subscribe()
    });

    return () => { 
        channel.then(c => supabase.removeChannel(c)) 
    }
  }, [])

  // OpenClaw WebSocket bridge — connect and listen for status
  useEffect(() => {
    openClawBridge.connect()
    const unsub = openClawBridge.onMessage((msg) => {
      setOpenClawOnline(true)
      // Handle inbound messages from OpenClaw agents
      if (msg.type === 'message' && msg.text) {
        db.messages.send({
          direction: 'inbound',
          content: msg.text,
          channel: msg.channel,
        })
      }
    })
    return () => { unsub(); openClawBridge.disconnect() }
  }, [])

  const { openClawOnline } = useStore()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-jw-surface border-r border-jw-border flex flex-col">
        <div className="p-6 border-b border-jw-border">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-jw-purple" />
            <h1 className="font-medium">Mission Control</h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV.map(item => (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "block px-4 py-2 rounded-lg text-sm transition-colors",
                pathname === item.href 
                  ? "bg-jw-surf2 text-jw-text" 
                  : "text-jw-muted hover:bg-jw-surf2 hover:text-jw-text"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-jw-border space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", openClawOnline ? "bg-jw-green shadow-[0_0_8px_var(--jw-green)]" : "bg-jw-subtle")} />
              <span className="text-jw-muted">OpenClaw {openClawOnline ? 'online' : 'offline'}</span>
            </div>
          </div>
          <div className="text-[11px] text-jw-muted tracking-wide">jellybyte.fyi</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  )
}

// Minimal supabase import for the effect
import { supabase } from '@/lib/supabase'
