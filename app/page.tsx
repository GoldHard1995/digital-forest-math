'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Archive, ArrowLeft, BarChart3, BookOpen, Check, ChevronRight, CircleHelp,
  Download, FileSpreadsheet, Gem, GraduationCap, Leaf, LockKeyhole, Map,
  Plus, RotateCcw, Search, ShieldCheck, Sparkles, Star, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';

type View = 'map' | 'question' | 'teacher' | 'assign' | 'report';
type Profile = { full_name: string; role: 'admin' | 'teacher' | 'student'; character_name: string | null };

const stages = [
  { title: '數線方向', subtitle: '已掌握', stars: 3, status: 'done' },
  { title: '比較大小', subtitle: '已掌握', stars: 2, status: 'done' },
  { title: '同號加法', subtitle: '教師最新指派', stars: 0, status: 'active' },
  { title: '異號加法', subtitle: '尚未解鎖', stars: 0, status: 'locked' },
  { title: '聚能獸', subtitle: '加法小頭目', stars: 0, status: 'locked' },
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

  const canViewTeacher = demoMode || profile?.role === 'teacher' || profile?.role === 'admin' || session?.user.email?.toLowerCase() === 'kwh@tllf.edu.hk';

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
      {view === 'map' && <StudentMap onStart={() => setView('question')} profile={profile} demoMode={demoMode} />}
      {view === 'question' && <QuestionScreen onBack={goStudent} />}
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

function StudentMap({ onStart, profile, demoMode }: { onStart: () => void; profile: Profile | null; demoMode: boolean }) {
  return (
    <section className="mx-auto max-w-[1180px] px-6 py-7">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div><Badge variant="secondary" className="mb-2">{demoMode ? '示範關卡 · S1A 陳同學' : `${profile?.character_name || profile?.full_name || '魔法學徒'} · 學習地圖`}</Badge><h2 className="font-heading text-3xl font-bold text-forest">負數迷霧正在擴散</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">完成「同號加法」，恢復森林的數字能量。這是你今天的最新指派。</p></div>
        <div className="hidden items-center gap-3 md:flex"><div className="stat-chip"><Star className="size-4" /> 5 顆星</div><div className="stat-chip"><Gem className="size-4" /> 2 件收藏</div></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_270px]">
        <section aria-label="森林地圖" className="map-panel relative min-h-[470px] overflow-hidden rounded-[28px] border border-forest/15 p-6 shadow-sm">
          <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-forest"><Map className="size-4" /> 第一區：迷霧森林</div><span className="text-xs text-forest/70">進度 2／8</span></div>
          <div className="path-line" aria-hidden="true" />
          <div className="relative z-10 grid grid-cols-5 gap-3 pt-14">
            {stages.map((stage, index) => (
              <button key={stage.title} type="button" disabled={stage.status === 'locked'} onClick={stage.status === 'active' ? onStart : undefined} className={`stage ${stage.status}`} aria-label={`${stage.title}，${stage.subtitle}`}>
                <span className="stage-node">{stage.status === 'locked' ? <LockKeyhole className="size-5" /> : stage.status === 'active' ? <Sparkles className="size-6" /> : <ShieldCheck className="size-5" />}</span>
                <span className="mt-3 block text-sm font-bold">{stage.title}</span><span className="mt-1 block text-[11px] opacity-70">{stage.subtitle}</span>
                {stage.stars > 0 && <span className="mt-2 flex justify-center gap-0.5 text-gold">{Array.from({ length: 3 }).map((_, star) => <Star key={star} className={`size-3 ${star < stage.stars ? 'fill-current' : 'opacity-25'}`} />)}</span>}
                {index === 2 && <span className="mt-3 inline-flex rounded-full bg-gold px-2 py-1 text-[10px] font-bold text-forest">繼續</span>}
              </button>
            ))}
          </div>
          <div className="absolute bottom-5 left-6 rounded-xl border border-forest/10 bg-cream/90 px-4 py-3 text-xs text-forest shadow-sm"><span className="font-bold">故事提示：</span> 聚能獸正在擾亂同號能量。</div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5"><div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gold text-forest"><BookOpen className="size-5" /></div><p className="text-xs font-semibold text-forest/65">教師最新指派</p><h3 className="mt-1 font-heading text-lg font-bold text-forest">同號加法</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">13 題 · 約 10 分鐘<br />截止：9 月 3 日</p><Button className="mt-4 w-full justify-between" onClick={onStart}>開始關卡 <ChevronRight className="size-4" /></Button></div>
          <div className="rounded-2xl border border-forest/12 bg-white p-5"><p className="text-xs font-semibold text-forest/65">下個收藏</p><div className="mt-3 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full border-2 border-dashed border-forest/20 text-forest/40"><Gem className="size-5" /></div><div><p className="text-sm font-bold">苔光法器</p><p className="text-xs text-muted-foreground">再取得 2 顆星</p></div></div></div>
        </aside>
      </div>
    </section>
  );
}

