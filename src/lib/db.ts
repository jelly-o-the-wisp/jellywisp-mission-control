import { supabase } from './supabase'

export const db = {
  agents: {
    getAll: () =>
      supabase.from('agents').select('*').order('name'),
    updateStatus: (id: string, status: string, task?: string) =>
      supabase.from('agents')
        .update({ status, current_task: task ?? null, updated_at: new Date().toISOString() })
        .eq('id', id),
  },

  tasks: {
    getAll: () =>
      supabase.from('tasks')
        .select('*, agents(name, color, avatar)')
        .order('created_at', { ascending: false }),
    getByProject: (projectId: string) =>
      supabase.from('tasks')
        .select('*, agents(name, color, avatar)')
        .eq('project_id', projectId),
    create: (data: {
      title: string
      description?: string
      priority?: string
      agent_id?: string
      project_id?: string
      due_date?: string
    }) => supabase.from('tasks').insert(data).select().single(),
    updateStatus: (id: string, status: string) =>
      supabase.from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id),
    setResult: (id: string, result: string) =>
      supabase.from('tasks')
        .update({ result, status: 'done', updated_at: new Date().toISOString() })
        .eq('id', id),
    delete: (id: string) =>
      supabase.from('tasks').delete().eq('id', id),
  },

  content: {
    getAll: () =>
      supabase.from('content')
        .select('*, agents(name, color, avatar)')
        .order('created_at', { ascending: false }),
    create: (data: any) =>
      supabase.from('content').insert(data).select().single(),
    updateStatus: (id: string, status: string) =>
      supabase.from('content')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id),
    delete: (id: string) =>
      supabase.from('content').delete().eq('id', id),
  },

  projects: {
    getAll: () =>
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    create: (data: any) =>
      supabase.from('projects').insert(data).select().single(),
    updateStatus: (id: string, status: string) =>
      supabase.from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id),
  },

  messages: {
    getAll: (agentId?: string) => {
      const q = supabase.from('messages')
        .select('*, agents(name, color, avatar)')
        .order('created_at')
      return agentId ? q.eq('agent_id', agentId) : q
    },
    send: (data: {
      direction: 'outbound' | 'inbound'
      content: string
      agent_id?: string
      task_id?: string
      channel?: string
    }) => supabase.from('messages').insert(data).select().single(),
  },

  activity: {
    getRecent: (limit = 30) =>
      supabase.from('activity_log')
        .select('*, agents(name, color, avatar)')
        .order('created_at', { ascending: false })
        .limit(limit),
    log: (agentId: string, action: string, detail?: string, taskId?: string) =>
      supabase.from('activity_log')
        .insert({ agent_id: agentId, action, detail, task_id: taskId }),
  },

  memory: {
    getAll: () =>
      supabase.from('memory').select('*').order('updated_at', { ascending: false }),
    upsert: (key: string, value: string, category = 'general') =>
      supabase.from('memory')
        .upsert({ key, value, category, updated_at: new Date().toISOString() }),
    delete: (id: string) =>
      supabase.from('memory').delete().eq('id', id),
  },

  pipeline: {
    getAll: () =>
      supabase.from('pipeline')
        .select('*, agents(name, color, avatar)')
        .order('created_at', { ascending: false }),
    create: (data: any) =>
      supabase.from('pipeline').insert(data).select().single(),
    updateStatus: (id: string, status: string) =>
      supabase.from('pipeline')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id),
  },
}
