'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { db } from '@/lib/db'
import { Task, TaskStatus, TaskPriority } from '@/types'
import { cn } from '@/lib/utils'
import { Plus, Clock, AlertCircle, CheckCircle2, MoreVertical } from 'lucide-react'

const LANES: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-500/10 text-slate-400',
  medium: 'bg-jw-blue/10 text-jw-blue',
  high: 'bg-jw-orange/10 text-jw-orange',
  urgent: 'bg-jw-pink/10 text-jw-pink',
}

export default function TasksPage() {
  const { tasks, agents } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col h-full bg-jw-bg">
      <div className="flex items-center justify-between p-4 border-b border-jw-border bg-jw-surface">
        <div>
          <h2 className="text-sm font-medium text-jw-text">Tasks</h2>
          <p className="text-[11px] text-jw-muted">{tasks.length} total tasks</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="jw-btn jw-btn-primary flex items-center gap-2"
        >
          <Plus size={14} />
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {LANES.map(lane => (
            <div key={lane.id} className="w-72 flex flex-col gap-3">
              <div className="flex items-center justify-between px-2 text-[11px] font-medium uppercase tracking-wider text-jw-muted">
                <span>{lane.label}</span>
                <span className="bg-jw-surf2 px-1.5 py-0.5 rounded text-[10px]">{tasks.filter(t => t.status === lane.id).length}</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 pb-4">
                {tasks.filter(t => t.status === lane.id).map(task => (
                  <div key={task.id} className="jw-card p-3 space-y-3 hover:border-jw-border2 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] font-medium leading-tight text-jw-text group-hover:text-jw-purple transition-colors line-clamp-2">{task.title}</h3>
                      <button className="text-jw-muted hover:text-jw-text shrink-0">
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-jw-muted line-clamp-2 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white shrink-0" 
                          style={{ background: task.agents?.color || 'var(--jw-subtle)' }}
                        >
                          {task.agents?.avatar || '?'}
                        </div>
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-tighter", PRIORITY_COLORS[task.priority])}>
                          {task.priority}
                        </span>
                      </div>
                      
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-[10px] text-jw-muted">
                          <Clock size={10} />
                          <span>{new Date(task.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {tasks.filter(t => t.status === lane.id).length === 0 && (
                  <div className="h-24 border border-dashed border-jw-border rounded-xl flex flex-col items-center justify-center text-center p-4">
                    <p className="text-[10px] text-jw-subtle italic">No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
