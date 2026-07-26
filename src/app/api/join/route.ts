import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import { generatePlayerId, hashPassword } from '@/lib/game-logic'
import { RoomSettings } from '@/lib/types'
import { touchRoom } from '@/lib/room-cleanup'

export async function POST(request: Request) {
  try {
    const { name, roomId, password } = await request.json()

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    if (room.phase === 'game_end') {
      return NextResponse.json({ error: 'Cannot join a finished game' }, { status: 400 })
    }

    const playerId = generatePlayerId()

    const player = await prisma.player.create({
      data: {
        id: playerId,
        name,
        roomId
      }
    })

    touchRoom(roomId) // Update activity timestamp

    await prisma.chatMessage.create({
      data: {
        roomId,
        text: `${name} joined the room`,
        isSystem: true,
      }
    })

    const playerData = {
      id: player.id,
      name: player.name,
      roomId: player.roomId,
      joinedAt: player.joinedAt.toISOString(),
    }

    await pusher.trigger(`room-${roomId}`, 'player-joined', playerData)

    const updatedRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        players: true
      }
    })

    return NextResponse.json({
      room: {
        ...updatedRoom,
        phaseStart: updatedRoom!.phaseStart?.toISOString() || null,
        settings: updatedRoom!.settings as unknown as RoomSettings,
        questions: updatedRoom!.questions as any[],
        players: updatedRoom!.players.map(p => ({
          id: p.id,
          name: p.name,
          roomId: p.roomId,
          joinedAt: p.joinedAt.toISOString(),
        })),
      },
      playerId,
      players: updatedRoom!.players.map(p => ({
        id: p.id,
        name: p.name,
        roomId: p.roomId,
        joinedAt: p.joinedAt.toISOString(),
      }))
    })

  } catch (error) {
    console.error('Join room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
