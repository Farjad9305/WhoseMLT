'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.length < 2 || password.length < 3) return setError('Name >2 chars, Pass >3 chars')
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: name, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create room')
      
      sessionStorage.setItem('playerId', data.playerId)
      sessionStorage.setItem('playerName', name)
      sessionStorage.setItem('roomId', data.room.id)
      
      router.push(`/room/${data.room.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setLoading(false)
    }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.length < 2 || roomId.length !== 8 || password.length < 3) return setError('Check inputs')
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roomId: roomId.toUpperCase(), password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to join room')
      
      sessionStorage.setItem('playerId', data.playerId)
      sessionStorage.setItem('playerName', name)
      sessionStorage.setItem('roomId', data.room.id)
      
      router.push(`/room/${data.room.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-[#0c0818] via-[#2a1154] to-[#0c0818] animate-gradient-shift relative overflow-hidden">
      
      {/* Floating Background Emojis */}
      <div className="absolute top-[10%] left-[10%] text-6xl animate-float pointer-events-none select-none">🤔</div>
      <div className="absolute top-[20%] right-[15%] text-7xl animate-float-delayed pointer-events-none select-none">🎯</div>
      <div className="absolute bottom-[20%] left-[20%] text-5xl animate-float-delayed pointer-events-none select-none">🤫</div>
      <div className="absolute bottom-[10%] right-[10%] text-6xl animate-float pointer-events-none select-none">😂</div>

      <div className="glass-panel p-8 w-full max-w-md z-10 mt-10">
        <h1 className="font-display font-bold text-4xl text-center mb-2 text-[#7B2FFF] glow-primary">WhoseMLT</h1>
        <p className="text-center text-[#b093ff] mb-8">The most likely to party game</p>
        
        <div className="flex mb-6 bg-black/40 p-1 rounded-xl">
          <button 
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'create' ? 'bg-[#7B2FFF] text-white shadow-lg' : 'text-[#b093ff]'}`}
            onClick={() => { setTab('create'); setError('') }}
          >
            Create Room
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'join' ? 'bg-[#FF2D8B] text-white shadow-lg' : 'text-[#b093ff]'}`}
            onClick={() => { setTab('join'); setError('') }}
          >
            Join Room
          </button>
        </div>

        {error && (
          <div className="bg-[#FF2D8B]/20 border border-[#FF2D8B] text-[#FF2D8B] p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#b093ff] mb-1">Display Name</label>
              <input type="text" required minLength={2} value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-[#b093ff]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7B2FFF] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#b093ff] mb-1">Room Password</label>
              <input type="password" required minLength={3} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-[#b093ff]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7B2FFF] transition-colors" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-3 rounded-xl font-bold bg-[#7B2FFF] text-white glow-primary hover:bg-[#b093ff] transition-all mt-4">
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#b093ff] mb-1">Display Name</label>
              <input type="text" required minLength={2} value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-[#b093ff]/30 rounded-xl px-4 py-3 outline-none focus:border-[#FF2D8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#b093ff] mb-1">Room ID</label>
              <input type="text" required maxLength={8} value={roomId} onChange={e => setRoomId(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-[#b093ff]/30 rounded-xl px-4 py-3 outline-none focus:border-[#FF2D8B] transition-colors font-mono tracking-widest text-center uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#b093ff] mb-1">Room Password</label>
              <input type="password" required minLength={3} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-[#b093ff]/30 rounded-xl px-4 py-3 outline-none focus:border-[#FF2D8B] transition-colors" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-3 rounded-xl font-bold bg-[#FF2D8B] text-white glow-accent hover:bg-pink-400 transition-all mt-4">
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </form>
        )}
      </div>

      {/* How to Play Card */}
      <div className="glass-panel p-6 w-full max-w-md z-10 mt-8 mb-10">
        <h2 className="font-bold text-xl text-[#FF2D8B] mb-4 flex items-center gap-2">
          <span>📖</span> How to Play
        </h2>
        <ol className="space-y-4 text-sm text-[#f0ebff] list-decimal list-inside">
          <li><strong className="text-white">Create or Join:</strong> One person creates a room and shares the 8-character code with friends.</li>
          <li><strong className="text-white">The Prompt:</strong> Every round, a "Most likely to..." question appears (e.g., "Most likely to survive a zombie apocalypse?").</li>
          <li><strong className="text-white">Vote:</strong> Vote for the friend who fits the prompt best before the timer runs out!</li>
          <li><strong className="text-white">Results:</strong> See who got the most votes at the end of the game and discover what your friends really think of you.</li>
        </ol>
      </div>
    </div>
  )
}
