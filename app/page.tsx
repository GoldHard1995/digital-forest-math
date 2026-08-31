'use client';

import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Archive, ArrowLeft, BarChart3, BookOpen, Check, ChevronRight, CircleHelp,
  Download, FileSpreadsheet, Gem, Leaf, LockKeyhole, Map,
  Plus, RotateCcw, Search, ShieldCheck, Sparkles, Star, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { firstStageQuestions, type FirstStageQuestion, type NumberLineConfig } from '@/lib/first-stage-content';
import { secondStageQuestions, type DragOrderInteraction, type SecondStageQuestion } from '@/lib/second-stage-content';
import { thirdStageQuestions, type ThirdStageQuestion } from '@/lib/third-stage-content';
import { fourthStageQuestions, type FourthStageQuestion } from '@/lib/fourth-stage-content';
import { bossStageQuestions, type BossStageQuestion } from '@/lib/boss-stage-content';

type View = 'map' | 'question' | 'second-question' | 'third-question' | 'fourth-question' | 'boss-question' | 'teacher' | 'assign' | 'report';
type Profile = { full_name: string; role: 'admin' | 'teacher' | 'student'; character_name: string | null };

const stages = [
  { title: '數線方向', subtitle: '教師最新指派', stars: 0, status: 'active' },
  { title: '比較大小', subtitle: '可試玩', stars: 0, status: 'available' },
  { title: '同號加法', subtitle: '可試玩', stars: 0, status: 'available' },
  { title: '異號加法', subtitle: '可試玩', stars: 0, status: 'available' },
  { title: '聚能獸', subtitle: '加法小頭目', stars: 0, status: 'available' },
];

const students = [
  { name: '陳同學', progress: '6／13', accuracy: '83%', issue: '異號結果符號', status: '進行中' },
  { name: '李同學', progress: '13／13', accuracy: '92%', issue: '—', status: '已掌握' },
  { name: '黃同學', progress: '13／13', accuracy: '69%', issue: '減去負數', status: '需補救' },
  { name: '張同學', progress: '0／13', accuracy: '—', issue: '—', status: '未開始' },
];

export default function Home() {
  const [view, setView] = useState<View>('map');
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [demoMode, setDemoMode] = useState(!supabase);

  const canViewTeacher = demoMode || profile?.role === 'teacher' || profile?.role === 'admin' || session?.user.email?.toLowerCase() === 'kwh@tllf.edu.hk';

  useEffect(() => {
    if (!supabase) return;
    const loadProfile = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('full_name, role, character_name').eq('id', userId).maybeSingle();
      setProfile(data as Profile | null);
    };
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void loadProfile(data.session.user.id);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setProfile(null);
      if (nextSession) void loadProfile(nextSession.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (profile?.role === 'teacher' || profile?.role === 'admin') setView('teacher');
    if (profile?.role === 'student') setView('map');
  }, [profile?.role]);

  useEffect(() => {
    if (!canViewTeacher && ['teacher', 'assign', 'report'].includes(view)) setView('map');
  }, [canViewTeacher, view]);

  const goStudent = () => setView('map');
  const goTeacher = () => { if (canViewTeacher) setView('teacher'); };
  const signOut = async () => { await supabase?.auth.signOut(); setDemoMode(false); };

  if (loading) return <main className="grid min-h-screen place-items-center bg-background text-forest"><p className="text-sm">正在連接學習帳戶……</p></main>;
  if (supabase && !session && !demoMode) return <SignInScreen onDemo={() => setDemoMode(true)} />;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header view={view} goStudent={goStudent} goTeacher={goTeacher} profile={profile} demoMode={demoMode} canViewTeacher={canViewTeacher} onSignOut={signOut} />
      {view === 'map' && <StudentMap onStartFirst={() => setView('question')} onStartSecond={() => setView('second-question')} onStartThird={() => setView('third-question')} onStartFourth={() => setView('fourth-question')} onStartBoss={() => setView('boss-question')} profile={profile} demoMode={demoMode} />}
      {view === 'question' && <QuestionScreen onBack={goStudent} />}
      {view === 'second-question' && <SecondStageScreen onBack={goStudent} />}
      {view === 'third-question' && <ThirdStageScreen onBack={goStudent} />}
      {view === 'fourth-question' && <FourthStageScreen onBack={goStudent} />}
      {view === 'boss-question' && <BossStageScreen onBack={goStudent} />}
      {canViewTeacher && view === 'teacher' && <TeacherDashboard onAssign={() => setView('assign')} onReport={() => setView('report')} />}
      {canViewTeacher && view === 'assign' && <AssignmentScreen onBack={goTeacher} onDone={goTeacher} />}
      {canViewTeacher && view === 'report' && <ReportScreen onBack={goTeacher} />}
    </main>
  );
}

function SignInScreen({ onDemo }: { onDemo: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setSubmitting(true);
    const loginValue = email.trim();
    const normalizedEmail = loginValue.includes('@') ? loginValue.toLowerCase() : `${loginValue}@digitalforestmath.example`;
    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    setMessage(error ? '登入資料不正確，請向老師核對帳戶。' : '登入成功，正在開啟學習地圖……');
    setSubmitting(false);
  };
  return <main className="grid min-h-screen place-items-center bg-cream p-6"><form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-forest/15 bg-white p-8 shadow-sm"><div className="mb-6 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-forest text-gold"><Leaf className="size-6" /></div><div><h1 className="font-heading text-2xl font-bold text-forest">數字森林</h1><p className="text-xs text-muted-foreground">學生及教師登入</p></div></div><label className="mb-4 block text-sm font-bold">登入名稱／電郵<Input className="mt-2" type="text" autoComplete="username" placeholder="學生輸入 8 位登入名稱；教師輸入電郵" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="block text-sm font-bold">密碼<Input className="mt-2" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button type="submit" className="mt-6 w-full rounded-lg bg-primary px-2.5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50" disabled={submitting}>{submitting ? '正在登入……' : '登入平台'}</button>{message && <p className="mt-4 rounded-xl bg-gold/10 p-3 text-sm text-forest">{message}</p>}<button type="button" onClick={onDemo} className="mt-5 w-full text-sm text-forest underline">先查看示範關卡</button></form></main>;
}

