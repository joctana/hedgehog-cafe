export type RobotId = 'optimus' | 'starscream' | 'megatron' | 'soundwave'

export interface RobotProfile {
  id: RobotId
  name: string
  role: 'autobot' | 'decepticon'
  primary: string
  secondary: string
  accent: string
  hitsToDefeat: number
  taunt: string
}

export const OPTIMUS: RobotProfile = {
  id: 'optimus',
  name: 'Optimus Prime',
  role: 'autobot',
  primary: '#1f4f9c',
  secondary: '#c62828',
  accent: '#f0c040',
  hitsToDefeat: 0,
  taunt: 'Autobots, roll out!',
}

export const DECEPTICONS: RobotProfile[] = [
  {
    id: 'starscream',
    name: 'Starscream',
    role: 'decepticon',
    primary: '#6b4c9a',
    secondary: '#c0c6d4',
    accent: '#e6b85c',
    hitsToDefeat: 3,
    taunt: 'You cannot stop me!',
  },
  {
    id: 'soundwave',
    name: 'Soundwave',
    role: 'decepticon',
    primary: '#3d3f6b',
    secondary: '#7a80a8',
    accent: '#5ec8ff',
    hitsToDefeat: 4,
    taunt: 'Soundwave superior!',
  },
  {
    id: 'megatron',
    name: 'Megatron',
    role: 'decepticon',
    primary: '#5a5e66',
    secondary: '#8b9099',
    accent: '#d4a017',
    hitsToDefeat: 5,
    taunt: 'Decepticons, attack!',
  },
]
