import { generateMathQuestions } from '../../../generators/mathGenerator';

/**
 * 一年級減法：1-20 內，保底 3 題借位
 */
export const getQuestions = () => {
  return generateMathQuestions({
    type: 'subtraction',
    rangeA: [1, 20],
    rangeB: [1, 20],
    total: 10,
    minSpecial: 3,
    resultRange: [0, 20]
  });
};