function Header({ view, goStudent, goTeacher, profile, demoMode, canViewTeacher, onSignOut }: { view: View; goStudent: () => void; goTeacher: () => void; profile: Profile | null; demoMode: boolean; canViewTeacher: boolean; onSignOut: () => void }) {
  const teacherView = ['teacher', 'assign', 'report'].includes(view);
  return (
    <header className="border-b border-forest/15 bg-cream/95 px-6 py-3 shadow-sm">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
        <button type="button" className="flex items-center gap-3 text-left" onClick={goStudent}>
          <div className="grid size-11 place-items-center rounded-2xl bg-forest text-gold shadow-sm"><Leaf className="size-6" /></div>
          <div><h1 className="font-heading text-xl font-bold tracking-wide text-forest">數字森林</h1><p className="text-xs text-muted-foreground">中學數學冒險平台 · 低擬真原型</p></div>
        </button>
        <nav aria-label="帳戶與角色切換" className="flex items-center gap-2">
          {demoMode ? <Badge variant="secondary">示範模式</Badge> : profile && <span className="hidden text-right text-xs text-muted-foreground md:block">{profile.full_name}<br />{profile.role === 'student' ? '學生帳戶' : '教師帳戶'}</span>}
          <div className="flex rounded-xl border border-forest/15 bg-white p-1">
          <Button size="sm" variant={!teacherView ? 'default' : 'ghost'} onClick={goStudent}>學生畫面</Button>
          {canViewTeacher && <Button size="sm" variant={teacherView ? 'default' : 'ghost'} onClick={goTeacher}>教師畫面</Button>}
          </div>
          {!demoMode && <Button size="sm" variant="ghost" onClick={onSignOut}>登出</Button>}
        </nav>
      </div>
    </header>
  );
}

function StudentMap({ onStartFirst, onStartSecond, onStartThird, onStartFourth, onStartBoss, profile, demoMode }: { onStartFirst: () => void; onStartSecond: () => void; onStartThird: () => void; onStartFourth: () => void; onStartBoss: () => void; profile: Profile | null; demoMode: boolean }) {
  return (
    <section className="mx-auto max-w-[1180px] px-6 py-7">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div><Badge variant="secondary" className="mb-2">{demoMode ? '示範關卡 · S1A 陳同學' : `${profile?.character_name || profile?.full_name || '魔法學徒'} · 學習地圖`}</Badge><h2 className="font-heading text-3xl font-bold text-forest">負數迷霧正在擴散</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">先掌握「數線方向」，為森林找回正負能量。這是你今天的最新指派。</p></div>
        <div className="hidden items-center gap-3 md:flex"><div className="stat-chip"><Star className="size-4" /> 5 顆星</div><div className="stat-chip"><Gem className="size-4" /> 2 件收藏</div></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_270px]">
        <section aria-label="森林地圖" className="map-panel relative min-h-[470px] overflow-hidden rounded-[28px] border border-forest/15 p-6 shadow-sm">
          <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-forest"><Map className="size-4" /> 第一區：迷霧森林</div><span className="text-xs text-forest/70">進度 0／8</span></div>
          <div className="path-line" aria-hidden="true" />
          <div className="relative z-10 grid grid-cols-5 gap-3 pt-14">
            {stages.map((stage, index) => (
              <button key={stage.title} type="button" disabled={stage.status === 'locked'} onClick={stage.status === 'active' ? onStartFirst : stage.status === 'available' ? (index === 1 ? onStartSecond : index === 2 ? onStartThird : index === 3 ? onStartFourth : onStartBoss) : undefined} className={`stage ${stage.status}`} aria-label={`${stage.title}，${stage.subtitle}`}>
                <span className="stage-node">{stage.status === 'locked' ? <LockKeyhole className="size-5" /> : stage.status === 'active' ? <Sparkles className="size-6" /> : <ShieldCheck className="size-5" />}</span>
                <span className="mt-3 block text-sm font-bold">{stage.title}</span><span className="mt-1 block text-[11px] opacity-70">{stage.subtitle}</span>
                {stage.stars > 0 && <span className="mt-2 flex justify-center gap-0.5 text-gold">{Array.from({ length: 3 }).map((_, star) => <Star key={star} className={`size-3 ${star < stage.stars ? 'fill-current' : 'opacity-25'}`} />)}</span>}
                {index === 0 && <span className="mt-3 inline-flex rounded-full bg-gold px-2 py-1 text-[10px] font-bold text-forest">開始</span>}
                {(index === 1 || index === 2 || index === 3) && <span className="mt-3 inline-flex rounded-full bg-forest px-2 py-1 text-[10px] font-bold text-cream">試玩</span>}
                {index === 4 && <span className="mt-3 inline-flex rounded-full bg-gold px-2 py-1 text-[10px] font-bold text-forest">挑戰</span>}
              </button>
            ))}
          </div>
          <div className="absolute bottom-5 left-6 rounded-xl border border-forest/10 bg-cream/90 px-4 py-3 text-xs text-forest shadow-sm"><span className="font-bold">故事提示：</span> 聚能獸正在擾亂同號能量。</div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5"><div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gold text-forest"><BookOpen className="size-5" /></div><p className="text-xs font-semibold text-forest/65">教師最新指派</p><h3 className="mt-1 font-heading text-lg font-bold text-forest">數線方向</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">13 題<br />約 10 分鐘</p><Button className="mt-4 w-full justify-between" onClick={onStartFirst}>開始關卡 <ChevronRight className="size-4" /></Button></div>
          <div className="rounded-2xl border border-forest/12 bg-white p-5"><p className="text-xs font-semibold text-forest/65">下一個試玩關卡</p><h3 className="mt-1 font-heading text-lg font-bold text-forest">比較大小</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">A：比較符號<br />B、H：拖拉排列</p><Button variant="outline" className="mt-4 w-full justify-between" onClick={onStartSecond}>試玩關卡 <ChevronRight className="size-4" /></Button></div>
          <div className="rounded-2xl border border-forest/12 bg-white p-5"><p className="text-xs font-semibold text-forest/65">下個收藏</p><div className="mt-3 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full border-2 border-dashed border-forest/20 text-forest/40"><Gem className="size-5" /></div><div><p className="text-sm font-bold">苔光法器</p><p className="text-xs text-muted-foreground">再取得 2 顆星</p></div></div></div>
        </aside>
      </div>
    </section>
  );
}

