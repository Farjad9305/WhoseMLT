import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateRoomId, generatePlayerId, hashPassword } from '@/lib/game-logic'
import { RoomSettings } from '@/lib/types'

const defaultSettings: RoomSettings = {
  voting_time: 30,
  rounds: 10,
  multiple_votes: false,
  sets: ['Classic'],
  mix_equal: true,
  set_counts: {},
  allow_custom: false,
  custom_only: false,
}

export async function POST(request: Request) {
  try {
    const { hostName, password } = await request.json()

    if (!hostName || hostName.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }
    if (!password || password.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 })
    }

    const roomId = generateRoomId()
    const hostId = generatePlayerId()

    await prisma.room.create({
      data: {
        id: roomId,
        passwordHash: hashPassword(password),
        hostId,
        hostName,
        settings: defaultSettings as any,
        players: {
          create: {
            id: hostId,
            name: hostName,
          }
        },
        chatMessages: {
          create: {
            text: `${hostName} created the room ✨`,
            isSystem: true,
          }
        }
      }
    })

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        players: true
      }
    })

    if (!room) {
      throw new Error('Room creation failed')
    }

    return NextResponse.json({
      room: {
        ...room,
        phaseStart: room.phaseStart?.toISOString() || null,
        settings: room.settings as unknown as RoomSettings,
        questions: room.questions as any[],
        players: room.players.map(p => ({
          id: p.id,
          name: p.name,
          roomId: p.roomId,
          joinedAt: p.joinedAt.toISOString(),
        })),
      },
      playerId: hostId
    })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
