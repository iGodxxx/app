import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, ArrowRight, Award, BarChart3, CalendarDays, Check, ChevronRight,
  Clock3, Dumbbell, Flame, Heart, Home, Lock, Search, Settings,
  Sparkles, Target, UserRound, Waves, X
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calistenia Asiática | Seu movimento, sua evolução" },
      { name: "description", content: "Treinos de calistenia pensados para sua rotina, seu corpo e seus objetivos." },
    ],
  }),
  component: App,
});

type Tab = "Início" | "Treinos" | "Explorar" | "Evolução" | "Perfil";
type Workout = { title: string; level: string; time: string; focus: string; color: string; description: string; exercises: string[] };
type WorkoutSession = { id: string; title: string; completedAt: string; duration: number };

const workouts: Workout[] = [
  { title: "Corpo inteiro em movimento", level: "Iniciante", time: "18 min", focus: "Full body", color: "peach", description: "Uma sequência leve para ativar o corpo todo e construir consistência.", exercises: ["Aquecimento articular", "Agachamento livre", "Flexão inclinada", "Ponte de glúteos", "Prancha com joelhos"] },
  { title: "Pernas & glúteos", level: "Intermediário", time: "24 min", focus: "Inferiores", color: "lilac", description: "Fortaleça pernas e glúteos com movimentos controlados e progressivos.", exercises: ["Agachamento sumô", "Afundo alternado", "Elevação pélvica", "Agachamento isométrico", "Alongamento de pernas"] },
  { title: "Core forte", level: "Iniciante", time: "12 min", focus: "Abdômen", color: "sage", description: "Estabilidade e consciência corporal para fortalecer a região central.", exercises: ["Dead bug", "Prancha baixa", "Bird dog", "Abdominal curto", "Respiração e relaxamento"] },
  { title: "Braços & postura", level: "Intermediário", time: "20 min", focus: "Superiores", color: "rose", description: "Trabalhe braços, ombros e postura sem precisar de equipamentos.", exercises: ["Mobilidade de ombros", "Flexão na parede", "Prancha alta", "Superman", "Alongamento peitoral"] },
  { title: "Mobilidade e leveza", level: "Iniciante", time: "15 min", focus: "Mobilidade", color: "lilac", description: "Movimentos suaves para melhorar a mobilidade e relaxar as articulações.", exercises: ["Círculos de ombros", "Gato e vaca", "Mobilidade de quadril", "Alongamento de posterior", "Respiração profunda"] },
  { title: "Cardio sem impacto", level: "Iniciante", time: "16 min", focus: "Cardio", color: "peach", description: "Eleve o ritmo com movimentos de baixo impacto e pausas conscientes.", exercises: ["Marcha estacionária", "Passo lateral", "Agachamento curto", "Elevação alternada de joelhos", "Desaceleração"] },
  { title: "Glúteos em foco", level: "Intermediário", time: "22 min", focus: "Glúteos", color: "rose", description: "Uma sequência focada em força e controle para a região dos glúteos.", exercises: ["Ponte de glúteos", "Coice em quatro apoios", "Abdução lateral", "Ponte unilateral", "Alongamento de glúteos"] },
  { title: "Base de força", level: "Avançado", time: "28 min", focus: "Full body", color: "sage", description: "Um treino desafiador para quem já domina os movimentos básicos.", exercises: ["Agachamento com pausa", "Flexão tradicional", "Afundo reverso", "Prancha alta com toque", "Prancha lateral"] },
];

const nav: { label: Tab; icon: typeof Home }[] = [
  { label: "Início", icon: Home }, { label: "Treinos", icon: Dumbbell }, { label: "Explorar", icon: Search }, { label: "Evolução", icon: BarChart3 }, { label: "Perfil", icon: UserRound },
];

