export type BossStageSection = '基礎回想' | '核心練習' | '綜合或挑戰';

export type BossStageQuestion = {
  id: string;
  section: BossStageSection;
  difficulty: 1 | 2 | 3;
  prompt: string;
  answer: string;
  answerDisplay: string;
  hint: string;
  solution: string;
};

export const bossStageQuestions: BossStageQuestion[] = [
  {
    id: 'NF5-A01',
    section: '基礎回想',
    difficulty: 1,
    prompt: '（＋5）＋（＋8）＝？',
    answer: '13',
    answerDisplay: '＋13',
    hint: '兩個數同為正數，先把絕對值相加，再保留正號。',
    solution: '5＋8＝13；兩個數都是正數，所以答案是 ＋13。',
  },
  {
    id: 'NF5-A02',
    section: '基礎回想',
    difficulty: 1,
    prompt: '計算：負 7 加上負 4。',
    answer: '-11',
    answerDisplay: '−11',
    hint: '兩個數同為負數，先把絕對值相加，答案取負號。',
    solution: '7＋4＝11；兩個數都是負數，所以答案是 −11。',
  },
  {
    id: 'NF5-A03',
    section: '基礎回想',
    difficulty: 1,
    prompt: '（＋9）＋（−14）＝？',
    answer: '-5',
    answerDisplay: '−5',
    hint: '兩個數異號，計算 14−9，並取絕對值較大的數 14 的負號。',
    solution: '14＞9，14−9＝5；較大絕對值 14 的符號是負，所以答案是 −5。',
  },
  {
    id: 'NF5-A04',
    section: '基礎回想',
    difficulty: 1,
    prompt: '負 12 加上正 17，結果是多少？',
    answer: '5',
    answerDisplay: '＋5',
    hint: '兩個數異號，計算 17−12，並取絕對值較大的數 17 的正號。',
    solution: '17＞12，17−12＝5；較大絕對值 17 的符號是正，所以答案是 ＋5。',
  },
  {
    id: 'NF5-B01',
    section: '核心練習',
    difficulty: 2,
    prompt: '（＋21）＋（＋14）＋（−18）＝？',
    answer: '17',
    answerDisplay: '＋17',
    hint: '可先把兩個正數相加，再加入負數。',
    solution: '21＋14＝35，35＋（−18）＝17，所以答案是 ＋17。',
  },
  {
    id: 'NF5-B02',
    section: '核心練習',
    difficulty: 2,
    prompt: '把 −26、＋19 及 −12 相加。',
    answer: '-19',
    answerDisplay: '−19',
    hint: '可先把兩個負數合併，再加入正數。',
    solution: '（−26）＋（−12）＝−38，−38＋19＝−19，所以答案是 −19。',
  },
  {
    id: 'NF5-B03',
    section: '核心練習',
    difficulty: 2,
    prompt: '（＋32）＋（−15）＋（＋8）＝？',
    answer: '25',
    answerDisplay: '＋25',
    hint: '可先計算 32−15，再加入 ＋8。',
    solution: '（＋32）＋（−15）＝17，17＋8＝25，所以答案是 ＋25。',
  },
  {
    id: 'NF5-B04',
    section: '核心練習',
    difficulty: 2,
    prompt: '負 35、正 27 和正 16 的總和是多少？',
    answer: '8',
    answerDisplay: '＋8',
    hint: '先把兩個正數相加，再與 −35 相加。',
    solution: '27＋16＝43，43＋（−35）＝8，所以答案是 ＋8。',
  },
  {
    id: 'NF5-C01',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '（＋68）＋（−47）＋（−29）＝？',
    answer: '-8',
    answerDisplay: '−8',
    hint: '可先計算 68−47，再加入 −29。',
    solution: '（＋68）＋（−47）＝21，21＋（−29）＝−8，所以答案是 −8。',
  },
  {
    id: 'NF5-C02',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '先有 −73，再加入 ＋56 及 −18，最後的總和是多少？',
    answer: '-35',
    answerDisplay: '−35',
    hint: '可先計算 −73＋56，再加入 −18。',
    solution: '−73＋56＝−17，−17＋（−18）＝−35，所以答案是 −35。',
  },
];
