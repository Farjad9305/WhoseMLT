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
  const [activeTab, setActiveTab] = useState<'players' | 'game' | 'chat'>('game')
  
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
    isLoading, error, timeLeft, typingUsers,
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

  const handleLeaveRoom = async () => {
    if (!playerId) return
    await fetch(`/api/players/${roomId}/leave`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId })
    })
    sessionStorage.removeItem('roomId')
    router.push('/')
  }

  const handleKick = async (id: string) => {
    if (!isHost) return
    await fetch(`/api/players/${roomId}/leave`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: id })
    })
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full h-screen md:max-h-[1100px] flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden bg-[#050012] md:bg-transparent p-0 md:p-6">
      
      {/* Mobile Tabs Header */}
      <div className="md:hidden flex items-center justify-between bg-black/40 p-3 shadow-md shrink-0">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('players')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'players' ? 'bg-[#7B2FFF] text-white' : 'bg-white/5 text-white/50'}`}>
            Players ({players.length})
          </button>
          <button onClick={() => setActiveTab('game')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'game' ? 'bg-[#FF2D8B] text-white' : 'bg-white/5 text-white/50'}`}>
            Game
          </button>
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'chat' ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white/50'}`}>
            Chat
          </button>
        </div>
      </div>

      {/* Desktop Header / Top Right actions (Removed explicit leave button) */}
      
      {/* Left Column - Players */}
      <div className={`w-full md:w-56 shrink-0 h-full md:block p-4 md:p-0 ${activeTab === 'players' ? 'block' : 'hidden'}`}>
        <div className="md:hidden mb-4 flex justify-between items-center">
           <h2 className="text-xl font-bold text-[#FF2D8B]">Players</h2>
        </div>
        <PlayerList 
          players={players} 
          hostId={room.hostId} 
          currentId={playerId}
          onRename={room.phase === 'lobby' ? handleRename : undefined}
          onLeave={handleLeaveRoom}
          onKick={isHost ? handleKick : undefined}
        />
      </div>

      {/* Middle Column - Game Area */}
      <div className={`flex-1 min-w-0 h-full p-4 md:p-0 md:flex flex-col ${activeTab === 'game' ? 'flex' : 'hidden'}`}>
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
      <div className={`w-full md:w-72 shrink-0 h-full md:block p-4 md:p-0 ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
        <ChatPanel 
          roomId={roomId}
          messages={chat} 
          typingUsers={typingUsers}
          onSend={(text) => sendChat(text, players.find(p=>p.id===playerId)?.name || 'Unknown')} 
          playerName={players.find(p=>p.id===playerId)?.name || 'Unknown'}
        />
      </div>
    </div>
  )
}
