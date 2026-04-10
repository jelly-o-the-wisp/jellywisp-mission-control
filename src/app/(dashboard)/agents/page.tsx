'use client'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
  Users, 
  MessageSquare, 
  Zap, 
  Settings, 
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react'

export default function AgentsPage() {
  const { agents } = useStore()

  return (
    <div className="flex flex-col h-full bg-jw-bg">
      <div className="flex items-center justify-between p-4 border-b border-jw-border bg-jw-surface">
        <div>
          <h2 className="text-sm font-medium text-jw-text">Agents</h2>
          <p className="text-[11px] text-jw-muted">{agents.length} specialized entities</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {agents.map(agent => (
            <div key={agent.id} className="jw-card relative overflow-hidden group hover:border-jw-border2 transition-all cursor-pointer">
              {/* Status Indicator Bar */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1",
                agent.status === 'active' ? 'bg-jw-green' : agent.status === 'busy' ? 'bg-jw-amber' : 'bg-jw-subtle'
              )} />

              <div className="p-5 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg" 
                      style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)` }}
                    >
                      {agent.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-jw-text group-hover:text-jw-purple transition-colors">{agent.name}</h3>
                      <p className="text-[11px] text-jw-muted font-medium uppercase tracking-wider">{agent.role}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight",
                    agent.status === 'active' ? 'text-jw-green bg-jw-green/10' : agent.status === 'busy' ? 'text-jw-amber bg-jw-amber/10' : 'text-jw-muted bg-jw-surf2'
                  )}>
                    {agent.status}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/20 rounded-xl p-3 border border-jw-border">
                    <p className="text-[10px] text-jw-subtle uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Zap size={10} />
                      Current Mission
                    </p>
                    <p className="text-[13px] text-jw-text leading-relaxed italic">
                      "{agent.current_task || 'Observing the horizon...'}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-jw-surf2/50 rounded-lg p-2 border border-jw-border/50 text-center">
                      <p className="text-[9px] text-jw-muted uppercase tracking-tighter mb-1">Intelligence</p>
                      <p className="text-xs font-semibold text-jw-text">Claude 4.6</p>
                    </div>
                    <div className="bg-jw-surf2/50 rounded-lg p-2 border border-jw-border/50 text-center">
                      <p className="text-[9px] text-jw-muted uppercase tracking-tighter mb-1">Surface</p>
                      <p className="text-xs font-semibold text-jw-text capitalize">{agent.channel || 'Internal'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-jw-border flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <button className="p-2 rounded-lg bg-jw-surf2 text-jw-muted hover:text-jw-text hover:bg-jw-border transition-all">
                      <MessageSquare size={14} />
                    </button>
                    <button className="p-2 rounded-lg bg-jw-surf2 text-jw-muted hover:text-jw-text hover:bg-jw-border transition-all">
                      <Activity size={14} />
                    </button>
                  </div>
                  <button className="jw-btn text-[11px] font-semibold">
                    Inspect agent
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
