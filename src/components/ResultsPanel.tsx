import { PlayerData, Question, VoteData } from '@/lib/types'
import { useState, useMemo, useEffect } from 'react'

export default function ResultsPanel({
  roomId,
  players,
  questions,
  votes, // Note: The application logic needs to fetch all votes across all rounds, but in the current design `useRoom` only fetches real-time votes. For the results screen to work properly, we need to fetch all votes when game_end triggers, or keep track of them in state. Assuming votes prop contains all votes for now.
  isHost,
  onNewGame
}: {
  roomId: string
  players: PlayerData[]
  questions: Question[]
  votes: VoteData[]
  isHost: boolean
  onNewGame: () => void
}) {
  const [expandedRound, setExpandedRound] = useState<number | null>(null)
  const [allVotes, setAllVotes] = useState<VoteData[]>(votes)

  useEffect(() => {
    fetch(`/api/votes/${roomId}`)
      .then(res => res.json())
      .then(data => {
        if (data.votes) setAllVotes(data.votes)
      })
      .catch(console.error)
  }, [roomId])

  const leaderboard = useMemo(() => {
    const counts: Record<string, number> = {}
    players.forEach(p => counts[p.id] = 0)
    
    allVotes.forEach(v => {
      if (counts[v.targetId] !== undefined) {
        counts[v.targetId]++
      }
    })
    
    return players
      .map(p => ({ ...p, totalVotes: counts[p.id] }))
      .sort((a, b) => b.totalVotes - a.totalVotes)
  }, [players, allVotes])
  
  const maxLeaderboardVotes = Math.max(1, leaderboard[0]?.totalVotes || 1)

  return (
    <div className="glass-panel p-6 h-full flex flex-col overflow-hidden">
      <div className="text-center mb-8 shrink-0">
        <span className="text-6xl block mb-4">🏆</span>
        <h1 className="font-display font-bold text-4xl text-[#39FF14] glow-success">That's a wrap!</h1>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        {/* Leaderboard */}
        <div>
          <h2 className="font-bold text-[#FF2D8B] mb-4 text-xl">Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.map((p, i) => (
              <div key={p.id} className="relative bg-black/40 p-3 rounded-xl overflow-hidden flex items-center justify-between">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-[#7B2FFF]/30 z-0" 
                  style={{ width: `${(p.totalVotes / maxLeaderboardVotes) * 100}%` }}
                />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-6 text-center font-bold">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
                  </span>
                  <span className="font-bold text-[#f0ebff]">{p.name}</span>
                </div>
                <span className="relative z-10 font-display font-bold text-lg">{p.totalVotes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Round by Round */}
        <div>
          <h2 className="font-bold text-[#FF2D8B] mb-4 text-xl">Round Breakdown</h2>
          <div className="space-y-2">
            {questions.map((q, roundIdx) => {
              const roundVotes = allVotes.filter(v => v.round === roundIdx)
              const voteCounts: Record<string, number> = {}
              roundVotes.forEach(v => {
                voteCounts[v.targetId] = (voteCounts[v.targetId] || 0) + 1
              })
              
              const maxVotes = Math.max(0, ...Object.values(voteCounts))
              const winners = players.filter(p => voteCounts[p.id] === maxVotes && maxVotes > 0)
              
              return (
                <div key={roundIdx} className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => setExpandedRound(expandedRound === roundIdx ? null : roundIdx)}
                    className="w-full text-left p-4 flex justify-between items-center hover:bg-black/40 transition-colors"
                  >
                    <div className="truncate pr-4 flex-1">
                      <span className="text-[#b093ff] mr-2 text-sm">{roundIdx + 1}.</span>
                      <span className="font-medium">{q.text}</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {winners.length > 0 ? (
                        <span className="text-[#39FF14] text-sm font-bold truncate max-w-[100px]">
                          {winners.map(w => w.name).join(', ')}
                        </span>
                      ) : (
                        <span className="text-white/30 text-sm italic">No votes</span>
                      )}
                      <span className="text-[#b093ff]">{expandedRound === roundIdx ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  
                  {expandedRound === roundIdx && (
                    <div className="p-4 pt-0 border-t border-white/5 bg-black/40">
                      {players.map(p => {
                        const v = voteCounts[p.id] || 0
                        if (v === 0) return null
                        return (
                          <div key={p.id} className="flex justify-between py-1 text-sm border-b border-white/5 last:border-0">
                            <span>{p.name}</span>
                            <span className="font-bold">{v} vote{v !== 1 && 's'}</span>
                          </div>
                        )
                      })}
                      {Object.keys(voteCounts).length === 0 && (
                        <p className="text-white/30 italic text-sm py-2">No one voted in this round.</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-[#b093ff]/20 shrink-0">
        {isHost ? (
          <button 
            onClick={onNewGame} 
            className="w-full py-4 rounded-xl font-display font-bold text-xl transition-all bg-[#7B2FFF] text-white glow-primary hover:bg-[#FF2D8B] hover:shadow-[0_0_15px_rgba(255,45,139,0.5)]"
          >
            NEW GAME — BACK TO LOBBY
          </button>
        ) : (
          <div className="w-full py-4 text-center text-[#FFB830] font-bold italic">
            Waiting for host to start a new game...
          </div>
        )}
      </div>
    </div>
  )
}
