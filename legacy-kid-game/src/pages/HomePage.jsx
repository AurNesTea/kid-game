import { useNavigate } from 'react-router-dom'
import { grades } from '../data/registry'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-black text-indigo-700 mb-2">學習大冒險</h1>
        <p className="text-lg text-purple-500 font-medium">選擇你目前的年級，開始挑戰吧！</p>
      </div>

      {/* Grade Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {grades.map((grade) => (
          <button
            key={grade.id}
            onClick={() => navigate(`/subject/${grade.id}`)}
            className={`
              group relative flex flex-col items-center gap-3 p-8 rounded-3xl
              bg-gradient-to-br ${grade.color}
              text-white shadow-xl
              transform transition-all duration-200
              hover:scale-105 hover:shadow-2xl active:scale-95
            `}
          >
            <span className="text-5xl group-hover:-translate-y-2 transition-transform duration-300">{grade.icon}</span>
            <span className="text-2xl font-black">{grade.name}</span>
            <span className="text-sm opacity-90 font-medium">{grade.desc}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-4">準備好迎接挑戰了嗎？ 🎯</p>
    </div>
  )
}
