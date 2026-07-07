import GameRoom from '@/components/GameRoom'

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  
  return (
    <main className="min-h-screen flex flex-col justify-center">
      <GameRoom roomId={roomId} />
    </main>
  )
}
