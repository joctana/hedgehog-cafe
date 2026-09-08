export type CafeCapyId = 'carlos' | 'coco' | 'pip' | 'nugget' | 'bean'

export interface CafeCapy {
  id: CafeCapyId
  name: string
  vibe: string
  coat: string
  belly: string
  accent: string
}

export const CAFE_CAPYS: CafeCapy[] = [
  {
    id: 'carlos',
    name: 'Carlos',
    vibe: 'Head chef',
    coat: '#b88960',
    belly: '#c99a70',
    accent: '#f5c518',
  },
  {
    id: 'coco',
    name: 'Coco',
    vibe: 'Hungry',
    coat: '#8f6540',
    belly: '#d4a882',
    accent: '#fb7185',
  },
  {
    id: 'pip',
    name: 'Pip',
    vibe: 'Snacky',
    coat: '#c99a70',
    belly: '#f3e0c8',
    accent: '#38bdf8',
  },
  {
    id: 'nugget',
    name: 'Nugget',
    vibe: 'Always hungry',
    coat: '#a67c52',
    belly: '#e8c9a8',
    accent: '#34d399',
  },
  {
    id: 'bean',
    name: 'Bean',
    vibe: 'Tea time',
    coat: '#7a5538',
    belly: '#c9a882',
    accent: '#c084fc',
  },
]

export const CHEF = CAFE_CAPYS[0]
export const GUESTS = CAFE_CAPYS.slice(1)

export type StationId = 'wash' | 'chop' | 'cook' | 'plate'

export const STATIONS: Array<{ id: StationId; label: string; emoji: string }> = [
  { id: 'wash', label: 'Wash', emoji: '🚿' },
  { id: 'chop', label: 'Chop', emoji: '🔪' },
  { id: 'cook', label: 'Cook', emoji: '🔥' },
  { id: 'plate', label: 'Plate', emoji: '🍽️' },
]

export type FoodShape = 'round' | 'melon' | 'cob' | 'leaf'
export type Vessel = 'bowl' | 'plate' | 'cup'

export interface FoodArt {
  shape: FoodShape
  color: string
  inner: string
  accent: string
  vessel: Vessel
  liquid?: string
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  steps: StationId[]
  coins: number
  art: FoodArt
}

export const RECIPES: Recipe[] = [
  {
    id: 'orange',
    name: 'Orange bowl',
    emoji: '🍊',
    steps: ['wash', 'chop', 'plate'],
    coins: 3,
    art: {
      shape: 'round',
      color: '#fb923c',
      inner: '#ffd9a8',
      accent: '#e2701c',
      vessel: 'bowl',
    },
  },
  {
    id: 'soup',
    name: 'Grass soup',
    emoji: '🥣',
    steps: ['wash', 'cook', 'plate'],
    coins: 4,
    art: {
      shape: 'leaf',
      color: '#5f9c5a',
      inner: '#9fd08f',
      accent: '#3f7a3c',
      vessel: 'bowl',
      liquid: '#a7cf6c',
    },
  },
  {
    id: 'melon',
    name: 'Melon cups',
    emoji: '🍈',
    steps: ['chop', 'plate'],
    coins: 2,
    art: {
      shape: 'melon',
      color: '#bcdd88',
      inner: '#eaf8cb',
      accent: '#8dbb58',
      vessel: 'cup',
    },
  },
  {
    id: 'corn',
    name: 'Corn cakes',
    emoji: '🌽',
    steps: ['chop', 'cook', 'plate'],
    coins: 5,
    art: {
      shape: 'cob',
      color: '#f6c945',
      inner: '#ffe89b',
      accent: '#d99a0b',
      vessel: 'plate',
    },
  },
  {
    id: 'tea',
    name: 'Warm tea',
    emoji: '🍵',
    steps: ['cook', 'plate'],
    coins: 2,
    art: {
      shape: 'leaf',
      color: '#77c66e',
      inner: '#c3ecb4',
      accent: '#4f9247',
      vessel: 'cup',
      liquid: '#cf9646',
    },
  },
]
