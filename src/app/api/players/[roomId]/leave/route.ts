import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'

export async function DELETE(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID required' }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Delete player
    await prisma.player.delete({ where: { id: playerId } }).catch(() => null)

    const remainingPlayers = room.players.filter(p => p.id !== playerId)
    
    // Broadcast player-left
    await pusher.trigger(`room-${roomId}`, 'player-left', { playerId })

    // If room is empty, delete it
    if (remainingPlayers.length === 0) {
      await prisma.room.delete({ where: { id: roomId } }).catch(() => null)
      return NextResponse.json({ success: true, roomDeleted: true })
    }

    // Host migration
    if (room.hostId === playerId) {
      const newHost = remainingPlayers[0]
      if (newHost) {
        await prisma.room.update({
          where: { id: roomId },
          data: { hostId: newHost.id, hostName: newHost.name }
        })
        
        // Broadcast room updated so clients get new host info
        const updatedRoom = await prisma.room.findUnique({ where: { id: roomId } })
        await pusher.trigger(`room-${roomId}`, 'room-updated', updatedRoom)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Leave room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
