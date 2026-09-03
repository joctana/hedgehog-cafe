import { useEffect, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { ChessBoard } from './ChessBoard'
import { ChessCarlos } from './ChessCarlos'
import {
  PIECE_NAMES,
  allLegalMoves,
  chooseCarlosMove,
  createStartingBoard,
  isInCheck,
  legalMovesFor,
  makeMove,
  squareName,
  type Board,
  type Move,
  type PieceType,
} from './chessEngine'
import './chess.css'

type Screen = 'welcome' | 'learn' | 'match' | 'result'
type Turn = 'white' | 'black'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Lesson = {
  piece: PieceType
  start: number
  target: number
  legal: number[]
  title: string
  rule: string
  prompt: string
}

const LESSONS: Lesson[] = [
  {
    piece: 'pawn',
    start: 52,
    target: 44,
    legal: [44, 36],
    title: 'The brave Pawn',
    rule: 'Pawns march straight ahead, one square at a time.',
    prompt: 'Tap the pawn, then move it to the star.',
  },
  {
    piece: 'rook',
    start: 56,
    target: 24,
    legal: [48, 40, 32, 24, 16, 8, 0, 57, 58, 59, 60, 61, 62, 63],
    title: 'The speedy Rook',
    rule: 'Rooks zoom in straight lines: up, down, left, or right.',
    prompt: 'Move the rook straight up to the star.',
  },
  {
    piece: 'bishop',
    start: 58,
    target: 30,
    legal: [49, 40, 33, 24, 51, 44, 37, 30, 23],
    title: 'The sliding Bishop',
    rule: 'Bishops slide diagonally, like going down a ramp.',
    prompt: 'Slide the bishop diagonally to the star.',
  },
  {
    piece: 'knight',
    start: 57,
    target: 42,
    legal: [40, 42, 51],
    title: 'The jumping Knight',
    rule: 'Knights jump in an L: two squares, then one sideways.',
    prompt: 'Make an L-jump to the star.',
  },
  {
    piece: 'queen',
    start: 59,
    target: 27,
    legal: [51, 43, 35, 27, 19, 11, 3, 50, 41, 32, 52, 45, 38, 31],
    title: 'The powerful Queen',
    rule: 'Queens move in straight lines or diagonally.',
    prompt: 'Move the queen straight up to the star.',
  },
  {
    piece: 'king',
    start: 60,
    target: 52,
    legal: [51, 52, 53, 59, 61],
    title: 'Protect the King',
    rule: 'Kings move one square in any direction. Keep your king safe!',
    prompt: 'Move the king one square to the star.',
  },
]

function lessonBoard(lesson: Lesson, moved = false): Board {
  const board: Board = Array.from({ length: 64 }, () => null)
  board[moved ? lesson.target : lesson.start] = { color: 'white', type: lesson.piece }
  return board
}

function describeMove(board: Board, move: Move): string {
  const piece = board[move.from]
  const target = board[move.to]
  if (!piece) return 'Nice move!'
  if (target) {
    return `${PIECE_NAMES[piece.type]} captures ${PIECE_NAMES[target.type]} on ${squareName(move.to)}!`
  }
  return `${PIECE_NAMES[piece.type]} moves to ${squareName(move.to)}.`
}

export function CarlosChess({ onBack, playSound }: Props) {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [lessonIndex, setLessonIndex] = useState(0)
  const [lessonSelected, setLessonSelected] = useState(false)
  const [lessonMoved, setLessonMoved] = useState(false)
  const [board, setBoard] = useState<Board>(() => createStartingBoard())
  const [turn, setTurn] = useState<Turn>('white')
  const [selected, setSelected] = useState<number | null>(null)
  const [legalMoves, setLegalMoves] = useState<Move[]>([])
  const [lastMove, setLastMove] = useState<Move | null>(null)
  const [hintMove, setHintMove] = useState<Move | null>(null)
  const [thinking, setThinking] = useState(false)
  const [coach, setCoach] = useState('White moves first. Tap one of your pieces!')
  const [result, setResult] = useState<'win' | 'try-again' | 'draw'>('win')
  const [undoBoard, setUndoBoard] = useState<Board | null>(null)

  const lesson = LESSONS[lessonIndex]!
  const matchLegalTargets = legalMoves.map((move) => move.to)
  const playerInCheck = screen === 'match' && isInCheck(board, 'white')

  const beginLessons = () => {
    setLessonIndex(0)
    setLessonSelected(false)
    setLessonMoved(false)
    setScreen('learn')
    playSound('happy')
  }

  const beginMatch = () => {
    setBoard(createStartingBoard())
    setTurn('white')
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setHintMove(null)
    setThinking(false)
    setUndoBoard(null)
    setCoach('You are White, so you go first. Tap a piece!')
    setScreen('match')
    playSound('celebrate')
  }

  const finishMatch = (outcome: 'win' | 'try-again' | 'draw') => {
    setResult(outcome)
    setThinking(false)
    setScreen('result')
    playSound(outcome === 'win' ? 'celebrate' : 'happy')
  }

  useEffect(() => {
    if (screen !== 'match' || turn !== 'black') return
    setThinking(true)
    setCoach('Carlos is thinking…')

    const timer = window.setTimeout(() => {
      const move = chooseCarlosMove(board)
      if (!move) {
        finishMatch(isInCheck(board, 'black') ? 'win' : 'draw')
        return
      }

      const next = makeMove(board, move)
      setBoard(next)
      setLastMove(move)
      setThinking(false)
      setTurn('white')
      setCoach(
        `${describeMove(board, move)} Your turn!${isInCheck(next, 'white') ? ' Your king is in check—move it to safety.' : ''}`,
      )
      playSound('tap')

      const replies = allLegalMoves(next, 'white')
      if (!replies.length) {
        window.setTimeout(
          () => finishMatch(isInCheck(next, 'white') ? 'try-again' : 'draw'),
          450,
        )
      }
    }, 750)

    return () => window.clearTimeout(timer)
    // `finishMatch` intentionally uses current state only through arguments.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, turn, board, playSound])

  const tapLessonSquare = (square: number) => {
    if (lessonMoved) return
    if (!lessonSelected) {
      if (square !== lesson.start) {
        playSound('tap')
        return
      }
      setLessonSelected(true)
      playSound('tap')
      return
    }

    if (square === lesson.target) {
      setLessonMoved(true)
      setLessonSelected(false)
      playSound('celebrate')
      return
    }

    if (lesson.legal.includes(square)) {
      setCoach(`That move works too! For this puzzle, find the glowing star.`)
      playSound('tap')
    }
  }

  const nextLesson = () => {
    if (lessonIndex >= LESSONS.length - 1) {
      beginMatch()
      return
    }
    setLessonIndex((index) => index + 1)
    setLessonSelected(false)
    setLessonMoved(false)
    playSound('happy')
  }

  const tapMatchSquare = (square: number) => {
    if (turn !== 'white' || thinking) return
    setHintMove(null)
    const piece = board[square]

    if (selected == null) {
      if (!piece || piece.color !== 'white') {
        setCoach('Your pieces are the light ones at the bottom. Tap one!')
        playSound('tap')
        return
      }
      const moves = legalMovesFor(board, square)
      setSelected(square)
      setLegalMoves(moves)
      setCoach(
        moves.length
          ? `${PIECE_NAMES[piece.type]} selected. Tap a glowing square.`
          : `That ${PIECE_NAMES[piece.type]} is blocked. Try another piece.`,
      )
      playSound('tap')
      return
    }

    if (piece?.color === 'white') {
      const moves = legalMovesFor(board, square)
      setSelected(square)
      setLegalMoves(moves)
      setCoach(`${PIECE_NAMES[piece.type]} selected. Choose a glowing square.`)
      playSound('tap')
      return
    }

    const move = legalMoves.find((candidate) => candidate.to === square)
    if (!move) {
      setCoach('Chess pieces can only move to the glowing squares.')
      playSound('tap')
      return
    }

    const before = board
    const next = makeMove(board, move)
    setUndoBoard(before)
    setBoard(next)
    setLastMove(move)
    setSelected(null)
    setLegalMoves([])
    setCoach(describeMove(board, move))
    setTurn('black')
    playSound(board[move.to] ? 'happy' : 'tap')

    const carlosMoves = allLegalMoves(next, 'black')
    if (!carlosMoves.length) {
      window.setTimeout(
        () => finishMatch(isInCheck(next, 'black') ? 'win' : 'draw'),
        450,
      )
    }
  }

  const showHint = () => {
    if (turn !== 'white' || thinking) return
    const moves = allLegalMoves(board, 'white')
    if (!moves.length) return
    const capture = moves.find((move) => board[move.to])
    const move = capture ?? moves[Math.floor(Math.random() * moves.length)]!
    setHintMove(move)
    setSelected(move.from)
    setLegalMoves(legalMovesFor(board, move.from))
    setCoach(
      `Coach Carlos says: try ${PIECE_NAMES[board[move.from]!.type]} from ${squareName(move.from)} to ${squareName(move.to)}.`,
    )
    playSound('happy')
  }

  const undoTurn = () => {
    if (!undoBoard || thinking || turn !== 'white') return
    setBoard(undoBoard)
    setUndoBoard(null)
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setHintMove(null)
    setCoach('No worries—try a different move!')
    playSound('whoosh')
  }

  if (screen === 'welcome') {
    return (
      <div className="carlos-chess-shell">
        <header className="carlos-chess-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="carlos-chess-title">Chess with Carlos</h1>
          <span className="carlos-chess-chip">♟ Coach</span>
        </header>

        <div className="carlos-chess-welcome">
          <ChessCarlos size={205} cheering />
          <div className="carlos-chess-bubble">
            <strong>Hi, chess explorer!</strong>
            <span>I’ll teach you the pieces, then we can play together.</span>
          </div>
          <div className="carlos-chess-welcome-actions">
            <button type="button" className="chess-primary" onClick={beginLessons}>
              🎓 Learn the pieces
            </button>
            <button type="button" className="chess-secondary" onClick={beginMatch}>
              ♟ Play Carlos
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'learn') {
    const learnBoard = lessonBoard(lesson, lessonMoved)
    return (
      <div className="carlos-chess-shell">
        <header className="carlos-chess-top">
          <button type="button" className="back-btn" onClick={() => setScreen('welcome')}>
            ← Menu
          </button>
          <h1 className="carlos-chess-title">{lesson.title}</h1>
          <span className="carlos-chess-chip">
            {lessonIndex + 1} / {LESSONS.length}
          </span>
        </header>

        <div className="chess-lesson-layout">
          <aside className="chess-coach-panel">
            <ChessCarlos size={130} cheering={lessonMoved} />
            <div className="carlos-chess-bubble small">
              <strong>{lessonMoved ? 'Brilliant move!' : lesson.rule}</strong>
              <span>{lessonMoved ? `You learned the ${PIECE_NAMES[lesson.piece]}!` : lesson.prompt}</span>
            </div>
          </aside>

          <div className="chess-board-wrap lesson-board">
            <ChessBoard
              board={learnBoard}
              selected={lessonSelected && !lessonMoved ? lesson.start : null}
              legalTargets={lessonSelected && !lessonMoved ? lesson.legal : []}
              starSquare={lessonMoved ? null : lesson.target}
              onSquare={tapLessonSquare}
              disabled={lessonMoved}
            />
          </div>

          <div className="chess-lesson-actions">
            {!lessonSelected && !lessonMoved && (
              <button
                type="button"
                className="chess-primary"
                onClick={() => {
                  setLessonSelected(true)
                  playSound('tap')
                }}
              >
                Tap the {PIECE_NAMES[lesson.piece]}
              </button>
            )}
            {lessonMoved && (
              <button type="button" className="chess-primary" onClick={nextLesson}>
                {lessonIndex === LESSONS.length - 1 ? 'Play Carlos! →' : 'Next piece →'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'result') {
    const title =
      result === 'win'
        ? 'You checkmated Carlos!'
        : result === 'draw'
          ? 'A clever draw!'
          : 'Great game!'
    const detail =
      result === 'win'
        ? 'Amazing thinking, chess star!'
        : result === 'draw'
          ? 'Nobody lost—that is called a draw.'
          : 'Carlos found checkmate. Every game makes your brain stronger!'

    return (
      <div className="carlos-chess-shell">
        <header className="carlos-chess-top">
          <button type="button" className="back-btn" onClick={onBack}>
            ← Games
          </button>
          <h1 className="carlos-chess-title">Game over</h1>
          <span className="carlos-chess-chip">★</span>
        </header>
        <div className="chess-result">
          <div className="chess-result-title">{title}</div>
          <ChessCarlos size={210} cheering />
          <p>{detail}</p>
          <div className="chess-result-actions">
            <button type="button" className="chess-primary" onClick={beginMatch}>
              Play again
            </button>
            <button type="button" className="chess-secondary" onClick={beginLessons}>
              Practice pieces
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="carlos-chess-shell">
      <header className="carlos-chess-top">
        <button type="button" className="back-btn" onClick={() => setScreen('welcome')}>
          ← Menu
        </button>
        <h1 className="carlos-chess-title">
          Your first match
          <small>You are White</small>
        </h1>
        <span className={`carlos-chess-chip ${playerInCheck ? 'check' : ''}`}>
          {playerInCheck ? 'Check!' : turn === 'white' ? 'Your turn' : 'Carlos'}
        </span>
      </header>

      <div className="chess-match-layout">
        <aside className="chess-match-coach">
          <ChessCarlos size={125} thinking={thinking} />
          <div className="carlos-chess-bubble small">
            <span>{coach}</span>
          </div>
        </aside>

        <div className="chess-board-wrap">
          <ChessBoard
            board={board}
            selected={selected}
            legalTargets={matchLegalTargets}
            lastMove={lastMove}
            hintMove={hintMove}
            onSquare={tapMatchSquare}
            disabled={turn !== 'white' || thinking}
          />
        </div>

        <div className="chess-match-actions">
          <button type="button" className="chess-hint-btn" onClick={showHint} disabled={turn !== 'white'}>
            💡 Show me a move
          </button>
          <button type="button" className="chess-undo-btn" onClick={undoTurn} disabled={!undoBoard || thinking}>
            ↶ Try again
          </button>
        </div>
      </div>
    </div>
  )
}
