export type SecondStageSection = '基礎回想' | '核心練習' | '綜合或挑戰';

export type ComparisonInteraction = {
  type: 'comparison';
  answer: '＜' | '＞';
};

export type DragOrderInteraction = {
  type: 'drag-order';
  direction: '由小至大' | '由大至小';
  numbers: string[];
  answer: string[];
};

export type SecondStageQuestion = {
  id: string;
  section: SecondStageSection;
  difficulty: 1 | 2 | 3;
  prompt: string;
  answerDisplay: string;
  hint: string;
  solution: string;
  interaction: ComparisonInteraction | DragOrderInteraction;
};

export const secondStageQuestions: SecondStageQuestion[] = [
  {
    id: 'NF2-A01',
    section: '基礎回想',
    difficulty: 1,
    prompt: '在適當位置填上符號：−3 ___ ＋4',
    answerDisplay: '−3 ＜ ＋4',
    hint: '數線上較左的數較小，較右的數較大。',
    solution: '−3 在 ＋4 的左方，所以 −3 ＜ ＋4。',
    interaction: { type: 'comparison', answer: '＜' },
  },
  {
    id: 'NF2-A02',
    section: '基礎回想',
    difficulty: 1,
    prompt: '在適當位置填上符號：0 ___ −6',
    answerDisplay: '0 ＞ −6',
    hint: '0 在負數的右方。',
    solution: '0 在 −6 的右方，所以 0 ＞ −6。',
    interaction: { type: 'comparison', answer: '＞' },
  },
  {
    id: 'NF2-A03',
    section: '基礎回想',
    difficulty: 1,
    prompt: '在適當位置填上符號：＋7 ___ −8',
    answerDisplay: '＋7 ＞ −8',
    hint: '任何正數都大於任何負數。',
    solution: '＋7 是正數，−8 是負數，所以 ＋7 ＞ −8。',
    interaction: { type: 'comparison', answer: '＞' },
  },
  {
    id: 'NF2-A04',
    section: '基礎回想',
    difficulty: 1,
    prompt: '在適當位置填上符號：−8 ___ −5',
    answerDisplay: '−8 ＜ −5',
    hint: '負數中，越接近 0 的數越大。',
    solution: '−5 比 −8 接近 0，所以 −8 ＜ −5。',
    interaction: { type: 'comparison', answer: '＜' },
  },
  {
    id: 'NF2-B01',
    section: '核心練習',
    difficulty: 2,
    prompt: '將以下數字由小至大排列。',
    answerDisplay: '−7 ＜ −2 ＜ 0 ＜ ＋3 ＜ ＋6',
    hint: '先找出最左方的負數，再依次向右排列。',
    solution: '由數線左至右排列，答案是 −7 ＜ −2 ＜ 0 ＜ ＋3 ＜ ＋6。',
    interaction: { type: 'drag-order', direction: '由小至大', numbers: ['＋3', '−7', '0', '−2', '＋6'], answer: ['−7', '−2', '0', '＋3', '＋6'] },
  },
  {
    id: 'NF2-B02',
    section: '核心練習',
    difficulty: 2,
    prompt: '將以下數字由大至小排列。',
    answerDisplay: '＋8 ＞ ＋2 ＞ 0 ＞ −1 ＞ −5',
    hint: '由數線右方開始，逐個向左排列。',
    solution: '由數線右至左排列，答案是 ＋8 ＞ ＋2 ＞ 0 ＞ −1 ＞ −5。',
    interaction: { type: 'drag-order', direction: '由大至小', numbers: ['−1', '＋8', '−5', '＋2', '0'], answer: ['＋8', '＋2', '0', '−1', '−5'] },
  },
  {
    id: 'NF2-B03',
    section: '核心練習',
    difficulty: 2,
    prompt: '將以下數字由小至大排列。',
    answerDisplay: '−9 ＜ −6 ＜ −3 ＜ ＋1 ＜ ＋4',
    hint: '負數在 0 左方，並由最左方的數開始排列。',
    solution: '−9、−6、−3、＋1、＋4 由小至大排列，答案如上。',
    interaction: { type: 'drag-order', direction: '由小至大', numbers: ['＋4', '−9', '＋1', '−6', '−3'], answer: ['−9', '−6', '−3', '＋1', '＋4'] },
  },
  {
    id: 'NF2-B04',
    section: '核心練習',
    difficulty: 2,
    prompt: '將以下數字由小至大排列。',
    answerDisplay: '−4 ＜ −1 ＜ 0 ＜ ＋2 ＜ ＋5',
    hint: '先排列負數，再放 0，最後排列正數。',
    solution: '負數 −4 ＜ −1，接著是 0，再接 ＋2 ＜ ＋5。',
    interaction: { type: 'drag-order', direction: '由小至大', numbers: ['＋5', '−4', '＋2', '−1', '0'], answer: ['−4', '−1', '0', '＋2', '＋5'] },
  },
  {
    id: 'NF2-B05',
    section: '核心練習',
    difficulty: 2,
    prompt: '將以下數字由大至小排列。',
    answerDisplay: '＋9 ＞ ＋3 ＞ −2 ＞ −5 ＞ −8',
    hint: '由數線最右方開始，正數先於負數。',
    solution: '先排列正數 ＋9 ＞ ＋3，再排列負數 −2 ＞ −5 ＞ −8。',
    interaction: { type: 'drag-order', direction: '由大至小', numbers: ['−2', '＋9', '−8', '＋3', '−5'], answer: ['＋9', '＋3', '−2', '−5', '−8'] },
  },
  {
    id: 'NF2-B06',
    section: '核心練習',
    difficulty: 2,
    prompt: '將以下數字由小至大排列。',
    answerDisplay: '−7 ＜ −3 ＜ 0 ＜ ＋4 ＜ ＋7',
    hint: '數線左方的數較小，右方的數較大。',
    solution: '由數線左至右排列，答案是 −7 ＜ −3 ＜ 0 ＜ ＋4 ＜ ＋7。',
    interaction: { type: 'drag-order', direction: '由小至大', numbers: ['0', '−7', '＋7', '−3', '＋4'], answer: ['−7', '−3', '0', '＋4', '＋7'] },
  },
  {
    id: 'NF2-H01',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '將以下數字由小至大排列。',
    answerDisplay: '−4.8 ＜ −3.1 ＜ −1.2 ＜ 0 ＜ ＋0.6 ＜ ＋3.5',
    hint: '先比較負小數，再排列 0 及正小數；負數越接近 0 越大。',
    solution: '負數由小至大為 −4.8 ＜ −3.1 ＜ −1.2，接著是 0、＋0.6 及 ＋3.5。',
    interaction: { type: 'drag-order', direction: '由小至大', numbers: ['−4.8', '＋3.5', '−1.2', '＋0.6', '0', '−3.1'], answer: ['−4.8', '−3.1', '−1.2', '0', '＋0.6', '＋3.5'] },
  },
  {
    id: 'NF2-H02',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '將以下數字由大至小排列。',
    answerDisplay: '＋5.7 ＞ ＋1.3 ＞ 0 ＞ −0.9 ＞ −2.4 ＞ −6.2',
    hint: '正小數先按數值排列，再排列 0 及負小數。',
    solution: '正數為 ＋5.7 ＞ ＋1.3，接著是 0，再按負數大小排列。',
    interaction: { type: 'drag-order', direction: '由大至小', numbers: ['＋5.7', '−2.4', '＋1.3', '−0.9', '0', '−6.2'], answer: ['＋5.7', '＋1.3', '0', '−0.9', '−2.4', '−6.2'] },
  },
  {
    id: 'NF2-H03',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '將以下數字由小至大排列。',
    answerDisplay: '−3.6 ＜ −2.1 ＜ −0.8 ＜ 0 ＜ ＋1.7 ＜ ＋2.4',
    hint: '數線上越左的數越小；排列負小數時要小心負號。',
    solution: '負數由小至大為 −3.6 ＜ −2.1 ＜ −0.8，接著是 0、＋1.7 及 ＋2.4。',
    interaction: { type: 'drag-order', direction: '由小至大', numbers: ['−3.6', '＋2.4', '−0.8', '＋1.7', '0', '−2.1'], answer: ['−3.6', '−2.1', '−0.8', '0', '＋1.7', '＋2.4'] },
  },
];
