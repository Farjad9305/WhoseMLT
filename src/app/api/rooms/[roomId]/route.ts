import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import { RoomSettings } from '@/lib/types'

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        players: true
      }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
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
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        roomId: p.roomId,
        joinedAt: p.joinedAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('Fetch room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const { settings, playerId } = await request.json()

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.hostId !== playerId) {
      return NextResponse.json({ error: 'Only the host can change settings' }, { status: 403 })
    }

    if (room.phase !== 'lobby') {
      return NextResponse.json({ error: 'Cannot change settings after game has started' }, { status: 400 })
    }

    const currentSettings = room.settings as unknown as RoomSettings
    const newSettings = { ...currentSettings, ...settings }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        settings: newSettings as object
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

    await pusher.trigger(`room-${roomId}`, 'room-updated', { settings: roomData.settings })

    return NextResponse.json({ room: roomData })
  } catch (error) {
    console.error('Update room settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
