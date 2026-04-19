import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { getModeConfig } from '../data/registry'
import QuestionCard from '../components/QuestionCard'
import ScoreBar from '../components/ScoreBar'

export default function GamePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mode = location.state?.mode ?? 'addition'
  const grade = location.state?.grade
  const subject = location.state?.subject
  const inputRef = useRef(null)

  // Route Guard：防止直接輸入 URL 進入遊戲頁
  if (!location.state?.mode) {
    return <Navigate to="/" replace />
  }

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
  } = useGame(mode, grade, subject)

  // 每題切換後自動 focus input
  useEffect(() => {
    if (feedback === null) {
      inputRef.current?.focus()
    }
  }, [currentIndex, feedback])

  if (!currentQuestion) return null

  const { label: modeLabel, color: modeColor } = getModeConfig(grade, subject, mode)


  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 gap-6">

      <ScoreBar
        onHomeClick={() => grade ? navigate(`/subject/${grade}`) : navigate('/')}
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