function QuestionScreen({ onBack }: { onBack: () => void }) {
  const [answer, setAnswer] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState('');
  const submit = () => {
    if (answer.trim().replace('−', '-') === '-8') { setMessage('答對了。兩個負數相加，結果仍是負數。'); return; }
    setAttempt((value) => Math.min(value + 1, 3));
    setMessage(attempt === 0 ? '再想一想：兩個數的符號是否相同？' : attempt === 1 ? '提示：同號相加，把絕對值相加，再保留共同符號。' : '完整解法：−3＋(−5)＝−(3＋5)＝−8');
  };
  return (
    <section className="mx-auto max-w-[1040px] px-6 py-6">
      <div className="mb-5 flex items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> 返回地圖</Button><div className="text-right"><p className="text-xs font-bold text-forest">同號加法 · 第 4／13 題</p><Progress value={31} className="mt-2 w-56" /></div></div>
      <div className="question-card mx-auto max-w-3xl rounded-[28px] border border-forest/15 bg-white px-9 py-8 shadow-sm">
        <div className="mb-7 flex items-center justify-between"><Badge variant="secondary">核心練習</Badge><span className="text-xs text-muted-foreground">首次答對可保留 3 星</span></div>
        <p className="text-center text-sm font-semibold text-forest/65">計算以下算式。</p><div className="my-8 text-center text-5xl font-semibold tracking-wide text-forest">−3＋(−5)</div>
        <label htmlFor="answer" className="mb-2 block text-sm font-bold">你的答案</label>
        <div className="flex gap-3"><Input id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="使用下方數學鍵盤" className="h-12 text-xl" /><Button className="h-12 px-7" onClick={submit}>提交</Button></div>
        <div className="mt-4 grid grid-cols-7 gap-2" aria-label="數學鍵盤">{['7','8','9','4','5','6','1','2','3','0','−','＋','(',')'].map((key) => <Button key={key} variant="outline" className="h-11 text-lg" onClick={() => setAnswer((value) => value + key)}>{key}</Button>)}</div>
        {message && <div className={`mt-5 rounded-2xl border p-4 text-sm ${message.startsWith('答對') ? 'border-forest/25 bg-forest/8 text-forest' : 'border-gold/45 bg-gold/10 text-forest'}`}><div className="flex gap-3">{message.startsWith('答對') ? <Check className="mt-0.5 size-5 shrink-0" /> : <CircleHelp className="mt-0.5 size-5 shrink-0" />}<div><p>{message}</p>{attempt > 0 && attempt < 3 && <Button variant="link" className="mt-2 h-auto p-0 text-forest" onClick={() => setMessage('提示：同號相加，把絕對值相加，再保留共同符號。')}>給我提示</Button>}</div></div></div>}
      </div>
    </section>
  );
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
