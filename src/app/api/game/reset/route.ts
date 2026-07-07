import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'

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
      return NextResponse.json({ error: 'Only host can reset game' }, { status: 403 })
    }

    // Reset room to lobby
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        phase: 'lobby',
        round: 0,
        phaseStart: null,
        questions: '[]',
        version: { increment: 1 }
      }
    })

    // Delete all votes for this room
    await prisma.vote.deleteMany({
      where: { roomId }
    })
    
    // Custom questions are intentionally preserved so they can be reused across games

    await pusher.trigger(`room-${roomId}`, 'phase-changed', {
      phase: 'lobby',
      round: 0,
      phaseStart: null
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset game error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
