export type RobotId = 'optimus' | 'starscream' | 'megatron' | 'soundwave'

export type AttackMove = 'punch' | 'laser' | 'energon' | 'ram'

export interface RobotProfile {
  id: RobotId
  name: string
  role: 'autobot' | 'decepticon'
  primary: string
  secondary: string
  accent: string
  hitsToDefeat: number
  taunt: string
  weakness: AttackMove
}

export const OPTIMUS = {
  id: 'optimus' as const,
  name: 'Optimus Prime',
  role: 'autobot' as const,
  primary: '#1f4f9c',
  secondary: '#c62828',
  accent: '#f0c040',
  taunt: 'Autobots, transform and roll out!',
}

export const DECEPTICONS: RobotProfile[] = [
  {
    id: 'starscream',
    name: 'Starscream',
    role: 'decepticon',
    primary: '#6b4c9a',
    secondary: '#c0c6d4',
    accent: '#e6b85c',
    hitsToDefeat: 4,
    taunt: 'Catch me if you can!',
    weakness: 'laser',
  },
  {
    id: 'soundwave',
    name: 'Soundwave',
    role: 'decepticon',
    primary: '#3d3f6b',
    secondary: '#7a80a8',
    accent: '#5ec8ff',
    hitsToDefeat: 5,
    taunt: 'Soundwave superior!',
    weakness: 'punch',
  },
  {
    id: 'megatron',
    name: 'Megatron',
    role: 'decepticon',
    primary: '#5a5e66',
    secondary: '#8b9099',
    accent: '#d4a017',
    hitsToDefeat: 6,
    taunt: 'You will fall, Prime!',
    weakness: 'energon',
  },
]

export const MOVES: Record<
  AttackMove,
  { label: string; emoji: string; damage: number; energonCost: number }
> = {
  punch: { label: 'Punch', emoji: '👊', damage: 1, energonCost: 0 },
  laser: { label: 'Laser', emoji: '🔫', damage: 1, energonCost: 0 },
  energon: { label: 'Energon', emoji: '⚡', damage: 2, energonCost: 3 },
  ram: { label: 'Ram', emoji: '🚛', damage: 2, energonCost: 0 },
}
