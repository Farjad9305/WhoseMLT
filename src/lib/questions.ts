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
    { id: 'c16', text: 'ask a completely inappropriate question during a serious meeting', src: 'Classic' },
    { id: 'c17', text: 'get caught singing in the shower by a roommate', src: 'Classic' },
    { id: 'c18', text: 'leave their wallet at home when going on a date', src: 'Classic' },
    { id: 'c19', text: 'try to fix a plumbing issue and flood the house', src: 'Classic' },
    { id: 'c20', text: 'drop their phone in the toilet', src: 'Classic' },
    { id: 'c21', text: 'accidentally send a screenshot of a chat to the person they were gossiping about', src: 'Classic' },
    { id: 'c22', text: 'fall asleep on public transport and miss their stop', src: 'Classic' },
    { id: 'c23', text: 'order a ridiculous amount of food when they are hungry', src: 'Classic' },
    { id: 'c24', text: 'misread the dress code for a formal event', src: 'Classic' },
    { id: 'c25', text: 'laugh at a joke they completely didn\'t understand', src: 'Classic' },
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
    { id: 'ch16', text: 'start a flash mob in the middle of a grocery store', src: 'Chaos' },
    { id: 'ch17', text: 'convince everyone they are an undercover spy', src: 'Chaos' },
    { id: 'ch18', text: 'dye their hair a neon color on a Tuesday night', src: 'Chaos' },
    { id: 'ch19', text: 'bring a wild animal into their home thinking it\'s a stray dog', src: 'Chaos' },
    { id: 'ch20', text: 'start a food fight at a fancy restaurant', src: 'Chaos' },
    { id: 'ch21', text: 'hack their friend\'s social media and post something bizarre', src: 'Chaos' },
    { id: 'ch22', text: 'get a tattoo of a meme that will be outdated in a month', src: 'Chaos' },
    { id: 'ch23', text: 'randomly decide to live in the wilderness for a week', src: 'Chaos' },
    { id: 'ch24', text: 'throw a party that gets shut down by the cops', src: 'Chaos' },
    { id: 'ch25', text: 'challenge a stranger to a duel over a parking spot', src: 'Chaos' },
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
    { id: 'a16', text: 'trip on flat ground while trying to look cool', src: 'Awkward' },
    { id: 'a17', text: 'confidently give the wrong directions to a tourist', src: 'Awkward' },
    { id: 'a18', text: 'get caught staring at someone across the room', src: 'Awkward' },
    { id: 'a19', text: 'accidentally call their partner by their ex\'s name', src: 'Awkward' },
    { id: 'a20', text: 'have their stomach rumble loudly during a moment of silence', src: 'Awkward' },
    { id: 'a21', text: 'forget what they were saying in the middle of a toast', src: 'Awkward' },
    { id: 'a22', text: 'try to give a high-five and get left hanging', src: 'Awkward' },
    { id: 'a23', text: 'laugh out loud while remembering a joke during a funeral', src: 'Awkward' },
    { id: 'a24', text: 'accidentally like their ex\'s new partner\'s picture from two years ago', src: 'Awkward' },
    { id: 'a25', text: 'get their foot stuck in a chair during a meeting', src: 'Awkward' },
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
    { id: 's21', text: 'date two people at the same time and think they can get away with it', src: 'Polarizing' },
    { id: 's22', text: 'completely rewrite history to make themselves look good', src: 'Polarizing' },
    { id: 's23', text: 'deliberately spoil a movie for someone who hasn\'t seen it yet', src: 'Polarizing' },
    { id: 's24', text: 'borrow money from a friend and "forget" to pay it back', src: 'Polarizing' },
    { id: 's25', text: 'leave a negative review for a small business over a minor inconvenience', src: 'Polarizing' },
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
    { id: 'd21', text: 'sneak someone out of their window in the middle of the night', src: 'Dirty' },
    { id: 'd22', text: 'accidentally send a spicy text to their boss', src: 'Dirty' },
    { id: 'd23', text: 'be caught making out in a public place', src: 'Dirty' },
    { id: 'd24', text: 'have a crush on their best friend\'s sibling', src: 'Dirty' },
    { id: 'd25', text: 'brag about their performance in bed', src: 'Dirty' },
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
