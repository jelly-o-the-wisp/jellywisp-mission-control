import { create } from 'zustand'
import type {
  Agent, Task, ContentItem, Message,
  ActivityItem, PipelineItem, MemoryItem, AgentPosition
} from '@/types'

interface Store {
  agents:    Agent[]
  tasks:     Task[]
  content:   ContentItem[]
  messages:  Message[]
  activity:  ActivityItem[]
  pipeline:  PipelineItem[]
  memory:    MemoryItem[]

  selectedAgentId: string | null
  chatOpen:        boolean
  chatAgentId:     string | null
  paused:          boolean
  openClawOnline:  boolean
  agentPositions:  Record<string, AgentPosition>

  setAgents:    (v: Agent[]) => void
  setTasks:     (v: Task[]) => void
  setContent:   (v: ContentItem[]) => void
  setMessages:  (v: Message[]) => void
  setActivity:  (v: ActivityItem[]) => void
  setPipeline:  (v: PipelineItem[]) => void
  setMemory:    (v: MemoryItem[]) => void

  addMessage:   (v: Message) => void
  addActivity:  (v: ActivityItem) => void
  updateTask:   (id: string, patch: Partial<Task>) => void
  updateAgent:  (id: string, patch: Partial<Agent>) => void

  setSelectedAgent:  (id: string | null) => void
  setChatOpen:       (open: boolean, agentId?: string) => void
  setPaused:         (v: boolean) => void
  setOpenClawOnline: (v: boolean) => void
  updatePosition:    (id: string, pos: Partial<AgentPosition>) => void
}

export const useStore = create<Store>((set) => ({
  agents: [], tasks: [], content: [], messages: [],
  activity: [], pipeline: [], memory: [],

  selectedAgentId: null,
  chatOpen: false, chatAgentId: null,
  paused: false, openClawOnline: false,
  agentPositions: {},

  setAgents:   (agents)   => set({ agents }),
  setTasks:    (tasks)    => set({ tasks }),
  setContent:  (content)  => set({ content }),
  setMessages: (messages) => set({ messages }),
  setActivity: (activity) => set({ activity }),
  setPipeline: (pipeline) => set({ pipeline }),
  setMemory:   (memory)   => set({ memory }),

  addMessage:  (msg)  => set(s => ({ messages: [...s.messages, msg] })),
  addActivity: (item) => set(s => ({ activity: [item, ...s.activity].slice(0, 50) })),

  updateTask: (id, patch) =>
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch } : t) })),
  updateAgent: (id, patch) =>
    set(s => ({ agents: s.agents.map(a => a.id === id ? { ...a, ...patch } : a) })),

  setSelectedAgent:  (id)       => set({ selectedAgentId: id }),
  setChatOpen:       (open, id) => set({ chatOpen: open, chatAgentId: id ?? null }),
  setPaused:         (paused)   => set({ paused }),
  setOpenClawOnline: (v)        => set({ openClawOnline: v }),
  updatePosition:    (id, pos)  =>
    set(s => ({
      agentPositions: {
        ...s.agentPositions,
        [id]: { ...s.agentPositions[id], ...pos }
      }
    })),
}))
