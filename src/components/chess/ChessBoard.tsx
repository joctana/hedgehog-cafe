import {
  PIECE_NAMES,
  PIECE_SYMBOLS,
  type Board,
  type Move,
} from './chessEngine'

type Props = {
  board: Board
  selected: number | null
  legalTargets: number[]
  lastMove?: Move | null
  hintMove?: Move | null
  starSquare?: number | null
  onSquare: (square: number) => void
  disabled?: boolean
}

export function ChessBoard({
  board,
  selected,
  legalTargets,
  lastMove = null,
  hintMove = null,
  starSquare = null,
  onSquare,
  disabled = false,
}: Props) {
  return (
    <div className="carlos-chess-board" role="grid" aria-label="Chess board">
      {board.map((piece, square) => {
        const row = Math.floor(square / 8)
        const col = square % 8
        const light = (row + col) % 2 === 0
        const legal = legalTargets.includes(square)
        const capture = legal && Boolean(piece)
        const inLastMove = lastMove?.from === square || lastMove?.to === square
        const hinted = hintMove?.from === square || hintMove?.to === square
        const label = piece
          ? `${piece.color} ${PIECE_NAMES[piece.type]} on ${'abcdefgh'[col]}${8 - row}`
          : `empty ${'abcdefgh'[col]}${8 - row}`

        return (
          <button
            key={square}
            type="button"
            role="gridcell"
            className={[
              'carlos-chess-square',
              light ? 'light' : 'dark',
              selected === square ? 'selected' : '',
              legal ? 'legal' : '',
              capture ? 'capture' : '',
              inLastMove ? 'last-move' : '',
              hinted ? 'hinted' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={label}
            aria-selected={selected === square}
            disabled={disabled}
            onClick={() => onSquare(square)}
          >
            {piece && (
              <span className={`chess-piece ${piece.color}`}>
                {PIECE_SYMBOLS[piece.color][piece.type]}
              </span>
            )}
            {legal && <i className="chess-move-dot" aria-hidden />}
            {starSquare === square && <span className="chess-lesson-star">⭐</span>}
            {col === 0 && <small className="chess-rank">{8 - row}</small>}
            {row === 7 && <small className="chess-file">{'abcdefgh'[col]}</small>}
          </button>
        )
      })}
    </div>
  )
}