function normalizeNumericAnswer(value: string) {
  return value.trim().replace(/\s+/g, '').replaceAll('−', '-').replaceAll('＋', '+').replace(/^\+/, '');
}

function NumberLine({ config }: { config: NumberLineConfig }) {
  const xFor = (value: number) => 64 + ((value + 8) * 1232) / 16;
  return <div className="mt-6 rounded-2xl border border-forest/10 bg-cream/45 px-3 py-2"><svg viewBox="0 0 1360 180" className="h-auto w-full" role="img" aria-label="由 −8 到 ＋8 的數線"><image href="/number-line-8.svg" x="0" y="0" width="1360" height="180" aria-hidden="true" />
    <defs><marker id="number-line-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d9ad45" /></marker></defs>
    {config.connectPoints && config.points.length > 1 && <line x1={xFor(config.points[0].value)} y1="56" x2={xFor(config.points[config.points.length - 1].value)} y2="56" stroke="#d9ad45" strokeWidth="3" strokeDasharray="8 7" />}
    {config.arrows?.map((arrow, index) => <line key={`${arrow.from}-${arrow.to}-${index}`} x1={xFor(arrow.from)} y1="56" x2={xFor(arrow.to)} y2="56" stroke="#d9ad45" strokeWidth="4" markerEnd="url(#number-line-arrow)" />)}
    {config.points.map((point) => <g key={`${point.value}-${point.label}`}><circle cx={xFor(point.value)} cy="78" r="8" fill="#d9ad45" stroke="#173f32" strokeWidth="3" /><text x={xFor(point.value)} y="30" textAnchor="middle" fill="#173f32" fontSize="23" fontWeight="700">{point.label}</text></g>)}
  </svg></div>;
}

function QuestionScreen({ onBack }: { onBack: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'hint' | 'solution' | 'empty'; text: string } | null>(null);
  const question: FirstStageQuestion = firstStageQuestions[questionIndex];
  const total = firstStageQuestions.length;
  const completed = questionIndex === total - 1 && feedback?.kind === 'correct';
  const contextQuestion = Boolean(question.inputLabel);

  const submit = () => {
    if (!answer.trim()) {
      setFeedback({ kind: 'empty', text: '請先輸入答案。' });
      return;
    }
    if (normalizeNumericAnswer(answer) === normalizeNumericAnswer(question.answer)) {
      setFeedback({ kind: 'correct', text: `答對了。答案是 ${question.answerDisplay}。` });
      return;
    }
    const nextAttempt = Math.min(attempt + 1, 3);
    setAttempt(nextAttempt);
    setFeedback(nextAttempt === 1
      ? { kind: 'hint', text: '先檢查方向及正負號，再重新作答。' }
      : nextAttempt === 2
        ? { kind: 'hint', text: `提示：${question.hint}` }
        : { kind: 'solution', text: `完整解法：${question.solution}` });
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => Math.min(value + 1, total - 1));
    setAnswer('');
    setAttempt(0);
    setFeedback(null);
  };

  return <section className="mx-auto max-w-[1040px] px-6 py-6">
    <div className="mb-5 flex items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回地圖</Button><div className="text-right"><p className="text-xs font-bold text-forest">數線方向 · 第 {questionIndex + 1}／{total} 題</p><Progress value={((questionIndex + 1) / total) * 100} className="mt-2 w-56" /></div></div>
    <div className="question-card mx-auto max-w-3xl rounded-[28px] border border-forest/15 bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-8">
      <div className="mb-5 flex items-center justify-between gap-3"><Badge variant="secondary">{question.section}</Badge><span className="text-right text-xs text-muted-foreground">難度 {question.difficulty} · 首次答對可保留 3 星</span></div>
      <p className="text-center text-sm font-semibold text-forest/65">{contextQuestion ? '以有向數表示以下情境。' : '請根據數線及題意作答。'}</p>
      <p className="my-7 text-center text-2xl font-semibold leading-relaxed tracking-wide text-forest sm:text-3xl">{question.prompt}</p>
      {question.numberLine && <NumberLine config={question.numberLine} />}
      {question.inputLabel && <p className="mt-5 rounded-xl bg-forest/6 px-4 py-3 text-center text-xs text-forest/80">{question.inputLabel}</p>}
      <form className="mt-6" onSubmit={(event) => { event.preventDefault(); submit(); }}><label htmlFor="answer" className="mb-2 block text-sm font-bold">你的答案</label><div className="flex gap-3"><Input id="answer" inputMode="numeric" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="使用下方數學鍵盤或直接輸入" className="h-12 text-xl" autoComplete="off" /><Button type="submit" className="h-12 px-7">提交</Button></div></form>
      <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-7" aria-label="數學鍵盤">{['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '−', '＋'].map((key) => <Button key={key} type="button" variant="outline" className="h-11 text-lg" onClick={() => setAnswer((value) => value + key)}>{key}</Button>)}<Button type="button" variant="outline" className="col-span-2 h-11 text-sm sm:col-span-1" onClick={() => setAnswer('')}>清除</Button></div>
      {feedback && <div className={`mt-5 rounded-2xl border p-4 text-sm ${feedback.kind === 'correct' ? 'border-forest/25 bg-forest/8 text-forest' : feedback.kind === 'solution' ? 'border-gold/55 bg-gold/12 text-forest' : 'border-gold/45 bg-gold/10 text-forest'}`}><div className="flex gap-3">{feedback.kind === 'correct' ? <Check className="mt-0.5 size-5 shrink-0" /> : <CircleHelp className="mt-0.5 size-5 shrink-0" />}<div><p>{feedback.text}</p>{feedback.kind === 'correct' && !completed && <Button className="mt-3" onClick={nextQuestion}>下一題 <ChevronRight className="size-4" /></Button>}{completed && <Button className="mt-3" onClick={onBack}>完成並返回地圖</Button>}</div></div></div>}
      <p className="mt-6 text-center text-xs text-muted-foreground">本關共 4 題基礎回想、6 題核心練習及 3 題綜合或挑戰。</p>
    </div>
  </section>;
}

