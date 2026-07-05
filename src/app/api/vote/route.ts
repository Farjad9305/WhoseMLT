import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pusher } from '@/lib/pusher'
import { RoomSettings } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { roomId, round, voterId, targetId } = await request.json()

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.phase !== 'voting') {
      return NextResponse.json({ error: 'Voting is not open' }, { status: 400 })
    }

    if (room.round !== round) {
      return NextResponse.json({ error: 'Invalid round' }, { status: 400 })
    }

    const settings = room.settings as unknown as RoomSettings

    if (targetId === null) {
      // Deleting a vote
      // if multiple_votes is true, targetId is required to know which vote to delete.
      // Assuming targetId is provided if multiple_votes is true, otherwise delete all votes for this round by this voter.
      if (settings.multiple_votes) {
          return NextResponse.json({ error: 'targetId is required when multiple_votes is enabled' }, { status: 400 })
      }
      
      await prisma.vote.deleteMany({
        where: {
          roomId,
          round,
          voterId
        }
      })
    } else {
      if (settings.multiple_votes) {
        // Toggle vote: if exists delete, else create
        const existingVote = await prisma.vote.findFirst({
            where: {
                roomId,
                round,
                voterId,
                targetId
            }
        })
        
        if (existingVote) {
             await prisma.vote.delete({
                 where: { id: existingVote.id }
             })
        } else {
            await prisma.vote.create({
              data: {
                roomId,
                round,
                voterId,
                targetId
              }
            })
        }
      } else {
        // Single vote: delete any existing vote for this voter in this round, then create
        await prisma.vote.deleteMany({
          where: {
            roomId,
            round,
            voterId
          }
        })
        await prisma.vote.create({
          data: {
            roomId,
            round,
            voterId,
            targetId
          }
        })
      }
    }

    const roundVotes = await prisma.vote.findMany({
      where: { roomId, round }
    })

    await pusher.trigger(`room-${roomId}`, 'votes-synced', roundVotes)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
