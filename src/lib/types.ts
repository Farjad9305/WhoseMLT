export interface RoomSettings {
  voting_time: number
  rounds: number
  multiple_votes: boolean
  sets: string[]
  mix_equal: boolean
  set_counts: Record<string, number>
  allow_custom: boolean
  custom_only: boolean
}

export interface Question {
  id: string
  text: string
  src: string
}

export interface PlayerData {
  id: string
  name: string
  roomId: string
  joinedAt: string
}

export interface RoomData {
  id: string
  hostId: string
  hostName: string
  phase: 'lobby' | 'pre_round' | 'voting' | 'game_end'
  round: number
  phaseStart: string | null
  version: number
  settings: RoomSettings
  questions: Question[]
  players: PlayerData[]
}

export interface ChatMessageData {
  id: string
  pid: string | null
  name: string | null
  text: string
  isSystem: boolean
  sentAt: string
}

export interface VoteData {
  voterId: string
  targetId: string
  round: number
}

export type PusherEvent =
  | { event: 'player-joined'; data: PlayerData }
  | { event: 'player-left'; data: { id: string } }
  | { event: 'player-renamed'; data: { id: string; name: string } }
  | { event: 'room-updated'; data: Partial<RoomData> }
  | { event: 'vote-updated'; data: VoteData }
  | { event: 'chat-message'; data: ChatMessageData }
  | { event: 'game-started'; data: { questions: Question[]; settings: RoomSettings } }
  | { event: 'phase-changed'; data: { phase: RoomData['phase']; round: number; phaseStart: string | null } }
