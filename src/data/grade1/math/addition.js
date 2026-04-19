import { generateMathQuestions } from '../../../generators/mathGenerator';

/**
 * 一年級加法：1-20 內，保底 3 題進位
 */
export const getQuestions = () => {
  return generateMathQuestions({
    type: 'addition',
    rangeA: [1, 20],
    rangeB: [1, 20],
    total: 10,
    minSpecial: 3,
    resultRange: [1, 20]
  });
};
