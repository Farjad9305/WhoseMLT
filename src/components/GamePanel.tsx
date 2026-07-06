import { PlayerData, Question } from '@/lib/types'

export default function GamePanel({
  phase,
  round,
  totalRounds,
  question,
  players,
  myVotes,
  voteCounts,
  timeLeft,
  onVote,
  multipleVotes
}: {
  phase: string
  round: number
  totalRounds: number
  question: Question
  players: PlayerData[]
  myVotes: string[]
  voteCounts: Record<string, number>
  timeLeft: number | null
  onVote: (id: string, multiple: boolean) => void
  multipleVotes: boolean
}) {
  
  const isVoting = phase === 'voting'
  
  // Calculate max votes for the progress bars
  const maxVotes = Math.max(1, Object.values(voteCounts).reduce((a, b) => a + b, 0))

  return (
    <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <span className="bg-black/40 px-4 py-1 rounded-full text-sm font-bold text-[#b093ff]">
          Round {round + 1} / {totalRounds}
        </span>
        <span className={`px-4 py-1 rounded-full text-sm font-bold animate-pulse ${isVoting ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-[#FFB830]/20 text-[#FFB830]'}`}>
          {isVoting ? 'VOTING OPEN' : 'GET READY'}
        </span>
      </div>

      {/* Question Card */}
      <div className="text-center my-8">
        <p className="text-[#FF2D8B] font-bold text-lg mb-2">Whose most likely to...</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight">
          {question?.text || 'Loading...'}
        </h2>
        <p className="text-[#b093ff] text-xs mt-4">Source: {question?.src}</p>
      </div>

      {/* Timer Bar */}
      {timeLeft !== null && (
        <div className="w-full bg-black/40 h-2 rounded-full mb-8 overflow-hidden">
           <div 
             className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-[#FF2D8B] glow-accent' : 'bg-[#7B2FFF] glow-primary'}`} 
             style={{ width: `${Math.max(0, Math.min(100, (timeLeft / (isVoting ? 30 : 15)) * 100))}%` }} 
             // Note: max timer should ideally come from settings, hardcoded 30 for visual max width calculation fallback here, but using flex makes it robust
           />
        </div>
      )}

      {/* Timer Text */}
      <div className="text-center mb-8">
         <span className={`font-display text-4xl font-bold ${timeLeft !== null && timeLeft <= 5 ? 'text-[#FF2D8B]' : 'text-white'}`}>
           {timeLeft !== null ? timeLeft : '--'}s
         </span>
      </div>

      {/* Voting Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          {players.map(p => {
            const votes = voteCounts[p.id] || 0
            const percentage = (votes / maxVotes) * 100
            const isSelected = myVotes.includes(p.id)
            
            return (
              <button
                key={p.id}
                onClick={() => {
                  onVote(p.id, multipleVotes)
                }}
                disabled={!isVoting}
                className={`relative overflow-hidden p-4 rounded-xl transition-all text-left group
                  ${!isVoting ? 'opacity-70 cursor-not-allowed bg-black/20 border border-white/5' : 
                    isSelected ? 'bg-[#7B2FFF]/30 border border-[#7B2FFF] glow-primary transform scale-[1.02]' : 
                    'bg-black/40 border border-[#b093ff]/20 hover:border-[#b093ff]/60 hover:bg-black/60'}
                `}
              >
                {/* Progress Fill */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-[#7B2FFF]/20 transition-all duration-500 z-0"
                  style={{ width: `${percentage}%` }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex justify-between items-center">
                  <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-[#f0ebff]'}`}>{p.name}</span>
                  <div className="flex items-center gap-2">
                    {votes > 0 && <span className="font-display font-bold text-xl">{votes}</span>}
                    {isSelected && <span className="text-[#39FF14] text-xl">✓</span>}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
