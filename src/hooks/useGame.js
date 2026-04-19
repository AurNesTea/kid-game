import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateMathQuestions } from '../generators/generateMathQuestions'

/**
 * useGame — 管理整場遊戲狀態
 * @param {'addition' | 'subtraction'} mode
 */
export function useGame(mode) {
  const navigate = useNavigate()
  const [questions] = useState(() => generateMathQuestions(mode, 10, 3))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = questions[currentIndex]

  const submitAnswer = useCallback(() => {
    if (feedback !== null) return // 防止重複提交
    const parsed = parseInt(userAnswer, 10)
    const isCorrect = parsed === currentQuestion.answer
    const newScore = isCorrect ? score + 10 : score

    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(newScore)

    // 1.5 秒後跳下一題 or 結束
    setTimeout(() => {
      setFeedback(null)
      setUserAnswer('')

      const nextIndex = currentIndex + 1
      if (nextIndex >= questions.length) {
        setIsFinished(true)
        navigate('/result', {
          state: { score: newScore, total: questions.length * 10, mode },
        })
      } else {
        setCurrentIndex(nextIndex)
      }
    }, 1500)
  }, [feedback, userAnswer, currentQuestion, score, currentIndex, questions, mode, navigate])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') submitAnswer()
    },
    [submitAnswer]
  )

  return {
    currentQuestion,
    currentIndex,
    total: questions.length,
    score,
    userAnswer,
    setUserAnswer,
    feedback,
    isFinished,
    submitAnswer,
    handleKeyDown,
  }
}
