import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import { touchRoom } from '@/lib/room-cleanup'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const roomId = url.searchParams.get('roomId')
  const ownerId = url.searchParams.get('ownerId')

  if (!roomId || !ownerId) {
    return NextResponse.json({ error: 'Missing roomId or ownerId' }, { status: 400 })
  }

  try {
    const questions = await prisma.customQuestion.findMany({
      where: { roomId, ownerId }
    })
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Fetch custom questions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { roomId, ownerId, text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Question cannot be empty' }, { status: 400 })
    }

    const question = await prisma.customQuestion.create({
      data: {
        roomId,
        ownerId,
        text: text.trim()
      }
    })

    touchRoom(roomId)

    const count = await prisma.customQuestion.count({
      where: { roomId }
    })

    await pusher.trigger(`room-${roomId}`, 'room-updated', {
      settings: { customQTotal: count } // Need to push this somehow, or handle in client
    })

    return NextResponse.json({ question, count })
  } catch (error) {
    console.error('Create custom question error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ownerId, text } = await request.json()

    const question = await prisma.customQuestion.findUnique({
      where: { id }
    })

    if (!question || question.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 })
    }

    const updated = await prisma.customQuestion.update({
      where: { id },
      data: { text: text.trim() }
    })

    touchRoom(question.roomId)

    return NextResponse.json({ question: updated })
  } catch (error) {
    console.error('Update custom question error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, ownerId, roomId } = await request.json()

    const question = await prisma.customQuestion.findUnique({
      where: { id }
    })

    if (!question || question.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 })
    }

    await prisma.customQuestion.delete({
      where: { id }
    })

    touchRoom(roomId)

    const count = await prisma.customQuestion.count({
      where: { roomId }
    })

    await pusher.trigger(`room-${roomId}`, 'room-updated', {
      settings: { customQTotal: count }
    })

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('Delete custom question error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
