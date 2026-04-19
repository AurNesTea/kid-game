// src/data/registry.js

import { getQuestions as getG1Addition } from './grade1/math/addition';
import { getQuestions as getG1Subtraction } from './grade1/math/subtraction';

export const grades = [
  { id: 'grade1', name: '一年級', icon: '🎒', color: 'from-blue-400 to-indigo-600', desc: '基礎加減法' },
  { id: 'grade2', name: '二年級', icon: '✏️', color: 'from-emerald-400 to-green-600', desc: '進階加減與乘法' },
  { id: 'grade3', name: '三年級', icon: '📐', color: 'from-amber-400 to-orange-600', desc: '乘除法與分數' },
  { id: 'grade4', name: '四年級', icon: '🔬', color: 'from-rose-400 to-pink-600', desc: '四則運算與小數' },
];

export const getSubjectsByGrade = (gradeId) => {
  return [
    { id: 'math', name: '數學', icon: '🧮', disabled: false },
    { id: 'english', name: '英文', icon: '🔤', disabled: true },
  ];
};

export const getUnits = (gradeId, subjectId) => {
  if (gradeId === 'grade1' && subjectId === 'math') {
    return [
      { id: 'addition', name: '加法練習', icon: '➕', desc: '1~20 內加法，保底 3 題進位', color: 'from-green-400 to-emerald-600', getQuestions: getG1Addition },
      { id: 'subtraction', name: '減法練習', icon: '➖', desc: '1~20 內減法，保底 3 題借位', color: 'from-rose-400 to-pink-600', getQuestions: getG1Subtraction }
    ];
  }
  return [];
};

/**
 * 根據年級、科目、unitId 查詢顯示用設定（標籤與漸層色）
 * 統一給 GamePage / ResultPage 使用，避免各自 if/else 硬編碼
 */
export const getModeConfig = (gradeId, subjectId, unitId) => {
  const unit = getUnits(gradeId, subjectId).find(u => u.id === unitId);
  if (unit) return { label: unit.name, color: unit.color };
  // fallback：未知單元給預設值
  return { label: unitId, color: 'from-indigo-400 to-blue-600' };
};

export const getGradeName = (gradeId) => {
  const grade = grades.find(g => g.id === gradeId);
  return grade ? grade.name : '未知年級';
};
