import { useState, useEffect } from 'react'
import { RoomSettings, Question } from '@/lib/types'
import Toggle from './ui/Toggle'
import Chip from './ui/Chip'

const BUILT_IN_SETS = ['Classic', 'Chaos', 'Deep Cuts', 'Awkward']

export default function LobbyPanel({ 
  roomId, 
  settings, 
  isHost, 
  customQTotal,
  onUpdateSettings, 
  onStartGame,
  canStart
}: { 
  roomId: string, 
  settings: RoomSettings, 
  isHost: boolean, 
  customQTotal: number,
  onUpdateSettings: (s: Partial<RoomSettings>) => void,
  onStartGame: () => void,
  canStart: boolean
}) {
  const [customQ, setCustomQ] = useState('')
  const [myCustomQs, setMyCustomQs] = useState<Question[]>([])

  const fetchMyQs = async () => {
    const pid = sessionStorage.getItem('playerId')
    if (!pid) return
    const res = await fetch(`/api/questions?roomId=${roomId}&ownerId=${pid}`)
    if (res.ok) {
      const data = await res.json()
      setMyCustomQs(data.questions)
    }
  }

  useEffect(() => {
    if (settings.allow_custom) fetchMyQs()
  }, [settings.allow_custom, roomId])

  const handleAddQ = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customQ.trim()) return
    const pid = sessionStorage.getItem('playerId')
    if (!pid) return
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ roomId, ownerId: pid, text: customQ })
    })
    if (res.ok) {
      setCustomQ('')
      fetchMyQs()
    }
  }

  const handleDeleteQ = async (id: string) => {
    const pid = sessionStorage.getItem('playerId')
    await fetch('/api/questions', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ roomId, ownerId: pid, id })
    })
    fetchMyQs()
  }

  const toggleSet = (set: string) => {
    if (!isHost) return
    const newSets = settings.sets.includes(set) 
      ? settings.sets.filter(s => s !== set) 
      : [...settings.sets, set]
    onUpdateSettings({ sets: newSets })
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col overflow-y-auto">
      <div className="text-center mb-8">
        <p className="text-[#b093ff] uppercase tracking-widest text-sm mb-2">Room Code</p>
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-display text-4xl font-bold tracking-widest bg-[#7B2FFF] text-white py-2 px-6 rounded-xl shadow-[0_0_20px_rgba(123,47,255,0.4)]">
            {roomId}
          </h1>
          <button 
            onClick={() => navigator.clipboard.writeText(roomId)}
            className="bg-white/10 hover:bg-[#39FF14] hover:text-black text-white p-3 rounded-xl transition-colors text-xl"
            title="Copy Room Code"
          >
            📋
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h3 className="font-bold text-[#FF2D8B] mb-2">Voting Time</h3>
          <div className="flex gap-2 flex-wrap">
            {[15, 20, 30, 40, 50].map(t => (
              <Chip key={t} label={`${t}s`} active={settings.voting_time === t} onClick={() => onUpdateSettings({ voting_time: t })} disabled={!isHost} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#FF2D8B] mb-2">Number of Rounds</h3>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 20, 30, 50].map(r => (
              <Chip key={r} label={`${r}`} active={settings.rounds === r} onClick={() => onUpdateSettings({ rounds: r })} disabled={!isHost} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
          <span className="font-bold">Allow Multiple Votes</span>
          <Toggle on={settings.multiple_votes} onChange={v => onUpdateSettings({ multiple_votes: v })} disabled={!isHost} />
        </div>

        {!settings.custom_only && (
          <div>
            <h3 className="font-bold text-[#FF2D8B] mb-2">Question Sets</h3>
            <div className="flex gap-2 flex-wrap mb-4">
              {BUILT_IN_SETS.map(set => (
                <Chip key={set} label={set} active={settings.sets.includes(set)} onClick={() => toggleSet(set)} disabled={!isHost} />
              ))}
            </div>
            
            {settings.sets.length > 1 && (
              <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                <span className="font-bold">Equal Distribution</span>
                <Toggle on={settings.mix_equal} onChange={v => onUpdateSettings({ mix_equal: v })} disabled={!isHost} />
              </div>
            )}
            
            {settings.sets.length > 1 && !settings.mix_equal && (
              <div className="bg-black/20 p-3 rounded-xl mt-2 space-y-2">
                <p className="text-sm text-[#b093ff] mb-2">Custom Distribution (Max 15 per set)</p>
                {settings.sets.map(set => (
                  <div key={set} className="flex justify-between items-center">
                    <span>{set}</span>
                    <div className="flex items-center gap-3">
                      <button disabled={!isHost} onClick={() => onUpdateSettings({ set_counts: { ...settings.set_counts, [set]: Math.max(0, (settings.set_counts[set]||0) - 1) } })} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                      <span className="w-4 text-center">{settings.set_counts[set] || 0}</span>
                      <button disabled={!isHost} onClick={() => onUpdateSettings({ set_counts: { ...settings.set_counts, [set]: Math.min(15, (settings.set_counts[set]||0) + 1) } })} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
          <span className="font-bold">Allow Custom Questions</span>
          <Toggle on={settings.allow_custom} onChange={v => onUpdateSettings({ allow_custom: v })} disabled={!isHost} />
        </div>

        {settings.allow_custom && (
          <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
            <span className="font-bold">Use Only Custom Questions</span>
            <Toggle on={settings.custom_only} onChange={v => onUpdateSettings({ custom_only: v })} disabled={!isHost} />
          </div>
        )}

        {settings.allow_custom && (
          <div className="border border-[#FF2D8B]/30 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#FF2D8B]">Add Custom Question</h3>
              <span className="text-sm text-[#b093ff]">Total in room: {customQTotal}</span>
            </div>
            <form onSubmit={handleAddQ} className="flex gap-2">
              <span className="py-2 text-[#b093ff]">Whose most likely to...</span>
              <input type="text" value={customQ} onChange={e => setCustomQ(e.target.value)} className="flex-1 bg-[#0c0818] border border-[#b093ff]/30 rounded-lg px-3 py-2 outline-none" placeholder="type here..." />
              <button type="submit" className="glass-button px-4 font-bold">Add</button>
            </form>
            
            {myCustomQs.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {myCustomQs.map(q => (
                  <div key={q.id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg text-sm">
                    <span className="truncate flex-1">...{q.text}</span>
                    <button onClick={() => handleDeleteQ(q.id)} className="text-[#FF2D8B] hover:text-white px-2">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#b093ff]/20">
        {isHost ? (
          <button 
            onClick={onStartGame} 
            disabled={!canStart}
            className={`w-full py-4 rounded-xl font-display font-bold text-xl transition-all ${canStart ? 'bg-[#39FF14] text-black glow-success hover:bg-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
          >
            START GAME
          </button>
        ) : (
          <div className="w-full py-4 text-center text-[#FFB830] font-bold italic">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  )
}
