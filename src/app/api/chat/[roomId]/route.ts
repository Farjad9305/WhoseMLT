import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'

export async function POST(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const { pid, name, text } = await request.json()

    if (!text || text.trim().length === 0 || text.length > 200) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        pid,
        name,
        text: text.trim(),
        isSystem: false,
      }
    })

    await pusher.trigger(`room-${roomId}`, 'chat-message', {
      id: message.id,
      pid: message.pid,
      name: message.name,
      text: message.text,
      isSystem: message.isSystem,
      sentAt: message.sentAt.toISOString(),
    })

    // Prune old messages
    const allMessages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { sentAt: 'desc' },
      skip: 100
    })

    if (allMessages.length > 0) {
      const idsToDelete = allMessages.map(m => m.id)
      await prisma.chatMessage.deleteMany({
        where: { id: { in: idsToDelete } }
      })
    }

    return NextResponse.json({ message: {
      id: message.id,
      pid: message.pid,
      name: message.name,
      text: message.text,
      isSystem: message.isSystem,
      sentAt: message.sentAt.toISOString(),
    } })
  } catch (error) {
    console.error('Send chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { sentAt: 'desc' },
      take: 100
    })

    return NextResponse.json({
      messages: messages.reverse().map(m => ({
        id: m.id,
        pid: m.pid,
        name: m.name,
        text: m.text,
        isSystem: m.isSystem,
        sentAt: m.sentAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('Fetch chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
