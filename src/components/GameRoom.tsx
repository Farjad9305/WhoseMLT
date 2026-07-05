'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlayerList from './PlayerList'
import ChatPanel from './ChatPanel'
import LobbyPanel from './LobbyPanel'
import GamePanel from './GamePanel'
import ResultsPanel from './ResultsPanel'
import { useRoom } from '@/hooks/useRoom'
import { useVotes } from '@/hooks/useVotes'

export default function GameRoom({ roomId }: { roomId: string }) {
  const router = useRouter()
  const [playerId, setPlayerId] = useState<string | null>(null)
  
  useEffect(() => {
    const pid = sessionStorage.getItem('playerId')
    const rid = sessionStorage.getItem('roomId')
    if (!pid || rid !== roomId) {
      router.push('/')
      return
    }
    setPlayerId(pid)
  }, [roomId, router])

  const { 
    room, players, chat, votes: roomVotes, customQTotal, 
    isLoading, error, timeLeft, 
    updateSettings, sendChat, advancePhase 
  } = useRoom(roomId, playerId)
  
  // Actually, useVotes only gets the real-time pushed votes from useRoom. 
  // In a robust implementation, on mount of GamePanel we'd fetch existing votes for the round.
  // We'll pass roomVotes into useVotes so it syncs up.
  const { voteCounts, myVotes, castVote } = useVotes(roomId, room?.round || 0, playerId, roomVotes)

  if (isLoading || !playerId) {
    return <div className="min-h-screen flex items-center justify-center font-display text-2xl text-[#b093ff] animate-pulse">Loading Room...</div>
  }

  if (error || !room) {
    return <div className="min-h-screen flex items-center justify-center font-display text-xl text-[#FF2D8B]">Error: {error || 'Room not found'}</div>
  }

  const isHost = room.hostId === playerId
  const canStart = players.length >= 2

  const handleRename = async (name: string) => {
    sessionStorage.setItem('playerName', name)
    // PATCH /api/players/[roomId] logic is missing in the api list but mentioned in the spec file tree.
    // I will mock this or you can add the API route. The spec says PATCH /api/players/[roomId].
    await fetch(`/api/players/${roomId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: playerId, name })
    })
  }
  
  const handleStartGame = async () => {
    if (!isHost) return
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, playerId })
    })
  }

  const handleNewGame = async () => {
    if (!isHost) return
    // Assuming a /api/game/reset route to go back to lobby
    await fetch(`/api/game/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, playerId })
    })
  }

  return (
    <div className="max-w-[1600px] mx-auto h-screen p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">
      
      {/* Left Column - Players */}
      <div className="w-full md:w-64 shrink-0 h-48 md:h-full hidden md:block">
        <PlayerList 
          players={players} 
          hostId={room.hostId} 
          currentId={playerId}
          onRename={room.phase === 'lobby' ? handleRename : undefined}
        />
      </div>

      {/* Mobile Player List (Collapsible / Top row) */}
      <div className="md:hidden glass-panel p-3 shrink-0 flex items-center justify-between">
         <span className="font-bold text-[#FF2D8B]">Players: {players.length}</span>
         {room.phase === 'lobby' && (
           <span className="text-xs text-[#b093ff]">Change name on Desktop</span>
         )}
      </div>

      {/* Middle Column - Game Area */}
      <div className="flex-1 min-w-0 h-full">
        {room.phase === 'lobby' && (
          <LobbyPanel 
            roomId={roomId}
            settings={room.settings}
            isHost={isHost}
            customQTotal={customQTotal}
            onUpdateSettings={updateSettings}
            onStartGame={handleStartGame}
            canStart={canStart}
          />
        )}
        
        {(room.phase === 'pre_round' || room.phase === 'voting') && (
          <GamePanel 
            phase={room.phase}
            round={room.round}
            totalRounds={room.settings.rounds}
            question={room.questions[room.round]}
            players={players}
            myVotes={myVotes}
            voteCounts={voteCounts}
            timeLeft={timeLeft}
            onVote={castVote}
            multipleVotes={room.settings.multiple_votes}
          />
        )}

        {room.phase === 'game_end' && (
          <ResultsPanel 
             roomId={roomId}
             players={players}
             questions={room.questions}
             votes={roomVotes}
             isHost={isHost}
             onNewGame={handleNewGame}
          />
        )}
      </div>

      {/* Right Column - Chat */}
      <div className="w-full md:w-80 shrink-0 h-64 md:h-full hidden md:block">
        <ChatPanel messages={chat} onSend={(text) => sendChat(text, players.find(p=>p.id===playerId)?.name || 'Unknown')} />
      </div>

      {/* Mobile Chat Placeholder (Optional) */}
    </div>
  )
}
