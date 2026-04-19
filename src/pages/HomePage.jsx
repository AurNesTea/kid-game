import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🧮</div>
        <h1 className="text-4xl font-black text-indigo-700 mb-2">數學練習遊戲</h1>
        <p className="text-lg text-purple-500 font-medium">選擇你要練習的題型！</p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        <button
          id="btn-addition"
          onClick={() => navigate('/game', { state: { mode: 'addition' } })}
          className="
            group relative flex flex-col items-center gap-3 p-8 rounded-3xl
            bg-gradient-to-br from-green-400 to-emerald-600
            text-white shadow-xl
            transform transition-all duration-200
            hover:scale-105 hover:shadow-2xl active:scale-95
          "
        >
          <span className="text-5xl">➕</span>
          <span className="text-2xl font-black">加法練習</span>
          <span className="text-sm opacity-80">進位題保底 3 題</span>
        </button>

        <button
          id="btn-subtraction"
          onClick={() => navigate('/game', { state: { mode: 'subtraction' } })}
          className="
            group relative flex flex-col items-center gap-3 p-8 rounded-3xl
            bg-gradient-to-br from-rose-400 to-pink-600
            text-white shadow-xl
            transform transition-all duration-200
            hover:scale-105 hover:shadow-2xl active:scale-95
          "
        >
          <span className="text-5xl">➖</span>
          <span className="text-2xl font-black">減法練習</span>
          <span className="text-sm opacity-80">借位題保底 3 題</span>
        </button>
      </div>

      {/* Footer hint */}
      <p className="text-sm text-gray-400">每輪 10 題，每題 10 分，滿分 100 分 🎯</p>
    </div>
  )
}
