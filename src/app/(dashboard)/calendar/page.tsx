'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  ExternalLink
} from 'lucide-react'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns'

export default function CalendarPage() {
  const { tasks } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div className="flex flex-col h-full bg-jw-bg">
      <div className="flex items-center justify-between p-4 border-b border-jw-border bg-jw-surface">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-jw-purple/10 rounded-lg text-jw-purple">
            <CalendarIcon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-jw-text">{format(currentDate, 'MMMM yyyy')}</h2>
            <p className="text-[11px] text-jw-muted">NZDT Schedule View</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-jw-surf2 rounded-lg text-jw-muted transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-jw-surf2 rounded-lg text-jw-muted transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-jw-bg">
        <div className="grid grid-cols-7 border-b border-jw-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-jw-subtle border-r border-jw-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 h-full min-h-[600px]">
          {calendarDays.map((day, i) => {
            const dayTasks = tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), day))
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, monthStart)

            return (
              <div 
                key={day.toISOString()} 
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-jw-border transition-colors group relative",
                  !isCurrentMonth ? "bg-black/5 opacity-30" : "bg-jw-surface/5 hover:bg-jw-surf2/30",
                  i % 7 === 6 && "border-r-0"
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={cn(
                    "text-[11px] font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-jw-purple text-white shadow-lg shadow-jw-purple/40" : "text-jw-muted"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-jw-subtle">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1 scrollbar-hide">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="bg-jw-surf2/80 border border-jw-border rounded px-2 py-1.5 text-[10px] text-jw-text hover:border-jw-purple/50 cursor-pointer transition-all truncate group/item"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: task.agents?.color }} />
                        <span className="font-semibold uppercase tracking-tighter opacity-70">{task.agents?.name}</span>
                      </div>
                      <span className="leading-tight block truncate group-hover/item:text-jw-purple">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
