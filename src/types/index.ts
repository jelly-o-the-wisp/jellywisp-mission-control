export type AgentStatus = 'idle' | 'active' | 'busy' | 'error'
export type TaskStatus  = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ContentType   = 'blog' | 'social' | 'email' | 'copy'
export type ContentStatus = 'draft' | 'review' | 'ready' | 'live'
export type PipelineStatus = 'lead' | 'qualified' | 'proposal' | 'active' | 'complete'

export interface Agent {
  id: string
  name: string
  role: string
  color: string
  avatar: string
  status: AgentStatus
  current_task: string | null
  channel: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  agent_id: string | null
  project_id: string | null
  due_date: string | null
  openclaw_msg_id: string | null
  result: string | null
  created_at: string
  updated_at: string
  agents?: Pick<Agent, 'name' | 'color' | 'avatar'>
}

export interface ContentItem {
  id: string
  title: string
  body: string | null
  type: ContentType
  status: ContentStatus
  channel: string | null
  agent_id: string | null
  word_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  agents?: Pick<Agent, 'name' | 'color' | 'avatar'>
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: string
  client: string | null
  budget: number | null
  due_date: string | null
  created_at: string
}

export interface Message {
  id: string
  direction: 'outbound' | 'inbound'
  content: string
  agent_id: string | null
  task_id: string | null
  channel: string | null
  created_at: string
  agents?: Pick<Agent, 'name' | 'color' | 'avatar'>
}

export interface ActivityItem {
  id: string
  agent_id: string | null
  action: string
  detail: string | null
  task_id: string | null
  created_at: string
  agents?: Pick<Agent, 'name' | 'color' | 'avatar'>
}

export interface PipelineItem {
  id: string
  name: string
  status: PipelineStatus
  budget: number | null
  notes: string | null
  agent_id: string | null
  created_at: string
  updated_at: string
  agents?: Pick<Agent, 'name' | 'color' | 'avatar'>
}

export interface MemoryItem {
  id: string
  key: string
  value: string
  category: string
  created_at: string
  updated_at: string
}

export interface AgentPosition {
  x: number; y: number
  tx: number; ty: number
  bobOffset: number
  moveTimer: number
  speech: string | null
  speechTimer: number
}
