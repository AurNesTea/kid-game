const feedbackConfig = (question) => ({
  correct: {
    text: '答對了！🎉',
    bg: 'bg-green-100',
    border: 'border-green-400',
    text_color: 'text-green-700',
  },
  wrong: {
    text: `正確答案是 ${question?.answer} 😅`,
    bg: 'bg-red-100',
    border: 'border-red-400',
    text_color: 'text-red-700',
  },
})

/**
 * QuestionCard
 * Props:
 *   question     { a, b, op, answer }
 *   mode         'addition' | 'subtraction'
 *   modeColor    Tailwind gradient string
 *   userAnswer   string
 *   setUserAnswer (val: string) => void
 *   handleKeyDown KeyboardEvent handler
 *   submitAnswer  () => void
 *   feedback     'correct' | 'wrong' | null
 *   inputRef     React ref for auto-focus
 */
export default function QuestionCard({
  question,
  mode,
  modeColor,
  userAnswer,
  setUserAnswer,
  handleKeyDown,
  submitAnswer,
  feedback,
  inputRef,
}) {
  if (!question) return null

  const { a, b, op } = question
  const config = feedbackConfig(question)

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8 mt-4">
      {/* Question Display */}
      <div className="flex items-center gap-6 text-6xl font-black text-indigo-800 select-none">
        <span>{a}</span>
        <span className={mode === 'addition' ? 'text-green-500' : 'text-rose-500'}>{op}</span>
        <span>{b}</span>
        <span className="text-gray-400">=</span>
        <span className="text-gray-300">?</span>
      </div>

      {/* Input */}
      <div className="flex items-center gap-3">
        <input
          id="answer-input"
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={feedback !== null}
          placeholder="答案"
          className="
            w-36 text-center text-4xl font-black border-4 border-indigo-300
            rounded-2xl py-3 px-4 outline-none
            focus:border-indigo-500 transition-colors
            disabled:bg-gray-50 disabled:cursor-not-allowed
          "
        />
        <button
          id="btn-submit"
          onClick={submitAnswer}
          disabled={feedback !== null || userAnswer === ''}
          className={`
            px-6 py-3 rounded-2xl text-white font-black text-lg
            bg-gradient-to-r ${modeColor}
            transform transition-all duration-150
            hover:scale-105 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
            shadow-lg
          `}
        >
          確認 ✓
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`
            w-full text-center py-3 px-4 rounded-2xl border-2 font-bold text-lg
            ${config[feedback].bg}
            ${config[feedback].border}
            ${config[feedback].text_color}
            animate-bounce
          `}
        >
          {config[feedback].text}
        </div>
      )}
    </div>
  )
}
