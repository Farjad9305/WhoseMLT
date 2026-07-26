import { prisma } from './prisma'
import { pusher } from './pusher'

export async function touchRoom(roomId: string) {
  try {
    await prisma.room.update({
      where: { id: roomId },
      data: { lastActivityAt: new Date() }
    })
  } catch {
    // Ignore error if room doesn't exist or DB issue
  }
}

export async function cleanIdleRooms() {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    const idleRooms = await prisma.room.findMany({
      where: {
        lastActivityAt: {
          lt: fifteenMinutesAgo
        }
      },
      select: { id: true }
    })

    if (idleRooms.length === 0) return

    for (const room of idleRooms) {
      try {
        await pusher.trigger(`room-${room.id}`, 'room-closed', {
          reason: 'Room closed due to 15 minutes of inactivity.'
        })
      } catch {
        // Ignore pusher error
      }
    }

    await prisma.room.deleteMany({
      where: {
        id: {
          in: idleRooms.map(r => r.id)
        }
      }
    })
  } catch {
    // Ignore cleanup errors
  }
}
