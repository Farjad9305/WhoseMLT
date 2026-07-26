import { useState, useEffect } from 'react'
import { RoomSettings, Question } from '@/lib/types'
import Toggle from './ui/Toggle'
import Chip from './ui/Chip'

const BUILT_IN_SETS = ['Classic', 'Chaos', 'Awkward', 'Polarizing', 'Dirty']

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
  
  const [editingQId, setEditingQId] = useState<string | null>(null)
  const [editQText, setEditQText] = useState('')
  const [helpModal, setHelpModal] = useState<'rules' | 'settings' | null>(null)

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

  useEffect(() => {
    if (isHost && settings.custom_only && customQTotal < settings.rounds) {
      onUpdateSettings({ custom_only: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, settings.custom_only, customQTotal, settings.rounds])

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

  const handleEditStart = (q: Question) => {
    setEditingQId(q.id)
    setEditQText(q.text)
  }

  const handleEditSave = async (id: string) => {
    if (!editQText.trim()) return
    const pid = sessionStorage.getItem('playerId')
    await fetch('/api/questions', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id, ownerId: pid, text: editQText })
    })
    setEditingQId(null)
    fetchMyQs()
  }

  const toggleSet = (set: string) => {
    if (!isHost) return
    let newSets = [...settings.sets]
    if (newSets.includes(set)) {
      newSets = newSets.filter(s => s !== set)
    } else {
      if (newSets.length >= 2) {
        newSets.shift() // FIFO
      }
      newSets.push(set)
    }
    
    let newCounts = { ...settings.set_counts }
    if (newSets.length === 2 && !settings.mix_equal) {
      const half = Math.floor(settings.rounds / 2)
      newCounts = {
        [newSets[0]]: settings.rounds - half,
        [newSets[1]]: half
      }
    }
    onUpdateSettings({ sets: newSets, set_counts: newCounts })
  }

  const handleUpdateRounds = (r: number) => {
    const updates: Partial<RoomSettings> = { rounds: r }
    
    if (settings.custom_only && r > customQTotal) {
      updates.custom_only = false
    }

    if (!settings.mix_equal && settings.sets.length === 2) {
      const setA = settings.sets[0]
      const setB = settings.sets[1]
      let countA = settings.set_counts[setA] || Math.floor(r / 2)
      countA = Math.max(1, Math.min(countA, r - 1))
      updates.set_counts = {
        [setA]: countA,
        [setB]: r - countA
      }
    }
    onUpdateSettings(updates)
  }

  const handleToggleMixEqual = (v: boolean) => {
    if (v) {
       onUpdateSettings({ mix_equal: true })
    } else {
       if (settings.sets.length === 2) {
         const half = Math.floor(settings.rounds / 2)
         onUpdateSettings({ 
           mix_equal: false, 
           set_counts: { 
             [settings.sets[0]]: settings.rounds - half, 
             [settings.sets[1]]: half 
           } 
         })
       } else {
         onUpdateSettings({ mix_equal: false })
       }
    }
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col overflow-y-auto relative">
      {/* Lobby Help Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setHelpModal('rules')}
          className="bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/40 border border-[#7B2FFF]/50 text-[#F0EBFF] px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          ❓ How to Play
        </button>
        <button
          onClick={() => setHelpModal('settings')}
          className="bg-[#FF2D8B]/20 hover:bg-[#FF2D8B]/40 border border-[#FF2D8B]/50 text-[#F0EBFF] px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          ⚙️ Settings Guide
        </button>
      </div>

      {helpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-md w-full relative border border-white/20 shadow-2xl animate-fade-in">
            <button onClick={() => setHelpModal(null)} className="absolute top-4 right-4 text-white/70 hover:text-white text-lg font-bold">✕</button>
            {helpModal === 'rules' ? (
              <>
                <h2 className="font-bold text-xl text-[#7B2FFF] mb-4 flex items-center gap-2"><span>📖</span> How to Play</h2>
                <ol className="space-y-4 text-base text-[#F0EBFF] leading-relaxed list-decimal list-inside">
                  <li><strong className="text-white font-bold">Create or Join:</strong> One person creates a room and shares the 8-character code with friends.</li>
                  <li><strong className="text-white font-bold">The Prompt:</strong> Every round, a "Most likely to..." question appears (e.g., "Most likely to survive a zombie apocalypse?").</li>
                  <li><strong className="text-white font-bold">Vote:</strong> Vote for the friend who fits the prompt best before the timer runs out!</li>
                  <li><strong className="text-white font-bold">Results:</strong> See who got the most votes at the end of the game and discover what your friends really think of you.</li>
                </ol>
              </>
            ) : (
              <>
                <h2 className="font-bold text-xl text-[#FF2D8B] mb-4 flex items-center gap-2"><span>⚙️</span> Game Settings Guide</h2>
                <ul className="space-y-4 text-base text-[#F0EBFF] leading-relaxed max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  <li><strong className="text-white font-bold">⏱️ Voting Time:</strong> Adjust how many seconds players have to cast their vote each round.</li>
                  <li><strong className="text-white font-bold">🔢 No. of Rounds:</strong> Set the total number of questions per game (5, 10, 15, or 20).</li>
                  <li><strong className="text-white font-bold">🗳️ Multiple Votes:</strong> Allow players to vote for more than one person in a single round.</li>
                  <li><strong className="text-white font-bold">📚 Question Sets:</strong> Choose up to 2 themed sets of questions (Classic, Chaos, Awkward, Polarizing, Dirty).</li>
                  <li><strong className="text-white font-bold">⚖️ Equal Distribution:</strong> Toggle whether questions are split equally between selected sets or customized via slider.</li>
                  <li><strong className="text-white font-bold">✍️ Allow Custom Questions:</strong> Let players submit their own spicy prompts into the game pool.</li>
                  <li><strong className="text-white font-bold">🎯 Use Only Custom Questions:</strong> Play exclusively using custom prompts submitted by your friends in the lobby.</li>
                  <li><strong className="text-white font-bold">🔒 Privacy:</strong> Custom questions are anonymous during gameplay—no one else can see who added which prompt!</li>
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <p className="text-[#F0EBFF] opacity-60 uppercase tracking-widest text-sm mb-2">Room Code</p>
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            {roomId}
          </h1>
          <button 
            onClick={() => navigator.clipboard.writeText(roomId)}
            className="ml-2 bg-[#00FFC6]/10 hover:bg-[#00FFC6]/20 border border-[#00FFC6]/40 text-[#00FFC6] px-4 py-2 rounded-xl transition-colors font-bold uppercase tracking-wider text-sm shadow-[0_0_10px_rgba(0,255,198,0.2)]"
            title="Copy Room Code"
          >
            🔗
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h3 className="font-bold text-[#FF2D8B] mb-2">Voting Time</h3>
          <div className="flex gap-2 flex-wrap">
            {[10, 15, 20, 30].map(t => (
              <Chip key={t} label={`${t}s`} active={settings.voting_time === t} onClick={() => onUpdateSettings({ voting_time: t })} disabled={!isHost} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#FF2D8B] mb-2">Number of Rounds</h3>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 15, 20].map(r => (
              <Chip key={r} label={`${r}`} active={settings.rounds === r} onClick={() => handleUpdateRounds(r)} disabled={!isHost} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
          <span className="font-bold">Allow Multiple Votes</span>
          <Toggle on={settings.multiple_votes} onChange={v => onUpdateSettings({ multiple_votes: v })} disabled={!isHost} />
        </div>

        {!settings.custom_only && (
          <div>
            <h3 className="font-bold text-[#FF2D8B] mb-2">Question Sets (choose any 2)</h3>
            <div className="flex gap-2 flex-wrap mb-4">
              {BUILT_IN_SETS.map(set => (
                <Chip key={set} label={set} active={settings.sets.includes(set)} onClick={() => toggleSet(set)} disabled={!isHost} />
              ))}
            </div>
            
            {settings.sets.length === 2 && (
              <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                <span className="font-bold">Equal Distribution</span>
                <Toggle on={settings.mix_equal} onChange={handleToggleMixEqual} disabled={!isHost} />
              </div>
            )}
            
            {settings.sets.length === 2 && !settings.mix_equal && (
              <div className="bg-black/20 p-4 rounded-xl mt-2 space-y-4">
                <p className="text-sm text-[#b093ff] text-center font-bold">Custom Distribution</p>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-white">{settings.sets[0]}: {settings.set_counts[settings.sets[0]] || Math.ceil(settings.rounds / 2)}</span>
                  <span className="text-white">{settings.sets[1]}: {settings.rounds - (settings.set_counts[settings.sets[0]] || Math.ceil(settings.rounds / 2))}</span>
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={settings.rounds - 1} 
                  value={settings.set_counts[settings.sets[0]] || Math.ceil(settings.rounds / 2)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    onUpdateSettings({ 
                      set_counts: { 
                        [settings.sets[0]]: val, 
                        [settings.sets[1]]: settings.rounds - val 
                      } 
                    })
                  }}
                  disabled={!isHost}
                  className="w-full accent-[#FF2D8B] cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
          <span className="font-bold">Allow Custom Questions</span>
          <Toggle on={settings.allow_custom} onChange={v => onUpdateSettings({ allow_custom: v })} disabled={!isHost} />
        </div>

        {settings.allow_custom && (
          <div className={`flex items-center justify-between bg-black/20 p-3 rounded-xl ${customQTotal < settings.rounds ? 'opacity-50' : ''}`}>
            <div className="flex flex-col">
              <span className="font-bold">Use Only Custom Questions</span>
              {customQTotal < settings.rounds && (
                <span className="text-xs text-red-400">Need {settings.rounds} custom questions</span>
              )}
            </div>
            <Toggle 
              on={settings.custom_only} 
              onChange={v => onUpdateSettings({ custom_only: v })} 
              disabled={!isHost || customQTotal < settings.rounds} 
            />
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
                  <div key={q.id} className="flex flex-col bg-black/20 p-2 rounded-lg text-sm gap-2">
                    {editingQId === q.id ? (
                      <div className="flex gap-2">
                        <input type="text" value={editQText} onChange={e => setEditQText(e.target.value)} className="flex-1 bg-[#0c0818] border border-[#b093ff]/30 rounded-lg px-2 py-1 outline-none" autoFocus />
                        <button onClick={() => handleEditSave(q.id)} className="text-[#39FF14] hover:text-white px-2 font-bold">✓</button>
                        <button onClick={() => setEditingQId(null)} className="text-white/50 hover:text-white px-2">✕</button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full gap-2">
                        <span className="truncate flex-1" title={q.text}>...{q.text}</span>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleEditStart(q)} className="text-[#b093ff] hover:text-white" title="Edit">✏️</button>
                          <button onClick={() => handleDeleteQ(q.id)} className="text-[#FF2D8B] hover:text-white" title="Delete">✕</button>
                        </div>
                      </div>
                    )}
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
