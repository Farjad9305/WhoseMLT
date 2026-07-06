import { useState } from 'react'
import { PlayerData } from '@/lib/types'

export default function PlayerList({ players, hostId, currentId, onRename, onLeave }: { players: PlayerData[], hostId: string, currentId: string, onRename?: (name: string) => void, onLeave: () => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  const handleEdit = () => {
    const me = players.find(p => p.id === currentId)
    if (me) setName(me.name)
    setEditing(true)
  }

  const handleSave = () => {
    if (name.trim().length >= 2 && onRename) {
      onRename(name.trim())
    }
    setEditing(false)
  }

  return (
    <div className="glass-panel p-4 flex flex-col h-full">
      <h2 className="font-display font-bold text-xl mb-4 text-[#FF2D8B]">Players ({players.length})</h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {players.map(p => (
          <div key={p.id} className={`p-2 rounded-lg flex items-center gap-2 ${p.id === currentId ? 'bg-[#7B2FFF]/20 border border-[#7B2FFF]/30' : 'bg-black/20'}`}>
            {p.id === hostId && <span title="Host">👑</span>}
            <span className="truncate">{p.name}</span>
            {p.id === currentId && <span className="text-xs text-[#b093ff] ml-auto">(You)</span>}
          </div>
        ))}
      </div>
      {onRename && (
        <div className="mt-4 pt-4 border-t border-[#b093ff]/20">
          {editing ? (
            <div className="flex flex-col gap-2">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-[#0c0818] border border-[#7B2FFF] rounded-lg px-2 py-1 outline-none text-sm" autoFocus />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 bg-[#39FF14]/20 text-[#39FF14] rounded-lg py-1 text-sm font-bold">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-white/10 rounded-lg py-1 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={handleEdit} className="w-full glass-button py-2 text-sm text-[#b093ff]">
              Edit Name
            </button>
          )}
        </div>
      )}
      
      <div className="mt-4">
        <button onClick={onLeave} className="w-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-xl text-sm font-bold transition-all">
          Leave Room
        </button>
      </div>
    </div>
  )
}