function DragOrderInput({ interaction, onChange }: { interaction: DragOrderInteraction; onChange: (order: string[]) => void }) {
  const [items, setItems] = useState(interaction.numbers);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setItems(interaction.numbers);
    setDragIndex(null);
    setDropIndex(null);
  }, [interaction]);

  const findDropIndex = (clientX: number, clientY: number) => {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const distance = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2));
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  };

  const finishDrag = (targetIndex = dropIndex) => {
    if (dragIndex === null || targetIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    onChange(next);
    setDragIndex(null);
    setDropIndex(null);
  };

  return <div
    className="mt-5 rounded-2xl border border-forest/12 bg-cream/45 p-4"
    onPointerMove={(event) => { if (dragIndex !== null) setDropIndex(findDropIndex(event.clientX, event.clientY)); }}
    onPointerUp={() => finishDrag()}
    onPointerCancel={() => { setDragIndex(null); setDropIndex(null); }}
  >
    <p className="mb-3 text-center text-xs font-semibold text-forest/70">拖拉數字至正確位置</p>
    <div className="flex flex-wrap justify-center gap-3" role="list" aria-label={`拖拉數字，${interaction.direction}排列`}>
      {items.map((value, index) => <button
        key={`${value}-${index}`}
        ref={(element) => { itemRefs.current[index] = element; }}
        type="button"
        draggable
        onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; setDragIndex(index); setDropIndex(index); }}
        onDragOver={(event) => { event.preventDefault(); setDropIndex(index); }}
        onDrop={(event) => { event.preventDefault(); finishDrag(index); }}
        onPointerDown={(event) => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); setDragIndex(index); setDropIndex(index); }}
        className={`min-w-20 touch-none select-none rounded-xl border-2 bg-white px-4 py-3 text-lg font-semibold text-forest shadow-sm transition ${dragIndex === index ? 'border-gold bg-gold/20 opacity-70' : dropIndex === index ? 'border-gold/80 ring-2 ring-gold/25' : 'border-forest/15 hover:border-gold/70'}`}
        aria-label={`數字 ${value}，第 ${index + 1} 位`}
      ><span className="mr-2 text-sm text-forest/45" aria-hidden="true">↕</span>{value}</button>)}
    </div>
  </div>;
}

function SecondStageScreen({ onBack }: { onBack: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [symbolAnswer, setSymbolAnswer] = useState('');
  const [orderAnswer, setOrderAnswer] = useState<string[] | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'hint' | 'solution' | 'empty'; text: string } | null>(null);
  const question: SecondStageQuestion = secondStageQuestions[questionIndex];
  const total = secondStageQuestions.length;
  const completed = questionIndex === total - 1 && feedback?.kind === 'correct';
  const interaction = question.interaction;

  const submit = () => {
    const hasAnswer = interaction.type === 'comparison' ? Boolean(symbolAnswer.trim()) : orderAnswer !== null;
    if (!hasAnswer) {
      setFeedback({ kind: 'empty', text: interaction.type === 'comparison' ? '請先選擇比較符號。' : '請先拖拉數字完成排列。' });
      return;
    }
    const correct = interaction.type === 'comparison'
      ? symbolAnswer.trim().replace('<', '＜').replace('>', '＞') === interaction.answer
      : (orderAnswer ?? interaction.numbers).every((value, index) => value === interaction.answer[index]);
    if (correct) {
      setFeedback({ kind: 'correct', text: `答對了。${question.answerDisplay}` });
      return;
    }
    const nextAttempt = Math.min(attempt + 1, 3);
    setAttempt(nextAttempt);
    setFeedback(nextAttempt === 1
      ? { kind: 'hint', text: '先觀察數線上的左右位置，再檢查正負號。' }
      : nextAttempt === 2
        ? { kind: 'hint', text: `提示：${question.hint}` }
        : { kind: 'solution', text: `完整解法：${question.solution}` });
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => Math.min(value + 1, total - 1));
    setSymbolAnswer('');
    setOrderAnswer(null);
    setAttempt(0);
    setFeedback(null);
  };

  return <section className="mx-auto max-w-[1040px] px-6 py-6">
    <div className="mb-5 flex items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回地圖</Button><div className="text-right"><p className="text-xs font-bold text-forest">比較大小 · 第 {questionIndex + 1}／{total} 題</p><Progress value={((questionIndex + 1) / total) * 100} className="mt-2 w-56" /></div></div>
    <div className="question-card mx-auto max-w-3xl rounded-[28px] border border-forest/15 bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-8">
      <div className="mb-5 flex items-center justify-between gap-3"><Badge variant="secondary">{question.section}</Badge><span className="text-right text-xs text-muted-foreground">難度 {question.difficulty} · 首次答對可保留 3 星</span></div>
      <p className="text-center text-sm font-semibold text-forest/65">{interaction.type === 'comparison' ? '請選擇正確的比較符號。' : `請把數字拖拉至${interaction.direction}的次序。`}</p>
      <p className="my-7 text-center text-2xl font-semibold leading-relaxed tracking-wide text-forest sm:text-3xl">{question.prompt}</p>
      {interaction.type === 'comparison' ? <div className="mt-5 rounded-2xl border border-forest/12 bg-cream/45 p-4"><p className="mb-3 text-center text-xs text-forest/70">比較符號鍵盤</p><div className="flex justify-center gap-3">{['＜', '＞'].map((symbol) => <Button key={symbol} type="button" variant={symbolAnswer === symbol ? 'default' : 'outline'} className="h-14 min-w-20 text-3xl" onClick={() => setSymbolAnswer(symbol)}>{symbol}</Button>)}</div><p className="mt-3 text-center text-xs text-muted-foreground">目前選擇：{symbolAnswer || '尚未選擇'}</p></div> : <DragOrderInput interaction={interaction} onChange={setOrderAnswer} />}
      <Button className="mt-6 w-full" onClick={submit}>提交答案</Button>
      {feedback && <div className={`mt-5 rounded-2xl border p-4 text-sm ${feedback.kind === 'correct' ? 'border-forest/25 bg-forest/8 text-forest' : feedback.kind === 'solution' ? 'border-gold/55 bg-gold/12 text-forest' : 'border-gold/45 bg-gold/10 text-forest'}`}><div className="flex gap-3">{feedback.kind === 'correct' ? <Check className="mt-0.5 size-5 shrink-0" /> : <CircleHelp className="mt-0.5 size-5 shrink-0" />}<div><p>{feedback.text}</p>{feedback.kind === 'correct' && !completed && <Button className="mt-3" onClick={nextQuestion}>下一題 <ChevronRight className="size-4" /></Button>}{completed && <Button className="mt-3" onClick={onBack}>完成並返回地圖</Button>}</div></div></div>}
      <p className="mt-6 text-center text-xs text-muted-foreground">本關共 4 題基礎回想、6 題核心練習及 3 題綜合或挑戰。</p>
    </div>
  </section>;
}

