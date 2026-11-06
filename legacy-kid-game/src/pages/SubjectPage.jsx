import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubjectsByGrade, getUnits, getGradeName } from '../data/registry'

export default function SubjectPage() {
  const { grade } = useParams()
  const navigate = useNavigate()
  
  // 預設選擇的科目
  const [activeSubject, setActiveSubject] = useState('math')

  const subjectsData = getSubjectsByGrade(grade)
  const currentUnits = getUnits(grade, activeSubject)

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-gray-50">
      {/* 頂部導航列 */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-500 hover:text-indigo-600 bg-white rounded-full shadow-sm font-bold transition-colors"
        >
          ← 回首頁
        </button>
        <h1 className="text-2xl font-black text-indigo-800">
          {getGradeName(grade)} 的學習任務
        </h1>
        <div className="w-24"></div> {/* 佔位元素，保持標題置中 */}
      </div>

      {/* 科目選擇頁籤 */}
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm">
        {subjectsData.map((subject) => (
          <button
            key={subject.id}
            disabled={subject.disabled}
            onClick={() => setActiveSubject(subject.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all
              ${activeSubject === subject.id 
                ? 'bg-indigo-100 text-indigo-700 shadow-inner' 
                : subject.disabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'}
            `}
          >
            <span>{subject.icon}</span>
            <span>{subject.name}</span>
            {subject.disabled && <span className="text-xs ml-1 bg-gray-200 px-2 py-1 rounded-full">未開放</span>}
          </button>
        ))}
      </div>

      {/* 單元選擇卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {currentUnits.map((unit) => (
          <button
            key={unit.id}
            onClick={() => navigate('/game', { state: { mode: unit.id, grade, subject: activeSubject } })}
            className={`
              group relative flex flex-col items-center gap-3 p-8 rounded-3xl
              bg-gradient-to-br ${unit.color}
              text-white shadow-xl
              transform transition-all duration-200
              hover:scale-105 hover:shadow-2xl active:scale-95
            `}
          >
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{unit.icon}</span>
            <span className="text-2xl font-black">{unit.name}</span>
            <span className="text-sm opacity-90 font-medium">{unit.desc}</span>
          </button>
        ))}
      </div>
      
      {currentUnits.length === 0 && (
        <div className="text-center py-12 text-gray-400 font-medium">
          這個科目目前還沒有單元喔！
        </div>
      )}
    </div>
  )
}
