import { useLocation, useNavigate } from 'react-router-dom'
import Confetti from '../components/Confetti'

const REMARKS = [
  { min: 100, emoji: '🏆', title: '滿分！完美！', sub: '你是數學小天才，太厲害了！' },
  { min: 80, emoji: '🌟', title: '答得很棒！', sub: '繼續練習，你一定能拿滿分！' },
  { min: 60, emoji: '👍', title: '不錯喔！', sub: '再多練幾次，你會越來越強的！' },
  { min: 40, emoji: '💪', title: '加油！', sub: '沒關係，失敗是成功之母，繼續挑戰！' },
  { min: 20, emoji: '😊', title: '繼續努力！', sub: '每次練習都讓你進步一點點！' },
  { min: 0, emoji: '🌈', title: '不要放棄！', sub: '只要堅持練習，你一定會進步的！' },
]

function getRemark(score) {
  return REMARKS.find((r) => score >= r.min) ?? REMARKS[REMARKS.length - 1]
}


export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const score = location.state?.score ?? 0
  const total = location.state?.total ?? 100
  const mode = location.state?.mode ?? 'addition'

  const percentage = Math.round((score / total) * 100)
  const remark = getRemark(score)
  const showConfetti = score >= 80

  const modeLabel = mode === 'addition' ? '加法練習' : '減法練習'
  const modeColor = mode === 'addition'
    ? 'from-green-400 to-emerald-600'
    : 'from-rose-400 to-pink-600'

  // Score ring color
  const ringColor =
    score >= 80 ? 'stroke-yellow-400' : score >= 60 ? 'stroke-indigo-400' : 'stroke-rose-400'

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - score / total)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 gap-8">
      <Confetti trigger={showConfetti} />

      {/* Mode Badge */}
      <span className={`px-5 py-1.5 rounded-full text-white font-bold bg-gradient-to-r ${modeColor} shadow-md`}>
        {modeLabel}
      </span>

      {/* Score Ring */}
      <div className="relative flex items-center justify-center w-44 h-44">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            className={ringColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-4xl font-black text-indigo-800">{score}</div>
          <div className="text-sm text-gray-400 font-medium">/ {total}</div>
        </div>
      </div>

      {/* Remark Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center w-full max-w-sm">
        <div className="text-6xl mb-3">{remark.emoji}</div>
        <h1 className="text-2xl font-black text-indigo-800 mb-2">{remark.title}</h1>
        <p className="text-gray-500 font-medium">{remark.sub}</p>
        {showConfetti && (
          <div className="mt-4 text-yellow-500 font-bold animate-bounce">🎊 太棒了！撒花慶祝！</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          id="btn-replay"
          onClick={() => navigate('/game', { state: { mode } })}
          className={`
            flex-1 py-4 rounded-2xl text-white font-black text-lg
            bg-gradient-to-r ${modeColor}
            transform transition-all hover:scale-105 active:scale-95 shadow-lg
          `}
        >
          🔄 再玩一次
        </button>
        <button
          id="btn-home-result"
          onClick={() => navigate('/')}
          className="
            flex-1 py-4 rounded-2xl font-black text-lg
            border-2 border-indigo-300 text-indigo-600
            bg-white hover:bg-indigo-50
            transform transition-all hover:scale-105 active:scale-95 shadow-md
          "
        >
          🏠 回首頁
        </button>
      </div>
    </div>
  )
}