function sanitizeNumericInput(value: string, allowDecimal: boolean) {
  const asciiValue = value.replaceAll('−', '-').replaceAll('＋', '+');
  const hasNegativeSign = asciiValue.startsWith('-');
  const hasPositiveSign = !hasNegativeSign && asciiValue.startsWith('+');
  const sign = hasNegativeSign ? '−' : hasPositiveSign ? '＋' : '';
  const unsignedValue = asciiValue.slice(sign ? 1 : 0).replace(/[^\d.]/g, '');
  const decimalIndex = unsignedValue.indexOf('.');
  const integerPart = decimalIndex === -1 ? unsignedValue : unsignedValue.slice(0, decimalIndex);
  if (!allowDecimal || decimalIndex === -1) return `${sign}${integerPart}`;
  const decimalPart = unsignedValue.slice(decimalIndex + 1).replaceAll('.', '').slice(0, 1);
  return `${sign}${integerPart}.${decimalPart}`;
}

function isCompleteNumericAnswer(value: string, allowDecimal: boolean) {
  const normalized = normalizeNumericAnswer(value);
  return allowDecimal
    ? /^[+-]?(?:\d+(?:\.\d)?|\.\d)$/.test(normalized)
    : /^[+-]?\d+$/.test(normalized);
}

function appendNumericKey(value: string, key: string, allowDecimal: boolean) {
  if (key === '清除') return '';
  if (key === '⌫') return value.slice(0, -1);
  if (key === '−' || key === '＋') return value ? value : key;
  if (key === '.' && (!allowDecimal || value.includes('.'))) return value;
  return sanitizeNumericInput(`${value}${key}`, allowDecimal);
}

function NumericKeypad({ allowDecimal, onKey }: { allowDecimal: boolean; onKey: (key: string) => void }) {
  const keys = allowDecimal
    ? ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '−', '＋']
    : ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '−', '＋'];
  return <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-7" aria-label="數學鍵盤">
    {keys.map((key) => <Button key={key} type="button" variant="outline" className="h-11 text-lg" onClick={() => onKey(key)}>{key}</Button>)}
    <Button type="button" variant="outline" className="col-span-2 h-11 text-sm sm:col-span-1" onClick={() => onKey('⌫')}>刪除</Button>
    <Button type="button" variant="outline" className="col-span-2 h-11 text-sm sm:col-span-1" onClick={() => onKey('清除')}>清除</Button>
  </div>;
}

