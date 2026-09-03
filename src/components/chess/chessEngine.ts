export type PieceColor = 'white' | 'black'
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

export type Piece = {
  color: PieceColor
  type: PieceType
}

export type Board = Array<Piece | null>

export type Move = {
  from: number
  to: number
  promotion?: PieceType
}

export const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
}

export const PIECE_NAMES: Record<PieceType, string> = {
  king: 'King',
  queen: 'Queen',
  rook: 'Rook',
  bishop: 'Bishop',
  knight: 'Knight',
  pawn: 'Pawn',
}

const VALUES: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 100,
}

const at = (row: number, col: number) => row * 8 + col
const rowOf = (square: number) => Math.floor(square / 8)
const colOf = (square: number) => square % 8
const inside = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8

export function createStartingBoard(): Board {
  const board: Board = Array.from({ length: 64 }, () => null)
  const back: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
  back.forEach((type, col) => {
    board[at(0, col)] = { color: 'black', type }
    board[at(1, col)] = { color: 'black', type: 'pawn' }
    board[at(6, col)] = { color: 'white', type: 'pawn' }
    board[at(7, col)] = { color: 'white', type }
  })
  return board
}

export function makeMove(board: Board, move: Move): Board {
  const next = [...board]
  const moving = next[move.from]
  next[move.to] = moving
    ? {
        ...moving,
        type: move.promotion ?? moving.type,
      }
    : null
  next[move.from] = null
  return next
}

function addSliding(
  board: Board,
  from: number,
  color: PieceColor,
  directions: Array<[number, number]>,
  moves: Move[],
) {
  const startRow = rowOf(from)
  const startCol = colOf(from)
  for (const [dr, dc] of directions) {
    let row = startRow + dr
    let col = startCol + dc
    while (inside(row, col)) {
      const to = at(row, col)
      const target = board[to]
      if (!target) {
        moves.push({ from, to })
      } else {
        if (target.color !== color && target.type !== 'king') moves.push({ from, to })
        break
      }
      row += dr
      col += dc
    }
  }
}

function pseudoMoves(board: Board, from: number, attacksOnly = false): Move[] {
  const piece = board[from]
  if (!piece) return []
  const moves: Move[] = []
  const row = rowOf(from)
  const col = colOf(from)
  const push = (toRow: number, toCol: number) => {
    if (!inside(toRow, toCol)) return
    const to = at(toRow, toCol)
    const target = board[to]
    if (!target || (target.color !== piece.color && target.type !== 'king')) {
      moves.push({ from, to })
    }
  }

  if (piece.type === 'pawn') {
    const direction = piece.color === 'white' ? -1 : 1
    const startRow = piece.color === 'white' ? 6 : 1
    const promotionRow = piece.color === 'white' ? 0 : 7

    for (const dc of [-1, 1]) {
      const targetRow = row + direction
      const targetCol = col + dc
      if (!inside(targetRow, targetCol)) continue
      const to = at(targetRow, targetCol)
      const target = board[to]
      if (attacksOnly || (target && target.color !== piece.color && target.type !== 'king')) {
        moves.push({
          from,
          to,
          promotion: targetRow === promotionRow ? 'queen' : undefined,
        })
      }
    }

    if (!attacksOnly) {
      const oneRow = row + direction
      if (inside(oneRow, col) && !board[at(oneRow, col)]) {
        moves.push({
          from,
          to: at(oneRow, col),
          promotion: oneRow === promotionRow ? 'queen' : undefined,
        })
        const twoRow = row + direction * 2
        if (row === startRow && !board[at(twoRow, col)]) {
          moves.push({ from, to: at(twoRow, col) })
        }
      }
    }
    return moves
  }

  if (piece.type === 'knight') {
    const jumps: Array<[number, number]> = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ]
    jumps.forEach(([dr, dc]) => push(row + dr, col + dc))
    return moves
  }

  if (piece.type === 'king') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr || dc) push(row + dr, col + dc)
      }
    }
    return moves
  }

  const straight: Array<[number, number]> = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  const diagonal: Array<[number, number]> = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]
  if (piece.type === 'rook') addSliding(board, from, piece.color, straight, moves)
  if (piece.type === 'bishop') addSliding(board, from, piece.color, diagonal, moves)
  if (piece.type === 'queen') addSliding(board, from, piece.color, [...straight, ...diagonal], moves)
  return moves
}

export function isSquareAttacked(board: Board, square: number, by: PieceColor): boolean {
  const attackBoard = [...board]
  attackBoard[square] = null
  return attackBoard.some((piece, from) => {
    if (!piece || piece.color !== by) return false
    return pseudoMoves(attackBoard, from, true).some((move) => move.to === square)
  })
}

export function isInCheck(board: Board, color: PieceColor): boolean {
  const king = board.findIndex((piece) => piece?.color === color && piece.type === 'king')
  if (king < 0) return true
  return isSquareAttacked(board, king, color === 'white' ? 'black' : 'white')
}

export function legalMovesFor(board: Board, from: number): Move[] {
  const piece = board[from]
  if (!piece) return []
  return pseudoMoves(board, from).filter((move) => !isInCheck(makeMove(board, move), piece.color))
}

export function allLegalMoves(board: Board, color: PieceColor): Move[] {
  return board.flatMap((piece, from) =>
    piece?.color === color ? legalMovesFor(board, from) : [],
  )
}

/**
 * Carlos plays gently: he usually prefers safe development, but notices
 * obvious captures. This keeps the match real without crushing a beginner.
 */
export function chooseCarlosMove(board: Board): Move | null {
  const moves = allLegalMoves(board, 'black')
  if (!moves.length) return null

  const scored = moves.map((move) => {
    const moving = board[move.from]!
    const target = board[move.to]
    const centerDistance =
      Math.abs(3.5 - rowOf(move.to)) + Math.abs(3.5 - colOf(move.to))
    let score = Math.random() * 2
    score += Math.max(0, 4 - centerDistance) * 0.35
    if (moving.type === 'pawn' || moving.type === 'knight' || moving.type === 'bishop') score += 0.5
    // Carlos sees captures, but intentionally values them less than a normal engine.
    if (target) score += VALUES[target.type] * 0.65
    if (isInCheck(makeMove(board, move), 'white')) score += 0.7
    return { move, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.move ?? moves[0]!
}

export function squareName(square: number): string {
  return `${'abcdefgh'[colOf(square)]}${8 - rowOf(square)}`
}
