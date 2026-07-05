import { useState, useCallback, useEffect } from 'react'
import { VoteData } from '@/lib/types'

export function useVotes(roomId: string, round: number, playerId: string | null, initialVotes: VoteData[] = []) {
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [myVotes, setMyVotes] = useState<string[]>([])
  
  useEffect(() => {
    const counts: Record<string, number> = {}
    const mine: string[] = []
    
    initialVotes.forEach(v => {
      if (v.round !== round) return
      counts[v.targetId] = (counts[v.targetId] || 0) + 1
      if (v.voterId === playerId) {
        mine.push(v.targetId)
      }
    })
    
    setVoteCounts(counts)
    setMyVotes(mine)
  }, [initialVotes, round, playerId])

  const castVote = useCallback(async (targetId: string, multiple: boolean) => {
    if (!playerId) return

    let newTargetId: string | null = targetId
    
    setMyVotes(prev => {
      if (multiple) {
        if (prev.includes(targetId)) {
          newTargetId = null // We'll handle multiple deletes in API differently, but UI optimistic update
          return prev.filter(id => id !== targetId)
        }
        return [...prev, targetId]
      } else {
        if (prev.includes(targetId)) {
          newTargetId = null
          return []
        }
        return [targetId]
      }
    })

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          round,
          voterId: playerId,
          targetId: newTargetId,
          multiple_votes: multiple
        })
      })
    } catch {
      // Silently fail, maybe revert optimistic update
    }
  }, [playerId, roomId, round])

  return { voteCounts, myVotes, castVote }
}
