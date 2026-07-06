import { NextResponse } from 'next/server'
import { pusher } from '@/lib/pusher'

export async function POST(request: Request) {
  try {
    const { roomId, name } = await request.json()

    if (!roomId || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Broadcast typing event (name only)
    await pusher.trigger(`room-${roomId}`, 'user-typing', { name })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Typing event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