function ThirdStageScreen({ onBack }: { onBack: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'hint' | 'solution' | 'empty'; text: string } | null>(null);
  const question: ThirdStageQuestion = thirdStageQuestions[questionIndex];
  const total = thirdStageQuestions.length;
  const allowDecimal = Boolean(question.allowDecimal);
  const completed = questionIndex === total - 1 && feedback?.kind === 'correct';

  const submit = () => {
    if (!isCompleteNumericAnswer(answer, allowDecimal)) {
      setFeedback({ kind: 'empty', text: answer.trim() ? (allowDecimal ? '請輸入完整數值，小數部分最多 1 位。' : '請輸入完整的整數答案。') : '請先輸入答案。' });
      return;
    }
    if (normalizeNumericAnswer(answer) === normalizeNumericAnswer(question.answer)) {
      setFeedback({ kind: 'correct', text: `答對了。答案是 ${question.answerDisplay}。` });
      return;
    }
    const nextAttempt = Math.min(attempt + 1, 3);
    setAttempt(nextAttempt);
    setFeedback(nextAttempt === 1
      ? { kind: 'hint', text: '先判斷各個數的共同符號，再把絕對值相加。' }
      : nextAttempt === 2
        ? { kind: 'hint', text: `提示：${question.hint}` }
        : { kind: 'solution', text: `完整解法：${question.solution}` });
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => Math.min(value + 1, total - 1));
    setAnswer('');
    setAttempt(0);
    setFeedback(null);
  };

  return <section className="mx-auto max-w-[1040px] px-6 py-6">
    <div className="mb-5 flex items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回地圖</Button><div className="text-right"><p className="text-xs font-bold text-forest">同號加法 · 第 {questionIndex + 1}／{total} 題</p><Progress value={((questionIndex + 1) / total) * 100} className="mt-2 w-56" /></div></div>
    <div className="question-card mx-auto max-w-3xl rounded-[28px] border border-forest/15 bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-8">
      <div className="mb-5 flex items-center justify-between gap-3"><Badge variant="secondary">{question.section}</Badge><span className="text-right text-xs text-muted-foreground">難度 {question.difficulty} · 首次答對可保留 3 星</span></div>
      <p className="text-center text-sm font-semibold text-forest/65">把同號數字的絕對值相加，再保留共同符號。</p>
      <p className="my-7 text-center text-2xl font-semibold leading-relaxed tracking-wide text-forest sm:text-3xl">{question.prompt}</p>
      {question.inputLabel && <p className="mt-5 rounded-xl bg-forest/6 px-4 py-3 text-center text-xs text-forest/80">{question.inputLabel}</p>}
      <form className="mt-6" onSubmit={(event) => { event.preventDefault(); submit(); }}><label htmlFor="third-stage-answer" className="mb-2 block text-sm font-bold">你的答案</label><div className="flex gap-3"><Input id="third-stage-answer" inputMode={allowDecimal ? 'decimal' : 'numeric'} value={answer} onChange={(event) => setAnswer(sanitizeNumericInput(event.target.value, allowDecimal))} placeholder="使用下方數學鍵盤或直接輸入" className="h-12 text-xl" autoComplete="off" /><Button type="submit" className="h-12 px-7">提交</Button></div></form>
      <NumericKeypad allowDecimal={allowDecimal} onKey={(key) => setAnswer((value) => appendNumericKey(value, key, allowDecimal))} />
      {allowDecimal && <p className="mt-3 text-center text-xs text-muted-foreground">本題可輸入小數，小數部分最多 1 位。</p>}
      {feedback && <div className={`mt-5 rounded-2xl border p-4 text-sm ${feedback.kind === 'correct' ? 'border-forest/25 bg-forest/8 text-forest' : feedback.kind === 'solution' ? 'border-gold/55 bg-gold/12 text-forest' : 'border-gold/45 bg-gold/10 text-forest'}`}><div className="flex gap-3">{feedback.kind === 'correct' ? <Check className="mt-0.5 size-5 shrink-0" /> : <CircleHelp className="mt-0.5 size-5 shrink-0" />}<div><p>{feedback.text}</p>{feedback.kind === 'correct' && !completed && <Button className="mt-3" onClick={nextQuestion}>下一題 <ChevronRight className="size-4" /></Button>}{completed && <Button className="mt-3" onClick={onBack}>完成並返回地圖</Button>}</div></div></div>}
      <p className="mt-6 text-center text-xs text-muted-foreground">本關共 4 題基礎回想、6 題核心練習及 3 題綜合或挑戰。</p>
    </div>
  </section>;
}

function FourthStageScreen({ onBack }: { onBack: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'hint' | 'solution' | 'empty'; text: string } | null>(null);
  const question: FourthStageQuestion = fourthStageQuestions[questionIndex];
  const total = fourthStageQuestions.length;
  const completed = questionIndex === total - 1 && feedback?.kind === 'correct';

  const submit = () => {
    if (!isCompleteNumericAnswer(answer, false)) {
      setFeedback({ kind: 'empty', text: answer.trim() ? '請輸入完整的整數答案。' : '請先輸入答案。' });
      return;
    }
    if (normalizeNumericAnswer(answer) === normalizeNumericAnswer(question.answer)) {
      setFeedback({ kind: 'correct', text: `答對了。答案是 ${question.answerDisplay}。` });
      return;
    }
    const nextAttempt = Math.min(attempt + 1, 3);
    setAttempt(nextAttempt);
    setFeedback(nextAttempt === 1
      ? { kind: 'hint', text: '先比較異號數字的絕對值，再決定結果的正負號。' }
      : nextAttempt === 2
        ? { kind: 'hint', text: `提示：${question.hint}` }
        : { kind: 'solution', text: `完整解法：${question.solution}` });
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => Math.min(value + 1, total - 1));
    setAnswer('');
    setAttempt(0);
    setFeedback(null);
  };

  return <section className="mx-auto max-w-[1040px] px-6 py-6">
    <div className="mb-5 flex items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回地圖</Button><div className="text-right"><p className="text-xs font-bold text-forest">異號加法 · 第 {questionIndex + 1}／{total} 題</p><Progress value={((questionIndex + 1) / total) * 100} className="mt-2 w-56" /></div></div>
    <div className="question-card mx-auto max-w-3xl rounded-[28px] border border-forest/15 bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-8">
      <div className="mb-5 flex items-center justify-between gap-3"><Badge variant="secondary">{question.section}</Badge><span className="text-right text-xs text-muted-foreground">難度 {question.difficulty} · 首次答對可保留 3 星</span></div>
      <p className="text-center text-sm font-semibold text-forest/65">異號相加時，先比較絕對值，再決定結果的正負號。</p>
      <p className="my-7 text-center text-2xl font-semibold leading-relaxed tracking-wide text-forest sm:text-3xl">{question.prompt}</p>
      <form className="mt-6" onSubmit={(event) => { event.preventDefault(); submit(); }}><label htmlFor="fourth-stage-answer" className="mb-2 block text-sm font-bold">你的答案</label><div className="flex gap-3"><Input id="fourth-stage-answer" inputMode="numeric" value={answer} onChange={(event) => setAnswer(sanitizeNumericInput(event.target.value, false))} placeholder="使用下方數學鍵盤或直接輸入" className="h-12 text-xl" autoComplete="off" /><Button type="submit" className="h-12 px-7">提交</Button></div></form>
      <NumericKeypad allowDecimal={false} onKey={(key) => setAnswer((value) => appendNumericKey(value, key, false))} />
      {feedback && <div className={`mt-5 rounded-2xl border p-4 text-sm ${feedback.kind === 'correct' ? 'border-forest/25 bg-forest/8 text-forest' : feedback.kind === 'solution' ? 'border-gold/55 bg-gold/12 text-forest' : 'border-gold/45 bg-gold/10 text-forest'}`}><div className="flex gap-3">{feedback.kind === 'correct' ? <Check className="mt-0.5 size-5 shrink-0" /> : <CircleHelp className="mt-0.5 size-5 shrink-0" />}<div><p>{feedback.text}</p>{feedback.kind === 'correct' && !completed && <Button className="mt-3" onClick={nextQuestion}>下一題 <ChevronRight className="size-4" /></Button>}{completed && <Button className="mt-3" onClick={onBack}>完成並返回地圖</Button>}</div></div></div>}
      <p className="mt-6 text-center text-xs text-muted-foreground">本關共 4 題基礎回想、6 題核心練習及 3 題綜合或挑戰。</p>
    </div>
  </section>;
}

