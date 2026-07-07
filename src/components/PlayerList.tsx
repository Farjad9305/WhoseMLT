import { useState } from 'react'
import { PlayerData } from '@/lib/types'

export default function PlayerList({ players, hostId, currentId, onRename, onLeave, onKick }: { players: PlayerData[], hostId: string, currentId: string, onRename?: (name: string) => void, onLeave: () => void, onKick?: (id: string) => void }) {
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
      <h2 className="font-display font-bold text-xl mb-4 text-[#7B2FFF]">Players ({players.length})</h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {players.map(p => (
          <div key={p.id} className={`p-2 rounded-lg flex items-center gap-2 ${p.id === currentId ? 'bg-[#FF2D8B]/20 border border-[#FF2D8B]/30' : 'bg-black/20'}`}>
            {p.id === hostId && <span title="Host">👑</span>}
            <span className="truncate">{p.name}</span>
            {p.id === currentId && <span className="text-xs text-[#F0EBFF] ml-auto">(You)</span>}
            {onKick && p.id !== currentId && p.id !== hostId && (
              <button 
                onClick={() => onKick(p.id)} 
                className="ml-auto text-red-500 hover:text-white hover:bg-red-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors border border-red-500/30"
                title="Kick Player"
              >
                Kick
              </button>
            )}
          </div>
        ))}
      </div>
      {onRename && (
        <div className="mt-4 pt-4 border-t border-[#F0EBFF]/20">
          {editing ? (
            <div className="flex flex-col gap-2">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-[#2B2D42] border border-[#FF2D8B] rounded-lg px-2 py-1 outline-none text-sm" autoFocus />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 bg-[#00FFC6]/20 text-[#00FFC6] rounded-lg py-1 text-sm font-bold">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-white/10 rounded-lg py-1 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={handleEdit} className="w-full glass-button py-2 text-sm text-[#F0EBFF]">
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
