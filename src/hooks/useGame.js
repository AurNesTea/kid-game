import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUnits } from '../data/registry'
import { generateMathQuestions } from '../generators/generateMathQuestions'

/**
 * useGame — 管理整場遊戲狀態
 * @param {string} mode 單元 ID
 * @param {string} grade 年級 ID
 * @param {string} subject 科目 ID
 */
export function useGame(mode, grade, subject) {
  const navigate = useNavigate()
  const timerRef = useRef(null)
  const [questions] = useState(() => {
    const units = getUnits(grade, subject)
    const unit = units.find(u => u.id === mode)
    
    // 如果單元有定義專屬出題邏輯，則使用它
    if (unit && unit.getQuestions) {
      return unit.getQuestions()
    }
    
    // 否則回退到舊有引擎
    return generateMathQuestions(mode, 10, 3)
  })
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
    timerRef.current = setTimeout(() => {
      setFeedback(null)
      setUserAnswer('')

      const nextIndex = currentIndex + 1
      if (nextIndex >= questions.length) {
        setIsFinished(true)
        navigate('/result', {
          state: { score: newScore, total: questions.length * 10, mode, grade, subject },
        })
      } else {
        setCurrentIndex(nextIndex)
      }
    }, 1500)
  }, [feedback, userAnswer, currentQuestion, score, currentIndex, questions, mode, navigate])

  // 組件卸載時清除尚未執行的 timer，防止記憶體洩漏與非預期 navigate
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

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
