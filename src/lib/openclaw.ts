type OpenClawMessage = {
  type: string
  channel?: string
  agent?: string
  text: string
  taskId?: string
}

type MessageHandler = (msg: any) => void

class OpenClawBridge {
  private ws: WebSocket | null = null
  private handlers: MessageHandler[] = []
  private reconnectTimer: any = null
  private url: string
  public connected = false

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (typeof window === 'undefined') return
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.connected = true
        console.log('[OpenClaw] Connected to gateway')
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer)
          this.reconnectTimer = null
        }
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handlers.forEach(h => h(data))
        } catch {}
      }

      this.ws.onclose = () => {
        this.connected = false
        console.log('[OpenClaw] Disconnected — retrying in 5s')
        this.reconnectTimer = setTimeout(() => this.connect(), 5000)
      }

      this.ws.onerror = () => {
        this.connected = false
      }
    } catch (e) {
      console.warn('[OpenClaw] Could not connect to gateway. Is OpenClaw running?')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
  }

  send(msg: OpenClawMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[OpenClaw] Not connected — message queued in Supabase only')
      return false
    }
    this.ws.send(JSON.stringify(msg))
    return true
  }

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler)
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler)
    }
  }
}

export const openClawBridge = new OpenClawBridge(
  process.env.NEXT_PUBLIC_OPENCLAW_WS || 'ws://127.0.0.1:18789'
)
