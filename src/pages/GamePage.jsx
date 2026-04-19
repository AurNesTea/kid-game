import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import QuestionCard from '../components/QuestionCard'
import ScoreBar from '../components/ScoreBar'

export default function GamePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mode = location.state?.mode ?? 'addition'
  const inputRef = useRef(null)

  const {
    currentQuestion,
    currentIndex,
    total,
    score,
    userAnswer,
    setUserAnswer,
    feedback,
    submitAnswer,
    handleKeyDown,
  } = useGame(mode)

  // 每題切換後自動 focus input
  useEffect(() => {
    if (feedback === null) {
      inputRef.current?.focus()
    }
  }, [currentIndex, feedback])

  if (!currentQuestion) return null

  const modeLabel = mode === 'addition' ? '加法練習' : '減法練習'
  const modeColor = mode === 'addition'
    ? 'from-green-400 to-emerald-600'
    : 'from-rose-400 to-pink-600'


  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 gap-6">

      <ScoreBar
        onHomeClick={() => navigate('/')}
        modeLabel={modeLabel}
        modeColor={modeColor}
        score={score}
        currentIndex={currentIndex}
        total={total}
      />

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        mode={mode}
        modeColor={modeColor}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        handleKeyDown={handleKeyDown}
        submitAnswer={submitAnswer}
        feedback={feedback}
        inputRef={inputRef}
      />

      {/* Hint */}
      <p className="text-gray-400 text-sm">按 Enter 或點「確認」提交答案</p>
    </div>
  )
}
