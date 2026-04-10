import { openClawBridge } from './openclaw'
import { db } from './db'

export async function sendTaskToAgent({
  title,
  description,
  agentId,
  agentName,
  channel = 'discord',
  priority = 'medium',
  projectId,
  dueDate,
}: {
  title: string
  description?: string
  agentId: string
  agentName: string
  channel?: string
  priority?: string
  projectId?: string
  dueDate?: string
}) {
  // 1. Save task to Supabase
  const { data: task, error } = await db.tasks.create({
    title,
    description,
    priority,
    agent_id: agentId,
    project_id: projectId,
    due_date: dueDate,
  })
  if (error || !task) throw new Error('Failed to create task')

  // 2. Build message text for OpenClaw
  const messageText = description
    ? `${title}\n\n${description}`
    : title

  // 3. Save outbound message log to Supabase
  await db.messages.send({
    direction: 'outbound',
    content: messageText,
    agent_id: agentId,
    task_id: task.id,
    channel,
  })

  // 4. Send to OpenClaw WebSocket gateway
  // OpenClaw will route this to the right agent based on the agent name
  const sent = openClawBridge.send({
    type: 'message',
    channel,
    agent: agentName,
    text: messageText,
    taskId: task.id,
  })

  // 5. Log activity
  await db.activity.log(agentId, 'Task assigned', title, task.id)

  // 6. Update agent status
  await db.agents.updateStatus(agentId, 'busy', title)

  return { task, sent }
}
