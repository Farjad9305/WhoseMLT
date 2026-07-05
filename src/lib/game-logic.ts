import { Question, RoomSettings } from './types'

export const QUESTION_SETS: Record<string, Question[]> = {
  Classic: [
    { id: 'c1', text: 'forget everyone\'s birthday', src: 'Classic' },
    { id: 'c2', text: 'show up late to their own wedding', src: 'Classic' },
    { id: 'c3', text: 'accidentally text the wrong person the most embarrassing thing', src: 'Classic' },
    { id: 'c4', text: 'survive a zombie apocalypse', src: 'Classic' },
    { id: 'c5', text: 'go viral on the internet for something ridiculous', src: 'Classic' },
    { id: 'c6', text: 'eat the last slice of pizza without asking anyone', src: 'Classic' },
    { id: 'c7', text: 'get completely lost in their own neighborhood', src: 'Classic' },
    { id: 'c8', text: 'binge an entire TV series in one weekend', src: 'Classic' },
    { id: 'c9', text: 'cry during a commercial', src: 'Classic' },
    { id: 'c10', text: 'talk to themselves out loud in public', src: 'Classic' },
    { id: 'c11', text: 'bring homemade food to every single party', src: 'Classic' },
    { id: 'c12', text: 'fall asleep during a movie at the cinema', src: 'Classic' },
    { id: 'c13', text: 'challenge a stranger to a dance battle', src: 'Classic' },
    { id: 'c14', text: 'accidentally like a really old Instagram post', src: 'Classic' },
    { id: 'c15', text: 'become addicted to a mobile game meant for kids', src: 'Classic' },
  ],
  Chaos: [
    { id: 'ch1', text: 'start a conspiracy theory that genuinely catches on', src: 'Chaos' },
    { id: 'ch2', text: 'get into a heated argument with a vending machine', src: 'Chaos' },
    { id: 'ch3', text: 'eat a bowl of cereal with orange juice instead of milk', src: 'Chaos' },
    { id: 'ch4', text: 'forget they left something cooking on the stove', src: 'Chaos' },
    { id: 'ch5', text: 'reply-all to an important company-wide email', src: 'Chaos' },
    { id: 'ch6', text: 'lose a debate against a 7-year-old', src: 'Chaos' },
    { id: 'ch7', text: 'accidentally adopt multiple extra animals in one month', src: 'Chaos' },
    { id: 'ch8', text: 'turn a 5-minute errand into a 4-hour adventure', src: 'Chaos' },
    { id: 'ch9', text: 'break something extremely expensive and immediately blame gravity', src: 'Chaos' },
    { id: 'ch10', text: 'challenge a professional at their own sport and somehow almost win', src: 'Chaos' },
    { id: 'ch11', text: 'get banned from a store for the pettiest possible reason', src: 'Chaos' },
    { id: 'ch12', text: 'accidentally start a cult', src: 'Chaos' },
    { id: 'ch13', text: 'convince a stranger their own name is spelled wrong', src: 'Chaos' },
    { id: 'ch14', text: 'name their pet after a celebrity', src: 'Chaos' },
    { id: 'ch15', text: 'get on the news for a completely bizarre reason', src: 'Chaos' },
  ],
  'Deep Cuts': [
    { id: 'd1', text: 'write a bestselling novel about their life', src: 'Deep Cuts' },
    { id: 'd2', text: 'move to a completely different country on a total whim', src: 'Deep Cuts' },
    { id: 'd3', text: 'be remembered and talked about in 100 years', src: 'Deep Cuts' },
    { id: 'd4', text: 'give the absolute best advice but never follow it themselves', src: 'Deep Cuts' },
    { id: 'd5', text: 'run a marathon with absolutely zero prior training', src: 'Deep Cuts' },
    { id: 'd6', text: 'end up on a reality TV show', src: 'Deep Cuts' },
    { id: 'd7', text: 'become a millionaire before turning 40', src: 'Deep Cuts' },
    { id: 'd8', text: 'go completely off the grid for a full year', src: 'Deep Cuts' },
    { id: 'd9', text: 'turn their side hobby into a thriving business', src: 'Deep Cuts' },
    { id: 'd10', text: 'still be best friends with everyone in this room in 10 years', src: 'Deep Cuts' },
    { id: 'd11', text: 'build something impressive entirely from scratch with their hands', src: 'Deep Cuts' },
    { id: 'd12', text: 'make a life-changing decision purely on impulse', src: 'Deep Cuts' },
    { id: 'd13', text: 'speak three or more languages fluently', src: 'Deep Cuts' },
    { id: 'd14', text: 'start a charity that actually makes a real impact', src: 'Deep Cuts' },
    { id: 'd15', text: 'invent something that changes daily life', src: 'Deep Cuts' },
  ],
  Awkward: [
    { id: 'a1', text: 'wave back at someone who was definitely not waving at them', src: 'Awkward' },
    { id: 'a2', text: 'say \'you too\' when a waiter tells them to enjoy their meal', src: 'Awkward' },
    { id: 'a3', text: 'hold a door open for someone who is way too far away', src: 'Awkward' },
    { id: 'a4', text: 'accidentally like a photo from three years ago while creeping', src: 'Awkward' },
    { id: 'a5', text: 'call their teacher or boss \'mom\' or \'dad\' by accident', src: 'Awkward' },
    { id: 'a6', text: 'confidently walk into a glass door', src: 'Awkward' },
    { id: 'a7', text: 'trip and fall in public and then pretend absolutely nothing happened', src: 'Awkward' },
    { id: 'a8', text: 'laugh at exactly the most inappropriate moment possible', src: 'Awkward' },
    { id: 'a9', text: 'forget someone\'s name immediately after being introduced', src: 'Awkward' },
    { id: 'a10', text: 'say a long goodbye and then walk in the exact same direction', src: 'Awkward' },
    { id: 'a11', text: 'blank on a word mid-sentence and never recover', src: 'Awkward' },
    { id: 'a12', text: 'clap enthusiastically when absolutely no one else is clapping', src: 'Awkward' },
    { id: 'a13', text: 'mispronounce a word they use all the time', src: 'Awkward' },
    { id: 'a14', text: 'respond \'I\'m good, thanks\' when asked a totally different question', src: 'Awkward' },
    { id: 'a15', text: 'get caught doing an elaborate solo dance in an elevator', src: 'Awkward' },
  ]
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generatePlayerId(): string {
  return 'p_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
}

export function hashPassword(password: string): string {
  let hash = 5381
  for (let i = 0; i < password.length; i++) {
    hash = (hash * 33) ^ password.charCodeAt(i)
  }
  return (hash >>> 0).toString(16)
}

export function buildQuestions(settings: RoomSettings, customQuestions: {id: string, text: string}[]): Question[] {
  let pool: Question[] = []

  if (settings.allow_custom && settings.custom_only) {
    pool = customQuestions.map(q => ({ id: q.id, text: q.text, src: 'Custom' }))
  } else {
    if (settings.allow_custom) {
      pool = pool.concat(customQuestions.map(q => ({ id: q.id, text: q.text, src: 'Custom' })))
    }
    
    if (settings.sets.length > 0) {
      if (settings.sets.length === 1) {
        pool = pool.concat(QUESTION_SETS[settings.sets[0]] || [])
      } else {
        if (settings.mix_equal) {
          settings.sets.forEach(set => {
            pool = pool.concat(QUESTION_SETS[set] || [])
          })
        } else {
          settings.sets.forEach(set => {
            const count = settings.set_counts[set] || 0
            const setQs = QUESTION_SETS[set] || []
            pool = pool.concat(shuffle(setQs).slice(0, count))
          })
        }
      }
    }
  }

  pool = shuffle(pool)
  return pool.slice(0, settings.rounds)
}
