export type GymCapyId = 'carlos' | 'coco' | 'pip' | 'nugget'

export interface GymCapy {
  id: GymCapyId
  name: string
  vibe: string
  coat: string
  belly: string
  accent: string
}

export const GYM_CAPYS: GymCapy[] = [
  {
    id: 'carlos',
    name: 'Carlos',
    vibe: 'Coach',
    coat: '#b88960',
    belly: '#c99a70',
    accent: '#f5c518',
  },
  {
    id: 'coco',
    name: 'Coco',
    vibe: 'Jumpy',
    coat: '#8f6540',
    belly: '#d4a882',
    accent: '#fb7185',
  },
  {
    id: 'pip',
    name: 'Pip',
    vibe: 'Speedy',
    coat: '#c99a70',
    belly: '#f3e0c8',
    accent: '#38bdf8',
  },
  {
    id: 'nugget',
    name: 'Nugget',
    vibe: 'Strong',
    coat: '#a67c52',
    belly: '#e8c9a8',
    accent: '#34d399',
  },
]
