import { useState, useRef, useEffect } from 'react'
import { ChatMessageData } from '@/lib/types'

export default function ChatPanel({ messages, onSend }: { messages: ChatMessageData[], onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSend(text)
      setText('')
    }
  }

  return (
    <div className="flex flex-col h-full glass-panel p-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 space-y-3" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`text-sm ${m.isSystem ? 'text-center italic text-[#FFB830]' : 'break-words'}`}>
            {!m.isSystem && <span className="font-bold text-[#7B2FFF] mr-2">{m.name}:</span>}
            <span className={m.isSystem ? 'opacity-80' : 'text-[#f0ebff]'}>{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={200}
          placeholder="Type a message..."
          className="flex-1 bg-[#0c0818] border border-[#b093ff]/30 rounded-lg px-3 py-2 outline-none focus:border-[#7B2FFF] transition-colors"
        />
        <button type="submit" disabled={!text.trim()} className="glass-button px-4 py-2 font-bold text-sm">
          Send
        </button>
      </form>
    </div>
  )
}