function BossStageScreen({ onBack }: { onBack: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'hint' | 'solution' | 'empty'; text: string } | null>(null);
  const question: BossStageQuestion = bossStageQuestions[questionIndex];
  const total = bossStageQuestions.length;
  const completed = questionIndex === total - 1 && feedback?.kind === 'correct';
  const defeatedCount = Math.min(questionIndex + (feedback?.kind === 'correct' ? 1 : 0), total);
  const remainingHealth = total - defeatedCount;

  const submit = () => {
    if (feedback?.kind === 'correct') return;
    if (!isCompleteNumericAnswer(answer, false)) {
      setFeedback({ kind: 'empty', text: answer.trim() ? '請輸入完整的整數答案。' : '請先輸入答案。' });
      return;
    }
    if (normalizeNumericAnswer(answer) === normalizeNumericAnswer(question.answer)) {
      setFeedback({ kind: 'correct', text: `答對了。聚能獸血量減少 1 格，答案是 ${question.answerDisplay}。` });
      return;
    }
    const nextAttempt = Math.min(attempt + 1, 3);
    setAttempt(nextAttempt);
    setFeedback(nextAttempt === 1
      ? { kind: 'hint', text: '先分辨同號或異號，再選擇相應的加法方法。' }
      : nextAttempt === 2
        ? { kind: 'hint', text: `提示：${question.hint}` }
        : { kind: 'solution', text: `完整解法：${question.solution}` });
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => Math.min(value + 1, total - 1));
    setAnswer('');
    setAttempt(0);
    setFeedback(null);
  };

  return <section className="mx-auto max-w-[1040px] px-6 py-6">
    <div className="mb-5 flex items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回地圖</Button><div className="text-right"><p className="text-xs font-bold text-forest">加法小頭目 · 第 {questionIndex + 1}／{total} 題</p><Progress value={((questionIndex + 1) / total) * 100} className="mt-2 w-56" /></div></div>
    <div className="question-card mx-auto max-w-3xl rounded-[28px] border border-forest/15 bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-8">
      <div className="mb-5 flex items-center justify-between gap-3"><Badge variant="secondary">聚能獸挑戰</Badge><span className="text-right text-xs text-muted-foreground">難度 {question.difficulty} · 答對一題削弱 1 格</span></div>
      <div className="mb-6 rounded-2xl border border-gold/45 bg-gold/10 p-4" aria-label={`聚能獸血量，剩餘 ${remainingHealth} 格`}>
        <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-forest">聚能獸血量</p><p className="text-sm font-bold text-forest">{remainingHealth}／{total} 格</p></div>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10" aria-hidden="true">{Array.from({ length: total }).map((_, index) => <span key={index} className={`h-3 rounded-full border ${index < remainingHealth ? 'border-gold bg-gold' : 'border-forest/10 bg-forest/10'}`} />)}</div>
        <Progress value={(remainingHealth / total) * 100} className="mt-3" aria-label={`聚能獸剩餘血量 ${remainingHealth} 格`} />
      </div>
      <p className="text-center text-sm font-semibold text-forest/65">整合前四關的有向數加法，答對後逐格削弱聚能獸。</p>
      <p className="my-7 text-center text-2xl font-semibold leading-relaxed tracking-wide text-forest sm:text-3xl">{question.prompt}</p>
      <form className="mt-6" onSubmit={(event) => { event.preventDefault(); submit(); }}><label htmlFor="boss-stage-answer" className="mb-2 block text-sm font-bold">你的答案</label><div className="flex gap-3"><Input id="boss-stage-answer" inputMode="numeric" value={answer} onChange={(event) => setAnswer(sanitizeNumericInput(event.target.value, false))} placeholder="使用下方數學鍵盤或直接輸入" className="h-12 text-xl" autoComplete="off" /><Button type="submit" className="h-12 px-7">提交</Button></div></form>
      <NumericKeypad allowDecimal={false} onKey={(key) => setAnswer((value) => appendNumericKey(value, key, false))} />
      {feedback && <div className={`mt-5 rounded-2xl border p-4 text-sm ${feedback.kind === 'correct' ? 'border-forest/25 bg-forest/8 text-forest' : feedback.kind === 'solution' ? 'border-gold/55 bg-gold/12 text-forest' : 'border-gold/45 bg-gold/10 text-forest'}`}><div className="flex gap-3">{feedback.kind === 'correct' ? <Check className="mt-0.5 size-5 shrink-0" /> : <CircleHelp className="mt-0.5 size-5 shrink-0" />}<div><p>{feedback.text}</p>{feedback.kind === 'correct' && !completed && <Button className="mt-3" onClick={nextQuestion}>下一題 <ChevronRight className="size-4" /></Button>}{completed && <Button className="mt-3" onClick={onBack}>完成挑戰並返回地圖</Button>}</div></div></div>}
      <p className="mt-6 text-center text-xs text-muted-foreground">本關共 4 題基礎回想、4 題核心練習及 2 題綜合或挑戰；每答對一題，聚能獸血量減少 1 格。</p>
    </div>
  </section>;
}

