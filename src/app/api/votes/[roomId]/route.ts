import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const votes = await prisma.vote.findMany({
      where: { roomId }
    })
    return NextResponse.json({ votes })
  } catch (error) {
    console.error('Fetch votes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
