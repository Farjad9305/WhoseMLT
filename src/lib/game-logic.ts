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
    { id: 'dc1', text: 'write a bestselling novel about their life', src: 'Deep Cuts' },
    { id: 'dc2', text: 'move to a completely different country on a total whim', src: 'Deep Cuts' },
    { id: 'dc3', text: 'be remembered and talked about in 100 years', src: 'Deep Cuts' },
    { id: 'dc4', text: 'give the absolute best advice but never follow it themselves', src: 'Deep Cuts' },
    { id: 'dc5', text: 'run a marathon with absolutely zero prior training', src: 'Deep Cuts' },
    { id: 'dc6', text: 'end up on a reality TV show', src: 'Deep Cuts' },
    { id: 'dc7', text: 'become a millionaire before turning 40', src: 'Deep Cuts' },
    { id: 'dc8', text: 'go completely off the grid for a full year', src: 'Deep Cuts' },
    { id: 'dc9', text: 'turn their side hobby into a thriving business', src: 'Deep Cuts' },
    { id: 'dc10', text: 'still be best friends with everyone in this room in 10 years', src: 'Deep Cuts' },
    { id: 'dc11', text: 'build something impressive entirely from scratch with their hands', src: 'Deep Cuts' },
    { id: 'dc12', text: 'make a life-changing decision purely on impulse', src: 'Deep Cuts' },
    { id: 'dc13', text: 'speak three or more languages fluently', src: 'Deep Cuts' },
    { id: 'dc14', text: 'start a charity that actually makes a real impact', src: 'Deep Cuts' },
    { id: 'dc15', text: 'invent something that changes daily life', src: 'Deep Cuts' },
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
  ],
  Polarizing: [
    { id: 's1', text: 'disappear and have no contact with anyone', src: 'Polarizing' },
    { id: 's2', text: 'date a close friend\'s Ex', src: 'Polarizing' },
    { id: 's3', text: 'get drunk and send a "miss you" text to someone', src: 'Polarizing' },
    { id: 's4', text: 'have a draft of texts they wanted to send but never sent', src: 'Polarizing' },
    { id: 's5', text: 'talk about people in this group to another group', src: 'Polarizing' },
    { id: 's6', text: 'ghost everyone for a month without warning', src: 'Polarizing' },
    { id: 's7', text: 'mute the group chat because it annoys them', src: 'Polarizing' },
    { id: 's8', text: 'bring an outsider to a private group hangout', src: 'Polarizing' },
    { id: 's9', text: 'hold a grudge over something that happened 3 years ago', src: 'Polarizing' },
    { id: 's10', text: 'remember all details of a fight no else cares about anymore', src: 'Polarizing' },
    { id: 's11', text: 'cut off everyone as soon as they sign a MAANG contract', src: 'Polarizing' },
    { id: 's12', text: 'get emotional and cry on the graduation night', src: 'Polarizing' },
    { id: 's13', text: 'organize a "Reuninon Party" 5 years later', src: 'Polarizing' },
    { id: 's14', text: 'have a threesome', src: 'Polarizing' },
    { id: 's15', text: 'fake their death', src: 'Polarizing' },
    { id: 's16', text: 'crack a joke during an inappropriate time', src: 'Polarizing' },
    { id: 's17', text: 'ditch their friend to flirt with a stranger', src: 'Polarizing' },
    { id: 's18', text: 'spend their money on something stupid', src: 'Polarizing' },
    { id: 's19', text: 'forget to flush the toilet', src: 'Polarizing' },
    { id: 's20', text: 'blame someone else for their mistake', src: 'Polarizing' },
  ],
  Dirty: [
    { id: 'd1', text: 'have friend\'s with benefits', src: 'Dirty' },
    { id: 'd2', text: 'have the highest body count after 5 years', src: 'Dirty' },
    { id: 'd3', text: 'use a cheesy pick-up line that actually leads to hookup', src: 'Dirty' },
    { id: 'd4', text: 'initiate dirty talk', src: 'Dirty' },
    { id: 'd5', text: 'own an impressive collection of sex toys', src: 'Dirty' },
    { id: 'd6', text: 'have watched porn in the last 24 hours', src: 'Dirty' },
    { id: 'd7', text: 'get into trouble for public display of affection', src: 'Dirty' },
    { id: 'd8', text: 'have a stash of sexy bedroom outfits', src: 'Dirty' },
    { id: 'd9', text: 'create a dedicated sex playlist on spotify', src: 'Dirty' },
    { id: 'd10', text: 'hook up with someone whose significantly older or younger', src: 'Dirty' },
    { id: 'd11', text: 'enthusiastically participate in a threesome', src: 'Dirty' },
    { id: 'd12', text: 'instigate a late night skinny dipping session', src: 'Dirty' },
    { id: 'd13', text: 'have a turn-on that they are embarrassed to admit', src: 'Dirty' },
    { id: 'd14', text: 'have a one night stand story that they still think about', src: 'Dirty' },
    { id: 'd15', text: 'have the most random "type" when it comes to partner\'s body', src: 'Dirty' },
    { id: 'd16', text: 'have used a dating app but never go out with someone on there', src: 'Dirty' },
    { id: 'd17', text: 'have rehearsed sexy talk in front of a mirror', src: 'Dirty' },
    { id: 'd18', text: 'complete a sex dare', src: 'Dirty' },
    { id: 'd19', text: 'have a signature "seduction scent" they wear to impress', src: 'Dirty' },
    { id: 'd20', text: 'get turned on in the most random way that no one else does', src: 'Dirty' },
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
