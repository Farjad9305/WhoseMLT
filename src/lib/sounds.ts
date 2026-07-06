let audioCtx: AudioContext | null = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const playTick = () => {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1000, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.05)
}

export const playPop = () => {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.1)
}

export const playTada = () => {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc1.type = 'triangle'
  osc2.type = 'square'
  
  // Ta
  osc1.frequency.setValueAtTime(440, ctx.currentTime) // A4
  osc2.frequency.setValueAtTime(440, ctx.currentTime)
  
  // Da!
  osc1.frequency.setValueAtTime(554.37, ctx.currentTime + 0.15) // C#5
  osc2.frequency.setValueAtTime(554.37, ctx.currentTime + 0.15)
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.5, ctx.currentTime + 0.15)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
  
  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(ctx.destination)
  
  osc1.start()
  osc2.start()
  osc1.stop(ctx.currentTime + 1.5)
  osc2.stop(ctx.currentTime + 1.5)
}
