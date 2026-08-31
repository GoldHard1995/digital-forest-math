export type FirstStageSection = '基礎回想' | '核心練習' | '綜合或挑戰';

export type NumberLinePoint = {
  value: number;
  label?: string;
};

export type NumberLineArrow = {
  from: number;
  to: number;
};

export type NumberLineConfig = {
  points: NumberLinePoint[];
  arrows?: NumberLineArrow[];
  connectPoints?: boolean;
};

export type FirstStageQuestion = {
  id: string;
  section: FirstStageSection;
  difficulty: 1 | 2 | 3;
  prompt: string;
  answer: string;
  answerDisplay: string;
  hint: string;
  solution: string;
  numberLine?: NumberLineConfig;
  inputLabel?: string;
};

export const firstStageQuestions: FirstStageQuestion[] = [
  {
    id: 'NF-B01',
    section: '基礎回想',
    difficulty: 1,
    prompt: '點 P 在 0 的右方 6 個單位，P 代表甚麼數？',
    answer: '6',
    answerDisplay: '＋6',
    hint: '先看 0 的哪一邊，再決定正負號。',
    solution: '右方是正方向，距離 0 有 6 個單位，所以 P 代表 ＋6。',
    numberLine: { points: [{ value: 0, label: '0' }, { value: 6, label: 'P' }] },
  },
  {
    id: 'NF-B02',
    section: '基礎回想',
    difficulty: 1,
    prompt: '點 Q 在 0 的左方 7 個單位，Q 代表甚麼數？',
    answer: '-7',
    answerDisplay: '−7',
    hint: '左方代表負方向；再數出距離 0 有幾格。',
    solution: '左方是負方向，距離 0 有 7 個單位，所以 Q 代表 −7。',
    numberLine: { points: [{ value: 0, label: '0' }, { value: -7, label: 'Q' }] },
  },
  {
    id: 'NF-B03',
    section: '基礎回想',
    difficulty: 1,
    prompt: '點 R 代表 −4，R 與 0 的距離是多少個單位？',
    answer: '4',
    answerDisplay: '4',
    hint: '距離只看相隔多少格，不看向左還是向右。',
    solution: '−4 在 0 的左方 4 格，所以 R 與 0 的距離是 4 個單位。',
    numberLine: { points: [{ value: 0, label: '0' }, { value: -4, label: 'R' }], connectPoints: true },
  },
  {
    id: 'NF-B04',
    section: '基礎回想',
    difficulty: 1,
    prompt: '−8 的相反數是多少？',
    answer: '8',
    answerDisplay: '＋8',
    hint: '相反數與原數距離 0 相同，但方向相反。',
    solution: '−8 在 0 的左方 8 格，相反數要在右方 8 格，所以是 ＋8。',
    numberLine: { points: [{ value: -8, label: '−8' }, { value: 8, label: '＋8' }], connectPoints: true },
  },
  {
    id: 'NF-C01',
    section: '核心練習',
    difficulty: 2,
    prompt: '起點為 −3，向右移 5 格，終點是多少？',
    answer: '2',
    answerDisplay: '＋2',
    hint: '向右移表示沿正方向前進，從 −3 數 5 格。',
    solution: '由 −3 向右 5 格：−2、−1、0、＋1、＋2，所以終點是 ＋2。',
    numberLine: { points: [{ value: -3, label: '起點' }, { value: 2, label: '終點' }], arrows: [{ from: -3, to: 2 }] },
  },
  {
    id: 'NF-C02',
    section: '核心練習',
    difficulty: 2,
    prompt: '起點為 ＋6，向左移 7 格，終點是多少？',
    answer: '-1',
    answerDisplay: '−1',
    hint: '向左移表示沿負方向前進，從 ＋6 倒數 7 格。',
    solution: '由 ＋6 向左 7 格：＋5、＋4、＋3、＋2、＋1、0、−1，所以終點是 −1。',
    numberLine: { points: [{ value: 6, label: '起點' }, { value: -1, label: '終點' }], arrows: [{ from: 6, to: -1 }] },
  },
  {
    id: 'NF-C03',
    section: '核心練習',
    difficulty: 2,
    prompt: '點 A 在 −6，點 B 在 ＋1，A 與 B 相距多少格？',
    answer: '7',
    answerDisplay: '7',
    hint: '在數線上由 −6 數到 ＋1，數出相隔的格數。',
    solution: '由 −6 到 0 是 6 格，再由 0 到 ＋1 是 1 格，共 7 格。',
    numberLine: { points: [{ value: -6, label: 'A' }, { value: 1, label: 'B' }], arrows: [{ from: -6, to: 1 }], connectPoints: true },
  },
  {
    id: 'NF-C04',
    section: '核心練習',
    difficulty: 2,
    prompt: '以有向數表示：溫度下降 8 °C。',
    answer: '-8',
    answerDisplay: '−8',
    hint: '下降表示數值向負方向改變。',
    solution: '下降是負方向，變化量為 8 °C，所以用有向數表示為 −8。',
    inputLabel: '請只輸入有向數，不要輸入單位。',
  },
  {
    id: 'NF-C05',
    section: '核心練習',
    difficulty: 2,
    prompt: '以有向數表示：獲利 ＄250。',
    answer: '250',
    answerDisplay: '＋250',
    hint: '獲利表示增加，增加要用正號。',
    solution: '獲利是正方向的增加，所以用有向數表示為 ＋250。',
    inputLabel: '請只輸入有向數，不要輸入貨幣符號。',
  },
  {
    id: 'NF-C06',
    section: '核心練習',
    difficulty: 2,
    prompt: '以有向數表示：向西移動 5 m（向東為正方向）。',
    answer: '-5',
    answerDisplay: '−5',
    hint: '既然向東是正方向，向西就是相反的負方向。',
    solution: '向西與正方向相反，移動 5 m，所以用有向數表示為 −5。',
    inputLabel: '請只輸入有向數，不要輸入單位。',
  },
  {
    id: 'NF-H01',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '點 A 在 −4，點 B 在 A 的右方 11 格。B 代表甚麼數？',
    answer: '7',
    answerDisplay: '＋7',
    hint: '向右是正方向；由 −4 向右數 11 格，先回到 0，再繼續數。',
    solution: '由 −4 向右 4 格到 0，剩下 7 格到 ＋7，所以 B 代表 ＋7。',
    inputLabel: '請只輸入 B 代表的有向數。',
  },
  {
    id: 'NF-H02',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '點 P 在 −7，點 Q 在 ＋8。P 與 Q 相距多少格？',
    answer: '15',
    answerDisplay: '15',
    hint: '先由 −7 數到 0，再由 0 數到 ＋8，把兩段距離合起來。',
    solution: '由 −7 到 0 是 7 格，由 0 到 ＋8 是 8 格，所以 P 與 Q 相距 7＋8＝15 格。',
    inputLabel: '請只輸入相距的格數。',
  },
  {
    id: 'NF-H03',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '起點在 ＋6，向左移 13 格。終點在哪個數？',
    answer: '-7',
    answerDisplay: '−7',
    hint: '向左是負方向；由 ＋6 數 6 格先到 0，再繼續數 7 格。',
    solution: '由 ＋6 向左 6 格到 0，再向左 7 格到 −7，所以終點是 −7。',
    inputLabel: '請只輸入終點代表的有向數。',
  },
];
