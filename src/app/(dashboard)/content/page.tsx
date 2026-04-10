'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Search, Filter, Plus, FileText, Share2, Mail, Layout, CheckCircle, ExternalLink } from 'lucide-react'
import { ContentType, ContentStatus } from '@/types'

const TYPE_ICONS: Record<ContentType, any> = {
  blog: FileText,
  social: Share2,
  email: Mail,
  copy: Layout,
}

const TYPE_COLORS: Record<ContentType, string> = {
  blog: 'bg-jw-blue/10 text-jw-blue',
  social: 'bg-jw-pink/10 text-jw-pink',
  email: 'bg-jw-amber/10 text-jw-amber',
  copy: 'bg-jw-purple/10 text-jw-purple',
}

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: 'bg-jw-surf2 text-jw-muted',
  review: 'bg-jw-orange/10 text-jw-orange',
  ready: 'bg-jw-green/10 text-jw-green',
  live: 'bg-jw-blue/10 text-jw-blue',
}

export default function ContentPage() {
  const { content } = useStore()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = content.filter(item => {
    const matchFilter = filter === 'all' || item.type === filter || item.status === filter
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="flex flex-col h-full bg-jw-bg">
      <div className="flex items-center justify-between p-4 border-b border-jw-border bg-jw-surface">
        <div>
          <h2 className="text-sm font-medium text-jw-text">Content</h2>
          <p className="text-[11px] text-jw-muted">{content.length} items in pipeline</p>
        </div>
        <button className="jw-btn jw-btn-primary flex items-center gap-2">
          <Plus size={14} />
          Request Content
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-jw-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-jw-surface/50">
        <div className="flex items-center gap-2 bg-jw-surf2 border border-jw-border rounded-lg px-3 py-1.5 w-full sm:w-80">
          <Search size={14} className="text-jw-muted" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..." 
            className="bg-transparent border-none outline-none text-[13px] text-jw-text w-full placeholder:text-jw-subtle"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['all', 'blog', 'social', 'email', 'copy'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all",
                filter === t ? "bg-jw-purple text-white shadow-lg shadow-jw-purple/20" : "bg-jw-surf2 text-jw-muted hover:text-jw-text"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filtered.map(item => {
            const Icon = TYPE_ICONS[item.type]
            return (
              <div key={item.id} className="jw-card flex flex-col p-4 space-y-4 hover:border-jw-border2 transition-all cursor-pointer group hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2 rounded-lg", TYPE_COLORS[item.type])}>
                    <Icon size={16} />
                  </div>
                  <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", STATUS_COLORS[item.status])}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-[14px] font-semibold text-jw-text group-hover:text-jw-purple transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-jw-muted">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-bold text-white" style={{ background: item.agents?.color }}>
                      {item.agents?.avatar}
                    </div>
                    <span>{item.agents?.name}</span>
                    <span>•</span>
                    <span>{item.word_count} words</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-jw-border flex items-center justify-between">
                  <span className="text-[10px] text-jw-subtle">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Draft'}
                  </span>
                  <button className="text-jw-muted hover:text-jw-purple transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 opacity-50">
            <div className="w-12 h-12 rounded-2xl bg-jw-surf2 flex items-center justify-center">
              <FileText size={24} className="text-jw-subtle" />
            </div>
            <div>
              <p className="text-sm font-medium text-jw-text">Nothing found</p>
              <p className="text-xs text-jw-muted">Try adjusting your filters or search ✨</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
