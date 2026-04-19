export default function ScoreBar({ onHomeClick, modeLabel, modeColor, score, currentIndex, total }) {
  const progress = (currentIndex / total) * 100

  return (
    <>
      {/* Top Bar */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <button
          id="btn-home"
          onClick={onHomeClick}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          ← 回首頁
        </button>
        <span className={`px-4 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${modeColor}`}>
          {modeLabel}
        </span>
        <span className="text-indigo-700 font-black text-lg">{score} 分</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-lg">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>第 {currentIndex + 1} 題</span>
          <span>共 {total} 題</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${modeColor} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  )
}
