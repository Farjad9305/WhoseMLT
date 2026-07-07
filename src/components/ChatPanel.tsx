import { useState, useRef, useEffect } from 'react'
import { ChatMessageData } from '@/lib/types'

export default function ChatPanel({ 
  roomId,
  messages, 
  typingUsers, 
  onSend, 
  playerName 
}: { 
  roomId: string, 
  messages: ChatMessageData[], 
  typingUsers: string[], 
  onSend: (text: string) => void, 
  playerName: string 
}) {
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastTypingTime = useRef<number>(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typingUsers])

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    const now = Date.now()
    if (now - lastTypingTime.current > 1000 && e.target.value.trim().length > 0) {
      lastTypingTime.current = now
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, name: playerName })
      }).catch(console.error)
    }
  }

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
          <div key={i} className={`text-sm ${m.isSystem ? 'text-center italic text-[#FFEA00]' : 'break-words'}`}>
            {!m.isSystem && <span className="font-bold text-[#FF2D8B] mr-2">{m.name}:</span>}
            <span className={m.isSystem ? 'opacity-80' : 'text-[#FFFFFF]'}>{m.text}</span>
          </div>
        ))}
        {typingUsers.filter(u => u !== playerName).length > 0 && (
          <div className="text-xs italic text-[#F0EBFF] opacity-80 animate-pulse">
            {typingUsers.filter(u => u !== playerName).join(', ')} {typingUsers.filter(u => u !== playerName).length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          maxLength={200}
          placeholder="Type a message..."
          className="flex-1 min-w-0 bg-[#2B2D42] border border-[#F0EBFF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#FF2D8B] transition-colors"
        />
        <button type="submit" disabled={!text.trim()} className="glass-button shrink-0 px-4 py-2 font-bold text-sm">
          Send
        </button>
      </form>
    </div>
  )
}