function App() {
  const [tab, setTab] = useState<Tab>("Início");
  const [active, setActive] = useState<Workout | null>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [challengeDay, setChallengeDay] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [nextUnlockAt, setNextUnlockAt] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState("Definição");
  const [level, setLevel] = useState("Iniciante");
  const [days, setDays] = useState("4 dias");
  const [onboarding, setOnboarding] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("calistenia-asiatica-state");
      if (saved) {
        const data = JSON.parse(saved) as { done?: string[]; history?: WorkoutSession[]; goal?: string; level?: string; days?: string; challengeDay?: number; challengeStarted?: boolean; startedAt?: string; unlockedDay?: number; nextUnlockAt?: string | null; completedDays?: number[] };
        if (Array.isArray(data.done)) setDone(data.done);
        if (Array.isArray(data.history)) setHistory(data.history);
        if (typeof data.goal === "string") setGoal(data.goal);
        if (typeof data.level === "string") setLevel(data.level);
        if (typeof data.days === "string") setDays(data.days);
        if (typeof data.challengeDay === "number") setChallengeDay(Math.min(7, Math.max(0, data.challengeDay)));
        if (typeof data.challengeStarted === "boolean") setChallengeStarted(data.challengeStarted);
        if (typeof data.startedAt === "string") setStartedAt(data.startedAt);
        if (typeof data.unlockedDay === "number") setUnlockedDay(Math.min(31, Math.max(1, data.unlockedDay)));
        if (typeof data.nextUnlockAt === "string" || data.nextUnlockAt === null) setNextUnlockAt(data.nextUnlockAt ?? null);
        if (Array.isArray(data.completedDays)) setCompletedDays(data.completedDays.filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= 31));
      }
    } catch { /* Estado local inválido: mantém os padrões iniciais. */ }
    if (!localStorage.getItem("calistenia-asiatica-state")) setStartedAt(new Date().toISOString());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("calistenia-asiatica-state", JSON.stringify({ done, history, goal, level, days, challengeDay, challengeStarted, startedAt: startedAt ?? new Date().toISOString(), unlockedDay, nextUnlockAt, completedDays }));
  }, [done, history, goal, level, days, challengeDay, challengeStarted, startedAt, unlockedDay, nextUnlockAt, completedDays, hydrated]);
  const filtered = useMemo(() => workouts.filter(w => (w.title + w.focus + w.level).toLowerCase().includes(query.toLowerCase())), [query]);
  useEffect(() => { if (!nextUnlockAt) return; const check = () => { if (Date.now() >= new Date(nextUnlockAt).getTime()) { setUnlockedDay(day => Math.min(31, day + 1)); setNextUnlockAt(null); } }; check(); const timer = window.setInterval(check, 30_000); return () => window.clearInterval(timer); }, [nextUnlockAt]);
  useEffect(() => { if (hydrated && !startedAt) setStartedAt(new Date().toISOString()); }, [hydrated, startedAt]);
  const dayWorkout = (day: number) => workouts[(day - 1) % workouts.length];
  const start = (w: Workout, day = unlockedDay) => { if (day > unlockedDay || day < 1 || completedDays.includes(day)) return; setActiveDay(day); setActive(w); setStep(0); };
  const finish = () => {
    if (active) {
      if (!done.includes(active.title)) setDone([...done, active.title]);
      if (!completedDays.includes(activeDay)) {
        setCompletedDays(previous => [...previous, activeDay]);
        if (activeDay < 31) setNextUnlockAt(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
      }
      setHistory(previous => [...previous, { id: `${Date.now()}-${previous.length}`, title: active.title, completedAt: new Date().toISOString(), duration: Number.parseInt(active.time, 10) || 0 }]);
    }
    if (challengeStarted && challengeDay < 7) setChallengeDay(challengeDay + 1);
    setActive(null);
    setTab("Evolução");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Waves size={22}/></span><span>calistenia<span className="brand-light">asiática</span><small>MOVE WITH PURPOSE</small></span></div>
        <div className="side-label">MENU</div>
        {nav.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "side-link selected" : "side-link"} onClick={() => setTab(label)}><Icon size={18}/>{label}{label === "Evolução" && done.length > 0 ? <span className="side-count">{done.length}</span> : null}</button>)}
        <div className="sidebar-bottom"><div className="side-quote">“Pequenos passos todos os dias criam grandes mudanças.”</div><div className="profile-mini"><div className="avatar">M</div><div><strong>Minha jornada</strong><small>Seu espaço de evolução</small></div><Settings size={17}/></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="mobile-brand">✿ calisteniaasiática</div><div className="breadcrumb">Sua jornada <span>/</span> {tab}</div><div className="top-actions"><span className="streak"><Flame size={16}/> {done.length} treinos</span><button className="icon-button" aria-label="Perfil" onClick={() => setTab("Perfil")}><UserRound size={19}/></button></div></header>
        <div className="content">
          {tab === "Início" && <HomePage done={done} history={history} start={start} setTab={setTab} unlockedDay={unlockedDay} completedDays={completedDays} nextUnlockAt={nextUnlockAt} dayWorkout={dayWorkout} />}
          {tab === "Treinos" && <WorkoutPage items={filtered} query={query} setQuery={setQuery} start={start} unlockedDay={unlockedDay} completedDays={completedDays} nextUnlockAt={nextUnlockAt} dayWorkout={dayWorkout} />}
          {tab === "Explorar" && <ExplorePage setGoal={setGoal} goal={goal} setTab={setTab} start={start} challengeStarted={challengeStarted} challengeDay={challengeDay} onStartChallenge={() => { setChallengeStarted(true); setTab("Treinos"); }} />}
          {tab === "Evolução" && <ProgressPage done={done} history={history} />}
          {tab === "Perfil" && <ProfilePage goal={goal} setGoal={setGoal} level={level} setLevel={setLevel} days={days} setDays={setDays} setOnboarding={setOnboarding} />}
        </div>
      </main>
      <nav className="mobile-nav">{nav.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "mobile-link active" : "mobile-link"} onClick={() => setTab(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      {active && <div className="modal-backdrop"><section className="workout-modal"><div className="modal-head"><span className="eyebrow">SEU TREINO GUIADO</span><button className="icon-button" onClick={() => setActive(null)} aria-label="Fechar"><X size={20}/></button></div><div className="workout-progress"><span style={{width: ((step + 1) / active.exercises.length * 100) + "%"}}/></div><div className="exercise-count">EXERCÍCIO {step + 1} DE {active.exercises.length}</div><ExerciseDemo name={active.exercises[step]} /><h2>{active.exercises[step]}</h2><p className="muted">{exerciseGuidance(active.exercises[step])}</p><p className="safety-hint">Respeite seus limites. Interrompa se sentir dor, tontura ou mal-estar.</p><div className="tip-box"><Sparkles size={18}/><span><strong>Como executar</strong> {exerciseGuidance(active.exercises[step])}<br/><strong>Respiração</strong> Solte o ar durante o esforço e inspire no retorno, sem prender a respiração.</span></div><div className="exercise-prescription"><span><strong>2–3</strong><small>séries</small></span><span><strong>8–12</strong><small>repetições</small></span><span><strong>45s</strong><small>descanso</small></span></div><div className="modal-actions"><button className="button-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Anterior</button>{step < active.exercises.length - 1 ? <button className="button-primary" onClick={() => setStep(step + 1)}>Próximo exercício <ArrowRight size={17}/></button> : <button className="button-primary" onClick={finish}><Check size={17}/> Concluir treino</button>}</div></section></div>}
      {onboarding && <div className="modal-backdrop"><section className="settings-modal"><div className="modal-head"><span className="eyebrow">AJUSTE SUA JORNADA</span><button className="icon-button" onClick={() => setOnboarding(false)}><X size={20}/></button></div><h2>Seu plano, seu ritmo.</h2><p className="muted">Personalize suas preferências de treino.</p><label>Seu objetivo</label><div className="choice-grid">{["Perder peso","Ganhar massa","Definição","Fortalecimento","Mobilidade"].map(x=><button className={goal===x?"choice chosen":"choice"} onClick={()=>setGoal(x)} key={x}>{x}</button>)}</div><label>Nível atual</label><div className="choice-grid">{["Iniciante","Intermediário","Avançado"].map(x=><button className={level===x?"choice chosen":"choice"} onClick={()=>setLevel(x)} key={x}>{x}</button>)}</div><label>Disponibilidade semanal</label><div className="choice-grid">{["2 dias","3 dias","4 dias","5 dias"].map(x=><button className={days===x?"choice chosen":"choice"} onClick={()=>setDays(x)} key={x}>{x}</button>)}</div><button className="button-primary full" onClick={()=>setOnboarding(false)}>Salvar preferências <Check size={17}/></button></section></div>}
    </div>
  );
}


function ExerciseDemo({name}:{name:string}) {
  const normalized = name.toLocaleLowerCase("pt-BR");
  const video = /ponte de glúteos|elevação pélvica/.test(normalized)
    ? {
        src: "https://videos.pexels.com/video-files/6525487/6525487-hd_1920_1080_25fps.mp4",
        label: "Demonstração real: ponte de glúteos",
        credit: "Polina Tankilevitch",
        source: "https://www.pexels.com/video/woman-doing-glute-bridge-exercise-6525487/",
      }
    : /prancha baixa/.test(normalized)
    ? {
        src: "https://videos.pexels.com/video-files/31035751/13265271_1920_1080_25fps.mp4",
        label: "Demonstração real: prancha",
        credit: "Aliaksei Masiukevich",
        source: "https://www.pexels.com/video/woman-performing-plank-exercise-in-gym-31035751/",
      }
    : /flexão inclinada/.test(normalized)
    ? {
        src: "https://videos.pexels.com/video-files/6740158/6740158-hd_1920_1080_25fps.mp4",
        label: "Demonstração real: flexão inclinada com apoio",
        credit: "Mikhail Nilov",
        source: "https://www.pexels.com/video/a-woman-exercising-in-the-gym-6740158/",
      }
    : null;

  return (
    <div className="exercise-demo exercise-video-demo">
      <div className="demo-heading">
        <span className="demo-live"><i/> DEMONSTRAÇÃO DO MOVIMENTO</span>
        <span>{video ? "VÍDEO REAL" : "GUIA DE TREINO"}</span>
      </div>
      {video ? (
        <>
          <video
            className="exercise-real-video"
            src={video.src}
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
            aria-label={video.label}
          />
          <div className="demo-footer">
            <strong>{video.label}</strong>
            <span>Vídeo por {video.credit} · <a href={video.source} target="_blank" rel="noreferrer">Fonte Pexels</a></span>
          </div>
        </>
      ) : (
        <div className="exercise-video-placeholder" role="status">
          <span className="placeholder-play">▶</span>
          <strong>Vídeo demonstrativo em preparação</strong>
          <span>Confira as instruções abaixo e execute o movimento sem pressa.</span>
        </div>
      )}
    </div>
  );
}

function exerciseGuidance(name: string) {
  const guidance: Record<string, string> = {
    "Aquecimento articular": "Faça movimentos circulares suaves com ombros, quadris, joelhos e tornozelos por 2 a 3 minutos.",
    "Agachamento livre": "Afaste os pés na largura dos quadris, leve o quadril para trás e flexione os joelhos. Suba empurrando o chão.",
    "Flexão inclinada": "Apoie as mãos em uma superfície firme, mantenha o corpo alinhado e flexione os cotovelos levando o peito em direção ao apoio.",
    "Ponte de glúteos": "Deite com joelhos flexionados e pés apoiados. Eleve o quadril contraindo os glúteos e desça devagar.",
    "Prancha com joelhos": "Apoie antebraços e joelhos, mantenha abdômen ativo e coluna neutra, sem deixar o quadril cair.",
    "Agachamento sumô": "Afaste mais os pés, gire levemente as pontas para fora e agache mantendo os joelhos alinhados aos pés.",
    "Afundo alternado": "Dê um passo para trás, flexione os dois joelhos com controle e retorne. Alterne as pernas.",
    "Elevação pélvica": "Apoie costas e pés, eleve o quadril até alinhar tronco e coxas e retorne lentamente.",
    "Agachamento isométrico": "Desça até uma posição confortável de agachamento e sustente, mantendo o peso distribuído nos pés.",
    "Alongamento de pernas": "Alongue suavemente a parte posterior das pernas, sem quicar e sem forçar a amplitude.",
    "Dead bug": "Deitada de costas, estenda braço e perna opostos mantendo a lombar estável. Alterne os lados.",
    "Prancha baixa": "Apoie antebraços e pontas dos pés, mantenha cabeça, tronco e quadril alinhados.",
    "Bird dog": "Em quatro apoios, estenda braço e perna opostos sem girar o quadril. Alterne com controle.",
    "Abdominal curto": "Eleve levemente cabeça e ombros contraindo o abdômen, sem puxar o pescoço.",
    "Respiração e relaxamento": "Inspire pelo nariz e solte o ar lentamente, relaxando ombros e mandíbula.",
    "Mobilidade de ombros": "Faça círculos lentos com os braços e movimentos de abrir e fechar sem elevar os ombros em excesso.",
    "Flexão na parede": "Apoie as mãos na parede, flexione os cotovelos aproximando o tronco e empurre para voltar.",
    "Prancha alta": "Com mãos abaixo dos ombros, estenda as pernas e mantenha o corpo alinhado e abdômen ativo.",
    "Superman": "De bruços, eleve suavemente braços e pernas, sem forçar a lombar, e retorne.",
    "Alongamento peitoral": "Apoie o antebraço em uma parede e gire o tronco levemente para o lado oposto.",
  };
  return guidance[name] ?? "Execute devagar, com postura confortável e movimento controlado. Reduza a amplitude ou faça uma pausa se sentir desconforto.";
}

function PageHeading({kicker,title,description}:{kicker:string;title:string;description:string}) { return <div className="page-heading"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{description}</p></div>; }

function HomePage({done,history,start,setTab,unlockedDay,completedDays,nextUnlockAt,dayWorkout}:{done:string[];history:WorkoutSession[];start:(w:Workout,day?:number)=>void;setTab:(t:Tab)=>void;unlockedDay:number;completedDays:number[];nextUnlockAt:string|null;dayWorkout:(day:number)=>Workout}) {
  const totalSessions = history.length || done.length;
  const totalMinutes = history.length ? history.reduce((sum, session) => sum + session.duration, 0) : done.length * 18;
  const current = completedDays.includes(unlockedDay) ? Math.min(31, unlockedDay + 1) : unlockedDay;
  return <><div className="welcome-row"><div><span className="eyebrow">SUA JORNADA COMEÇA NO SEU RITMO</span><h1>Olá, que bom ter você <em>por aqui.</em></h1><p>Um treino por dia. Cada etapa libera a próxima no seu tempo.</p></div><div className="welcome-flower">✿</div></div>
    <section className="hero-card"><div className="hero-copy"><span className="hero-tag"><Sparkles size={14}/> DIA {current} DA SUA JORNADA</span><h2>Um pouco melhor<br/>a cada movimento.</h2><p>{nextUnlockAt ? "Seu próximo treino será liberado 24 horas após a conclusão do último." : "Seu treino de hoje está pronto. Vamos começar?"}</p><button className="button-light" onClick={()=>start(dayWorkout(current),current)}>{completedDays.includes(current)?"Treino concluído":"Começar treino"} <ArrowRight size={17}/></button></div><div className="hero-illustration"><div className="sun-disc"/><div className="hero-person">♀</div><span className="hero-caption">FORÇA • EQUILÍBRIO • VOCÊ</span></div></section>
    <div className="stats-grid"><Stat icon={Flame} label="Sua jornada" value={totalSessions ? totalSessions + " treinos" : "Comece hoje"} note="Continue assim!"/><Stat icon={Clock3} label="Tempo em movimento" value={totalMinutes + " min"} note="Cada minuto conta"/><Stat icon={Award} label="Dias concluídos" value={String(completedDays.length)} note="Sua evolução começa aqui"/></div>
    <div className="section-heading"><div><span className="eyebrow">SEU CALENDÁRIO</span><h2>Jornada de 31 dias</h2></div><button className="text-link" onClick={()=>setTab("Treinos")}>Ver calendário <ArrowRight size={16}/></button></div>
    <JourneyCalendar unlockedDay={unlockedDay} completedDays={completedDays} nextUnlockAt={nextUnlockAt} dayWorkout={dayWorkout} start={start}/>
    <div className="bottom-note"><Heart size={18}/><span>Não precisa ser perfeito. Só precisa ser seu.</span><span className="note-right">UM DIA DE CADA VEZ</span></div>
  </>;
}
function WorkoutPage({items,query,setQuery,start,unlockedDay,completedDays,nextUnlockAt,dayWorkout}:{items:Workout[];query:string;setQuery:(v:string)=>void;start:(w:Workout,day?:number)=>void;unlockedDay:number;completedDays:number[];nextUnlockAt:string|null;dayWorkout:(day:number)=>Workout}) {
  return <><PageHeading kicker="SUA JORNADA" title="Um treino por dia." description="Conclua o treino liberado e aguarde 24 horas para desbloquear a próxima etapa."/><JourneyCalendar unlockedDay={unlockedDay} completedDays={completedDays} nextUnlockAt={nextUnlockAt} dayWorkout={dayWorkout} start={start}/><div className="section-heading"><div><span className="eyebrow">BIBLIOTECA DE MOVIMENTOS</span><h2>Treinos da jornada</h2></div></div><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por treino, foco ou nível..."/></div><div className="workout-grid">{items.map(w=><WorkoutCard key={w.title} workout={w} start={()=>{const day=Array.from({length:31},(_,i)=>i+1).find(d=>dayWorkout(d).title===w.title && d<=unlockedDay && !completedDays.includes(d));if(day)start(w,day)}}/>)}</div>{items.length===0&&<p className="empty-state">Não encontramos treinos com esse termo. Tente outra busca.</p>}</>;
}

function JourneyCalendar({unlockedDay,completedDays,nextUnlockAt,dayWorkout,start}:{unlockedDay:number;completedDays:number[];nextUnlockAt:string|null;dayWorkout:(day:number)=>Workout;start:(w:Workout,day?:number)=>void}) {
  const remaining = nextUnlockAt ? Math.max(0,new Date(nextUnlockAt).getTime()-Date.now()) : 0;
  const hours = Math.floor(remaining/3600000);
  const minutes = Math.floor((remaining%3600000)/60000);
  return <section className="journey-panel"><div className="journey-summary"><div><span className="eyebrow">DIA 0 AO DIA 31</span><h3>{completedDays.length} de 31 treinos concluídos</h3><p>{nextUnlockAt ? `Próximo treino em aproximadamente ${hours}h ${minutes}min` : "Seu próximo treino liberado está esperando por você."}</p></div><div className="journey-progress"><span style={{width:(completedDays.length/31*100)+"%"}}/></div></div><div className="journey-calendar">{Array.from({length:32},(_,i)=>{const day=i;const isStart=day===0;const isDone=completedDays.includes(day);const isUnlocked=!isStart && day<=unlockedDay && !isDone;const isLocked=!isStart && !isDone && !isUnlocked;return <button key={day} className={`journey-day ${isStart?"journey-start":isDone?"journey-done":isUnlocked?"journey-unlocked":"journey-locked"}`} disabled={!isUnlocked} onClick={()=>start(dayWorkout(day),day)} aria-label={isStart?"Dia 0, início da jornada":`Dia ${day}: ${isDone?"concluído":isUnlocked?"desbloqueado":"bloqueado"}`}><span className="journey-day-number">{isStart?"INÍCIO":day}</span>{isDone?<Check size={17}/>:isLocked?<Lock size={16}/>:isStart?<Sparkles size={16}/>:<Dumbbell size={16}/>}<small>{isStart?"Dia 0":isDone?"Concluído":isLocked?"Bloqueado":"Liberado"}</small></button>})}</div></section>;
}

