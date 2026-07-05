import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import { buildQuestions } from '@/lib/game-logic'
import { RoomSettings } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { roomId, playerId } = await request.json()

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.hostId !== playerId) {
      return NextResponse.json({ error: 'Only the host can start the game' }, { status: 403 })
    }

    if (room.phase !== 'lobby') {
      return NextResponse.json({ error: 'Game already started' }, { status: 400 })
    }

    const playerCount = await prisma.player.count({
      where: { roomId }
    })

    if (playerCount < 2) {
      return NextResponse.json({ error: 'Need at least 2 players to start' }, { status: 400 })
    }

    const customQuestions = await prisma.customQuestion.findMany({
      where: { roomId }
    })

    const settings = room.settings as unknown as RoomSettings
    const finalQuestions = buildQuestions(settings, customQuestions)

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        phase: 'pre_round',
        round: 0,
        phaseStart: new Date(),
        questions: finalQuestions as any,
        version: {
          increment: 1
        }
      },
      include: {
        players: true
      }
    })

    const roomData = {
      ...updatedRoom,
      phaseStart: updatedRoom.phaseStart?.toISOString() || null,
      settings: updatedRoom.settings as unknown as RoomSettings,
      questions: updatedRoom.questions as any[],
      players: updatedRoom.players.map(p => ({
        id: p.id,
        name: p.name,
        roomId: p.roomId,
        joinedAt: p.joinedAt.toISOString(),
      })),
    }

    await pusher.trigger(`room-${roomId}`, 'game-started', {
      questions: roomData.questions,
      settings: roomData.settings
    })

    await pusher.trigger(`room-${roomId}`, 'phase-changed', {
      phase: roomData.phase,
      round: roomData.round,
      phaseStart: roomData.phaseStart
    })

    return NextResponse.json({ room: roomData })
  } catch (error) {
    console.error('Start game error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { roomId, knownVersion } = await request.json()

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.version !== knownVersion) {
      // Another client already advanced the phase
      return NextResponse.json({ advanced: false, phase: room.phase })
    }

    const settings = room.settings as unknown as RoomSettings
    let nextPhase = room.phase
    let nextRound = room.round

    if (room.phase === 'pre_round') {
      nextPhase = 'voting'
    } else if (room.phase === 'voting') {
      if (room.round + 1 >= settings.rounds) {
        nextPhase = 'game_end'
      } else {
        nextPhase = 'pre_round'
        nextRound = room.round + 1
      }
    } else if (room.phase === 'game_end') {
        // Just return, or could be reset logic.
        return NextResponse.json({ advanced: false, phase: room.phase })
    }

    const result = await prisma.room.updateMany({
      where: {
        id: roomId,
        version: knownVersion
      },
      data: {
        phase: nextPhase,
        round: nextRound,
        phaseStart: new Date(),
        version: knownVersion + 1
      }
    })

    if (result.count === 0) {
      // Lost the race
      return NextResponse.json({ advanced: false, phase: room.phase }, { status: 409 })
    }

    const newRoom = await prisma.room.findUnique({
      where: { id: roomId }
    })

    const phaseStartStr = newRoom!.phaseStart?.toISOString() || null

    await pusher.trigger(`room-${roomId}`, 'phase-changed', {
      phase: nextPhase,
      round: nextRound,
      phaseStart: phaseStartStr
    })

    return NextResponse.json({ advanced: true, phase: nextPhase })
  } catch (error) {
    console.error('Advance phase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
