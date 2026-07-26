import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import { touchRoom } from '@/lib/room-cleanup'

export async function PATCH(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const { id, name } = await request.json()

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name too short' }, { status: 400 })
    }

    const player = await prisma.player.update({
      where: { id },
      data: { name: name.trim() }
    })

    // If host changed name, update hostName in Room
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (room?.hostId === id) {
       await prisma.room.update({
          where: { id: roomId },
          data: { hostName: name.trim() }
       })
    }

    await pusher.trigger(`room-${roomId}`, 'player-renamed', { id, name: name.trim() })
    touchRoom(roomId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rename player error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
