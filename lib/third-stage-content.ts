export type ThirdStageSection = '基礎回想' | '核心練習' | '綜合或挑戰';

export type ThirdStageQuestion = {
  id: string;
  section: ThirdStageSection;
  difficulty: 1 | 2 | 3;
  prompt: string;
  answer: string;
  answerDisplay: string;
  hint: string;
  solution: string;
  allowDecimal?: boolean;
  inputLabel?: string;
};

export const thirdStageQuestions: ThirdStageQuestion[] = [
  {
    id: 'NF3-A01',
    section: '基礎回想',
    difficulty: 1,
    prompt: '（＋7）＋（＋5）＝？',
    answer: '12',
    answerDisplay: '＋12',
    hint: '兩個數都是正數，先把絕對值相加，再保留正號。',
    solution: '7＋5＝12，兩個數同為正數，所以答案是 ＋12。',
  },
  {
    id: 'NF3-A02',
    section: '基礎回想',
    difficulty: 1,
    prompt: '（−6）＋（−8）＝？',
    answer: '-14',
    answerDisplay: '−14',
    hint: '兩個數都是負數，先把絕對值相加，再保留負號。',
    solution: '6＋8＝14，兩個數同為負數，所以答案是 −14。',
  },
  {
    id: 'NF3-A03',
    section: '基礎回想',
    difficulty: 1,
    prompt: '正 9 加上正 4，結果是多少？',
    answer: '13',
    answerDisplay: '＋13',
    hint: '正數和正數相加，答案仍是正數。',
    solution: '9＋4＝13，兩個數同為正數，所以答案是 ＋13。',
  },
  {
    id: 'NF3-A04',
    section: '基礎回想',
    difficulty: 1,
    prompt: '負 11 加上負 6，結果是多少？',
    answer: '-17',
    answerDisplay: '−17',
    hint: '負數和負數相加，先相加絕對值，答案保留負號。',
    solution: '11＋6＝17，兩個數同為負數，所以答案是 −17。',
  },
  {
    id: 'NF3-B01',
    section: '核心練習',
    difficulty: 2,
    prompt: '（＋23）＋（＋17）＝？',
    answer: '40',
    answerDisplay: '＋40',
    hint: '同號相加：先計算 23＋17，再決定答案的符號。',
    solution: '23＋17＝40，兩個數同為正數，所以答案是 ＋40。',
  },
  {
    id: 'NF3-B02',
    section: '核心練習',
    difficulty: 2,
    prompt: '（−28）＋（−14）＝？',
    answer: '-42',
    answerDisplay: '−42',
    hint: '同號相加：先計算 28＋14，答案保留負號。',
    solution: '28＋14＝42，兩個數同為負數，所以答案是 −42。',
  },
  {
    id: 'NF3-B03',
    section: '核心練習',
    difficulty: 2,
    prompt: '34＋（＋9）＝？',
    answer: '43',
    answerDisplay: '＋43',
    hint: '沒有寫出正號的 34 也是正數，兩個數同為正數。',
    solution: '34＋9＝43，兩個數同為正數，所以答案是 ＋43。',
  },
  {
    id: 'NF3-B04',
    section: '核心練習',
    difficulty: 2,
    prompt: '（−31）＋（−16）＝？',
    answer: '-47',
    answerDisplay: '−47',
    hint: '兩個數同為負數，先計算 31＋16，再保留負號。',
    solution: '31＋16＝47，兩個數同為負數，所以答案是 −47。',
  },
  {
    id: 'NF3-B05',
    section: '核心練習',
    difficulty: 2,
    prompt: '正 27 加上正 15，合共多少？',
    answer: '42',
    answerDisplay: '＋42',
    hint: '正數相加時，把兩個數的絕對值相加，答案仍是正數。',
    solution: '27＋15＝42，兩個數同為正數，所以合共 ＋42。',
  },
  {
    id: 'NF3-B06',
    section: '核心練習',
    difficulty: 2,
    prompt: '負 42 加上負 13，合共多少？',
    answer: '-55',
    answerDisplay: '−55',
    hint: '負數相加時，把絕對值相加，答案保留負號。',
    solution: '42＋13＝55，兩個數同為負數，所以合共 −55。',
  },
  {
    id: 'NF3-H01',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '清晨氣溫是 −7.6 °C，之後下降 2.3 °C，再下降 1.4 °C。最後氣溫是多少？',
    answer: '-11.3',
    answerDisplay: '−11.3 °C',
    hint: '兩次下降都代表負數；把 −7.6、−2.3 及 −1.4 相加。',
    solution: '−7.6＋（−2.3）＋（−1.4）＝−（7.6＋2.3＋1.4）＝−11.3，所以最後氣溫是 −11.3 °C。',
    allowDecimal: true,
    inputLabel: '請只輸入數值，不要輸入 °C。',
  },
  {
    id: 'NF3-H02',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '遊戲三個回合分別取得 ＋12.4 分、＋9.3 分及 ＋6.2 分。三回合合共多少分？',
    answer: '27.9',
    answerDisplay: '＋27.9 分',
    hint: '三個回合都是正分，把 12.4、9.3 及 6.2 相加。',
    solution: '12.4＋9.3＋6.2＝27.9，三個數同為正數，所以合共 ＋27.9 分。',
    allowDecimal: true,
    inputLabel: '請只輸入數值，不要輸入單位。',
  },
  {
    id: 'NF3-H03',
    section: '綜合或挑戰',
    difficulty: 3,
    prompt: '商店三項商品分別盈利 ＋＄18.5、＋＄7.2 及 ＋＄13.4。合共盈利多少？',
    answer: '39.1',
    answerDisplay: '＋＄39.1',
    hint: '三項盈利都是正數，把 18.5、7.2 及 13.4 相加。',
    solution: '18.5＋7.2＋13.4＝39.1，三個數同為正數，所以合共盈利 ＋＄39.1。',
    allowDecimal: true,
    inputLabel: '請只輸入數值，不要輸入貨幣符號。',
  },
];
