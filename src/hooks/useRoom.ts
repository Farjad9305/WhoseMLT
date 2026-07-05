import { useState, useEffect, useCallback, useRef } from 'react'
import { pusherClient } from '@/lib/pusher-client'
import { RoomData, PlayerData, ChatMessageData, RoomSettings, VoteData, Question } from '@/lib/types'

export function useRoom(roomId: string, playerId: string | null) {
  const [room, setRoom] = useState<RoomData | null>(null)
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [chat, setChat] = useState<ChatMessageData[]>([])
  const [votes, setVotes] = useState<VoteData[]>([])
  const [customQTotal, setCustomQTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  
  const roomRef = useRef<RoomData | null>(null)
  
  useEffect(() => {
    roomRef.current = room
  }, [room])

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`)
      if (!res.ok) throw new Error('Failed to fetch room')
      const data = await res.json()
      setRoom(data.room)
      setPlayers(data.players)
      setIsLoading(false)
    } catch {
      setError('Could not load room')
      setIsLoading(false)
    }
  }, [roomId])
  
  const fetchChat = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${roomId}`)
      if (res.ok) {
        const data = await res.json()
        setChat(data.messages)
      }
    } catch {
      // Ignore
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId) return
    fetchRoom()
    fetchChat()
    
    // Fallback polling
    const interval = setInterval(fetchRoom, 5000)
    return () => clearInterval(interval)
  }, [roomId, fetchRoom, fetchChat])

  useEffect(() => {
    if (!roomId) return
    const channelName = `room-${roomId}`
    const channel = pusherClient.subscribe(channelName)
    
    channel.bind('player-joined', (data: PlayerData) => {
      setPlayers(prev => [...prev.filter(p => p.id !== data.id), data])
    })
    
    channel.bind('player-left', (data: {id: string}) => {
      setPlayers(prev => prev.filter(p => p.id !== data.id))
    })
    
    channel.bind('player-renamed', (data: {id: string, name: string}) => {
      setPlayers(prev => prev.map(p => p.id === data.id ? { ...p, name: data.name } : p))
    })
    
    channel.bind('room-updated', (data: Partial<RoomData>) => {
      setRoom(prev => prev ? { ...prev, ...data, settings: { ...prev.settings, ...(data.settings || {}) } } : null)
      if (data.settings && 'customQTotal' in data.settings) {
         setCustomQTotal((data.settings as unknown as { customQTotal: number }).customQTotal)
      }
    })
    
    channel.bind('votes-synced', (data: VoteData[]) => {
       setVotes(data)
    })
    
    channel.bind('chat-message', (data: ChatMessageData) => {
      setChat(prev => [...prev, data])
    })
    
    channel.bind('game-started', (data: { questions: Question[], settings: RoomSettings }) => {
      setRoom(prev => prev ? { ...prev, questions: data.questions, settings: data.settings } : null)
    })
    
    channel.bind('phase-changed', (data: { phase: RoomData['phase'], round: number, phaseStart: string | null }) => {
      setRoom(prev => prev ? { ...prev, phase: data.phase, round: data.round, phaseStart: data.phaseStart } : null)
      setVotes([]) // Clear votes on phase change
    })
    
    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(channelName)
    }
  }, [roomId])

  // Timer logic
  useEffect(() => {
    if (!room || !room.phaseStart || (room.phase !== 'pre_round' && room.phase !== 'voting')) {
      setTimeLeft(null)
      return
    }

    const duration = room.phase === 'pre_round' ? 15 : room.settings.voting_time
    
    const tick = () => {
       const currentRoom = roomRef.current
       if (!currentRoom || !currentRoom.phaseStart) return

       const start = new Date(currentRoom.phaseStart).getTime()
       const elapsed = Math.floor((Date.now() - start) / 1000)
       const rem = Math.max(0, duration - elapsed)
       setTimeLeft(rem)

       if (rem === 0 && currentRoom.version) {
          advancePhase(currentRoom.version)
       }
    }

    tick()
    const int = setInterval(tick, 1000)
    return () => clearInterval(int)
  }, [room?.phase, room?.phaseStart, room?.settings?.voting_time])

  const advancePhase = async (knownVersion: number) => {
    try {
      await fetch(`/api/game`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, knownVersion })
      })
    } catch {
      // ignore
    }
  }

  const updateSettings = async (settings: Partial<RoomSettings>) => {
    if (!playerId) return
    await fetch(`/api/rooms/${roomId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings, playerId })
    })
  }
  
  const sendChat = async (text: string, name: string) => {
    if (!playerId) return
    await fetch(`/api/chat/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid: playerId, name, text })
    })
  }

  return { room, players, chat, votes, customQTotal, isLoading, error, timeLeft, updateSettings, sendChat, advancePhase }
}