function TeacherShell({ active, children }: { active: string; children: React.ReactNode }) {
  return <section className="mx-auto grid max-w-[1180px] grid-cols-[205px_1fr] gap-6 px-6 py-7"><aside className="rounded-2xl border border-forest/12 bg-white p-3"><div className="mb-3 px-3 py-2"><p className="text-xs text-muted-foreground">教師帳戶</p><p className="font-bold text-forest">Ken 老師</p></div>{[{ icon: BarChart3, label: '班級總覽' },{ icon: Users, label: '學生進度' },{ icon: BookOpen, label: '指派活動' },{ icon: FileSpreadsheet, label: '題庫管理' },{ icon: Archive, label: '封存區' }].map(({ icon: Icon, label }) => <div key={label} className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${active === label ? 'bg-forest text-white' : 'text-forest/75'}`}><Icon className="size-4" />{label}</div>)}</aside><div>{children}</div></section>;
}

function TeacherDashboard({ onAssign, onReport }: { onAssign: () => void; onReport: () => void }) {
  return <TeacherShell active="班級總覽"><div className="mb-6 flex items-end justify-between"><div><Badge variant="secondary" className="mb-2">S1A · 30 名學生</Badge><h2 className="font-heading text-3xl font-bold text-forest">班級總覽</h2><p className="mt-2 text-sm text-muted-foreground">有向數的加法和減法</p></div><Button onClick={onAssign}><Plus className="size-4" /> 建立新指派</Button></div><div className="mb-5 grid grid-cols-4 gap-4">{[['已掌握','18','60%'],['進行中','7','23%'],['需要補救','3','10%'],['未開始','2','7%']].map(([label,value,detail]) => <div key={label} className="rounded-2xl border border-forest/12 bg-white p-5"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold text-forest">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail} 學生</p></div>)}</div><div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-forest/12 bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><p className="font-bold">各技能掌握分布</p><p className="text-xs text-muted-foreground">最近一次有效作答</p></div><Button variant="outline" onClick={onReport}>查看報告</Button></div>{[['數線方向',88],['比較大小',82],['同號加法',73],['異號加法',51],['有向數減法',42]].map(([skill,value]) => <div key={skill} className="mb-4 grid grid-cols-[105px_1fr_42px] items-center gap-3 text-xs"><span>{skill}</span><Progress value={Number(value)} /><span className="text-right font-semibold">{value}%</span></div>)}</div><div className="rounded-2xl border border-gold/35 bg-gold/8 p-5"><p className="font-bold">最常見錯誤</p><p className="mt-1 text-xs text-muted-foreground">按需要安排補救活動</p><div className="mt-4 space-y-3">{[['異號結果符號','8 人'],['減去負數','6 人'],['基本計算','4 人']].map(([issue,count]) => <div key={issue} className="flex justify-between rounded-xl bg-white/80 px-4 py-3 text-sm"><span>{issue}</span><strong>{count}</strong></div>)}</div></div></div></TeacherShell>;
}

function AssignmentScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [saved, setSaved] = useState(false);
  return <TeacherShell active="指派活動"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回總覽</Button><div className="mt-3 max-w-3xl rounded-2xl border border-forest/12 bg-white p-7"><h2 className="font-heading text-2xl font-bold text-forest">建立新指派</h2><p className="mt-1 text-sm text-muted-foreground">進階選項使用平台預設值。</p><div className="mt-6 grid grid-cols-2 gap-5"><Field label="指派名稱"><Input defaultValue="同號加法鞏固練習" /></Field><Field label="班級"><select className="field-select"><option>S1A（30 人）</option></select></Field><Field label="課題／關卡"><select className="field-select"><option>有向數加減法 · 同號加法</option></select></Field><Field label="截止日期"><Input type="date" defaultValue="2026-09-03" /></Field></div><div className="mt-5 grid grid-cols-3 gap-3">{['包括前測／後測','開放挑戰題','容許學生重玩'].map((item, index) => <label key={item} className="flex items-center gap-2 rounded-xl border border-forest/12 p-3 text-sm"><input type="checkbox" defaultChecked={index !== 0} />{item}</label>)}</div><div className="mt-7 flex justify-end gap-3"><Button variant="outline" onClick={onBack}>取消</Button><Button onClick={() => setSaved(true)}>發布指派</Button></div>{saved && <div className="mt-4 flex items-center gap-2 rounded-xl bg-forest/8 p-3 text-sm font-semibold text-forest"><Check className="size-4" /> 指派已建立。<button className="underline" onClick={onDone}>返回班級總覽</button></div>}</div></TeacherShell>;
}

function ReportScreen({ onBack }: { onBack: () => void }) {
  return <TeacherShell active="學生進度"><div className="mb-5 flex items-end justify-between"><div><Button variant="ghost" className="mb-2" onClick={onBack}><ArrowLeft className="size-4" /> 返回總覽</Button><h2 className="font-heading text-3xl font-bold text-forest">學生進度與錯誤</h2><p className="mt-2 text-sm text-muted-foreground">S1A · 同號加法鞏固練習</p></div><Button variant="outline"><Download className="size-4" /> 匯出 Excel</Button></div><div className="mb-4 flex gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="搜尋學生" /></div><Button variant="outline"><RotateCcw className="size-4" /> 更新</Button></div><div className="overflow-hidden rounded-2xl border border-forest/12 bg-white"><Table><TableHeader><TableRow><TableHead>學生</TableHead><TableHead>進度</TableHead><TableHead>首次正確率</TableHead><TableHead>主要錯誤</TableHead><TableHead>狀態</TableHead></TableRow></TableHeader><TableBody>{students.map((student) => <TableRow key={student.name}><TableCell className="font-semibold">{student.name}</TableCell><TableCell>{student.progress}</TableCell><TableCell>{student.accuracy}</TableCell><TableCell>{student.issue}</TableCell><TableCell><Badge variant={student.status === '已掌握' ? 'default' : 'secondary'}>{student.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div><div className="mt-4 rounded-xl border border-gold/35 bg-gold/8 p-4 text-xs text-forest"><strong>診斷說明：</strong>「異號結果符號」為系統根據錯誤答案及診斷題確認；信心不足的結果會顯示「可能」或「未能判定」。</div></TeacherShell>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-bold">{label}</span>{children}</label>; }
