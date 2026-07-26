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
    <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden bg-transparent">
      
      {/* Floating Background Emojis */}
      <div className="absolute top-[5%] left-[10%] text-6xl animate-float opacity-80 pointer-events-none select-none">🤔</div>
      <div className="absolute top-[15%] right-[12%] text-7xl animate-float-delayed opacity-90 pointer-events-none select-none">🎯</div>
      <div className="absolute top-[35%] left-[5%] text-5xl animate-float opacity-60 pointer-events-none select-none">👀</div>
      <div className="absolute top-[40%] right-[8%] text-6xl animate-float-delayed opacity-70 pointer-events-none select-none">🔥</div>
      <div className="absolute top-[60%] left-[15%] text-7xl animate-float opacity-80 pointer-events-none select-none">💀</div>
      <div className="absolute top-[65%] right-[18%] text-5xl animate-float-delayed opacity-90 pointer-events-none select-none">🤡</div>
      <div className="absolute bottom-[20%] left-[8%] text-5xl animate-float-delayed opacity-70 pointer-events-none select-none">🤫</div>
      <div className="absolute bottom-[25%] right-[5%] text-6xl animate-float opacity-60 pointer-events-none select-none">🍻</div>
      <div className="absolute bottom-[5%] left-[25%] text-4xl animate-float opacity-50 pointer-events-none select-none">😈</div>
      <div className="absolute bottom-[8%] right-[20%] text-6xl animate-float-delayed opacity-80 pointer-events-none select-none">😂</div>

      <div className="glass-panel p-8 w-full max-w-md z-10 mt-10">
        <h1 className="font-display font-bold text-4xl text-center mb-2 text-[#FF2D8B] glow-primary">WhoseMLT</h1>
        <p className="text-center text-[#F0EBFF] mb-8">The most likely to party game</p>
        
        <div className="flex mb-6 bg-black/40 p-1 rounded-xl">
          <button 
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'create' ? 'bg-[#FF2D8B] text-white shadow-lg' : 'text-[#F0EBFF]'}`}
            onClick={() => { setTab('create'); setError('') }}
          >
            Create Room
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'join' ? 'bg-[#7B2FFF] text-white shadow-lg' : 'text-[#F0EBFF]'}`}
            onClick={() => { setTab('join'); setError('') }}
          >
            Join Room
          </button>
        </div>

        {error && (
          <div className="bg-[#7B2FFF]/20 border border-[#7B2FFF] text-[#7B2FFF] p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#F0EBFF] mb-1">Display Name</label>
              <input type="text" required minLength={2} maxLength={15} placeholder='e.g. "Alex"' value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-[#F0EBFF]/30 rounded-xl px-4 py-3 outline-none focus:border-[#FF2D8B] transition-colors placeholder:text-white/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#F0EBFF] mb-1">Room Password</label>
              <input type="password" required minLength={3} maxLength={20} placeholder='e.g. "1234"' value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-[#F0EBFF]/30 rounded-xl px-4 py-3 outline-none focus:border-[#FF2D8B] transition-colors placeholder:text-white/30" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-3 rounded-xl font-bold bg-[#FF2D8B] text-white glow-primary hover:bg-[#F0EBFF] transition-all mt-4">
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#F0EBFF] mb-1">Display Name</label>
              <input type="text" required minLength={2} maxLength={15} placeholder='e.g. "Alex"' value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-[#F0EBFF]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7B2FFF] transition-colors placeholder:text-white/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#F0EBFF] mb-1">Room ID</label>
              <input type="text" required maxLength={8} placeholder='e.g. "A1B2C3D4"' value={roomId} onChange={e => setRoomId(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-[#F0EBFF]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7B2FFF] transition-colors font-mono tracking-widest text-center uppercase placeholder:text-white/30 placeholder:tracking-normal placeholder:font-sans" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#F0EBFF] mb-1">Room Password</label>
              <input type="password" required minLength={3} maxLength={20} placeholder='e.g. "1234"' value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-[#F0EBFF]/30 rounded-xl px-4 py-3 outline-none focus:border-[#7B2FFF] transition-colors placeholder:text-white/30" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-3 rounded-xl font-bold bg-[#7B2FFF] text-white glow-accent hover:bg-pink-400 transition-all mt-4">
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </form>
        )}
      </div>

      {/* Guide Card (How to Play & Game Settings) */}
      <GuideCard />
    </div>
  )
}

function GuideCard() {
  const [guideTab, setGuideTab] = useState<'rules' | 'settings'>('rules')

  return (
    <div className="glass-panel p-6 w-full max-w-md z-10 mt-8 mb-10">
      <div className="flex mb-4 bg-black/40 p-1 rounded-xl">
        <button
          className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${guideTab === 'rules' ? 'bg-[#7B2FFF] text-white shadow-lg' : 'text-[#F0EBFF]/70 hover:text-white'}`}
          onClick={() => setGuideTab('rules')}
        >
          🎮 How to Play
        </button>
        <button
          className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${guideTab === 'settings' ? 'bg-[#FF2D8B] text-white shadow-lg' : 'text-[#F0EBFF]/70 hover:text-white'}`}
          onClick={() => setGuideTab('settings')}
        >
          ⚙️ Game Settings Guide
        </button>
      </div>

      {guideTab === 'rules' ? (
        <ol className="space-y-4 text-sm text-[#FFFFFF] list-decimal list-inside">
          <li><strong className="text-white">Create or Join:</strong> One person creates a room and shares the 8-character code with friends.</li>
          <li><strong className="text-white">The Prompt:</strong> Every round, a "Most likely to..." question appears (e.g., "Most likely to survive a zombie apocalypse?").</li>
          <li><strong className="text-white">Vote:</strong> Vote for the friend who fits the prompt best before the timer runs out!</li>
          <li><strong className="text-white">Results:</strong> See who got the most votes at the end of the game and discover what your friends really think of you.</li>
        </ol>
      ) : (
        <ul className="space-y-3 text-xs text-[#FFFFFF] max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          <li><strong className="text-[#FF2D8B]">⏱️ Voting Time:</strong> Adjust how many seconds players have to cast their vote each round.</li>
          <li><strong className="text-[#FF2D8B]">🔢 No. of Rounds:</strong> Set the total number of questions per game (5, 10, 15, or 20).</li>
          <li><strong className="text-[#FF2D8B]">🗳️ Multiple Votes:</strong> Allow players to vote for more than one person in a single round.</li>
          <li><strong className="text-[#FF2D8B]">📚 Question Sets:</strong> Choose up to 2 themed sets of questions (Classic, Chaos, Awkward, Polarizing, Dirty).</li>
          <li><strong className="text-[#FF2D8B]">⚖️ Equal Distribution:</strong> Toggle whether questions are split equally between selected sets or customized via slider.</li>
          <li><strong className="text-[#FF2D8B]">✍️ Allow Custom Questions:</strong> Let players submit their own spicy prompts into the game pool.</li>
          <li><strong className="text-[#FF2D8B]">🎯 Use Only Custom Questions:</strong> Play exclusively using custom prompts submitted by your friends in the lobby.</li>
          <li><strong className="text-[#FF2D8B]">🔒 Privacy:</strong> Custom questions are anonymous during gameplay—no one else can see who added which prompt!</li>
        </ul>
      )}
    </div>
  )
}
