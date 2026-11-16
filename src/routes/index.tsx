import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, ArrowRight, Award, BarChart3, CalendarDays, Check, ChevronRight,
  Clock3, Dumbbell, Flame, Heart, Home, Search, Settings,
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
        const data = JSON.parse(saved) as { done?: string[]; history?: WorkoutSession[]; goal?: string; level?: string; days?: string; challengeDay?: number; challengeStarted?: boolean };
        if (Array.isArray(data.done)) setDone(data.done);
        if (Array.isArray(data.history)) setHistory(data.history);
        if (typeof data.goal === "string") setGoal(data.goal);
        if (typeof data.level === "string") setLevel(data.level);
        if (typeof data.days === "string") setDays(data.days);
        if (typeof data.challengeDay === "number") setChallengeDay(Math.min(7, Math.max(0, data.challengeDay)));
        if (typeof data.challengeStarted === "boolean") setChallengeStarted(data.challengeStarted);
      }
    } catch { /* Estado local inválido: mantém os padrões iniciais. */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("calistenia-asiatica-state", JSON.stringify({ done, history, goal, level, days, challengeDay, challengeStarted }));
  }, [done, history, goal, level, days, challengeDay, challengeStarted, hydrated]);
  const filtered = useMemo(() => workouts.filter(w => (w.title + w.focus + w.level).toLowerCase().includes(query.toLowerCase())), [query]);
  const start = (w: Workout) => { setActive(w); setStep(0); };
  const finish = () => {
    if (active) {
      if (!done.includes(active.title)) setDone([...done, active.title]);
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
          {tab === "Início" && <HomePage done={done} history={history} start={start} setTab={setTab} />}
          {tab === "Treinos" && <WorkoutPage items={filtered} query={query} setQuery={setQuery} start={start} />}
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
  const variant =
    /flexão/i.test(name) ? "pushup" :
    /prancha/i.test(name) ? "plank" :
    /dead bug/i.test(name) ? "deadbug" :
    /bird dog/i.test(name) ? "birddog" :
    /superman/i.test(name) ? "superman" :
    /abdominal/i.test(name) ? "crunch" :
    /ponte|elevação pélvica/i.test(name) ? "bridge" :
    /coice/i.test(name) ? "kick" :
    /abdução/i.test(name) ? "sideleg" :
    /afundo/i.test(name) ? "lunge" :
    /marcha|passo lateral|joelhos/i.test(name) ? "march" :
    /agachamento/i.test(name) ? "squat" : "mobility";
  const floor = ["pushup","plank","deadbug","birddog","superman","crunch","bridge","kick","sideleg"].includes(variant);
  const labels:Record<string,string> = {
    pushup:"FLEXIONE E EMPURRE",plank:"CORPO ALINHADO",deadbug:"BRAÇO E PERNA OPOSTOS",
    birddog:"ESTENDA LADOS OPOSTOS",superman:"ELEVAÇÃO SUAVE",crunch:"CONTRAÇÃO ABDOMINAL",
    bridge:"ELEVE O QUADRIL",kick:"ESTENDA A PERNA",sideleg:"ABRA A PERNA",
    lunge:"PASSO PARA TRÁS",march:"MOVIMENTO ALTERNADO",squat:"DESÇA COM CONTROLE",mobility:"MOVIMENTO LEVE"
  };
  const pose = variant === "pushup" || variant === "plank" ? <g className={`figure figure-${variant}`}>
    <path className="limb" d="M78 143 L119 143 L169 129 L215 129 L249 129"/>
    <path className="limb" d="M118 140 L100 157 L88 157 M215 129 L236 148 L253 148"/>
    <path className="arm" d="M139 119 L119 144 L109 157 M153 119 L173 143 L183 157"/>
    <path className="torso" d="M119 108 Q165 96 215 111 L220 130 Q167 139 118 128 Z"/>
    <path className="head" d="M105 111 Q91 103 97 89 Q103 77 117 82 Q129 89 121 103 L115 112 Z"/>
    <path className="hair" d="M97 94 Q94 77 111 76 Q126 78 129 91 Q115 84 106 91 Z"/>
  </g> : variant === "deadbug" ? <g className="figure figure-deadbug">
    <path className="limb" d="M112 122 L86 94 L66 80 M112 122 L94 145 L78 153"/>
    <path className="limb" d="M205 121 L229 91 L250 79 M205 121 L229 145 L248 153"/>
    <path className="arm" d="M132 111 L113 80 L96 67 M185 111 L203 83 L220 70"/>
    <path className="torso" d="M115 106 Q157 91 204 106 L210 128 Q159 140 111 128 Z"/>
    <path className="head" d="M92 116 Q78 108 84 94 Q90 82 104 87 Q116 94 108 108 L102 117 Z"/>
    <path className="hair" d="M84 99 Q81 81 99 80 Q113 82 116 95 Q103 88 93 95 Z"/>
  </g> : variant === "birddog" ? <g className="figure figure-birddog">
    <path className="limb" d="M101 131 L82 151 L68 151 M192 130 L211 151 L229 151"/>
    <path className="limb" d="M188 119 L222 91 L247 81"/>
    <path className="arm" d="M117 118 L93 94 L68 87 M168 122 L184 146 L194 156"/>
    <path className="torso" d="M111 108 Q153 95 197 108 L202 130 Q153 139 105 129 Z"/>
    <path className="head" d="M102 110 Q88 101 94 88 Q101 76 114 82 Q126 89 118 103 L112 112 Z"/>
    <path className="hair" d="M94 94 Q91 77 108 76 Q122 78 125 91 Q112 85 102 91 Z"/>
  </g> : variant === "bridge" || variant === "kick" || variant === "sideleg" ? <g className={`figure figure-${variant}`}>
    <path className="limb" d="M82 146 L111 146 L147 146"/>
    <path className="limb" d={variant==="bridge"?"M177 119 L216 143 L252 143":variant==="kick"?"M174 120 L212 100 L246 91":"M174 120 L213 96 L250 91"}/>
    <path className="limb" d="M176 119 L199 146 L219 146"/>
    <path className="arm" d="M110 124 L95 146 L81 146"/>
    <path className="torso" d={variant==="bridge"?"M103 120 Q146 80 187 104 L204 121 Q151 134 110 139 Z":"M104 117 Q147 100 185 111 L197 130 Q148 137 107 134 Z"}/>
    <path className="head" d="M79 116 Q65 108 71 95 Q77 82 90 88 Q102 94 94 108 L89 117 Z"/>
    <path className="hair" d="M71 99 Q68 82 85 82 Q99 83 102 96 Q88 89 78 96 Z"/>
  </g> : variant === "superman" || variant === "crunch" ? <g className={`figure figure-${variant}`}>
    <path className="limb" d="M104 128 L74 105 L51 94 M202 128 L232 105 L257 94"/>
    <path className="limb" d="M130 129 L113 151 L96 151 M185 129 L204 151 L221 151"/>
    <path className="torso" d="M103 113 Q157 97 207 113 L213 133 Q159 143 100 133 Z"/>
    <path className="head" d="M89 119 Q75 110 81 96 Q88 83 101 89 Q113 96 105 110 L99 120 Z"/>
    <path className="hair" d="M81 100 Q78 83 95 82 Q109 84 112 97 Q99 90 89 97 Z"/>
  </g> : variant === "lunge" || variant === "squat" || variant === "march" ? <g className={`figure figure-${variant}`}>
    <path className="limb back-leg" d={variant==="lunge"?"M146 119 L116 139 L105 159":variant==="squat"?"M143 119 L124 140 L116 159":"M145 119 L126 141 L121 159"}/>
    <path className="limb front-leg" d={variant==="lunge"?"M164 118 L195 136 L224 136 L242 153":variant==="march"?"M164 118 L191 133 L210 111 L226 111":"M163 118 L188 140 L202 159"}/>
    <path className="arm" d="M139 73 L111 98 L101 119 M166 73 L191 97 L204 116"/>
    <path className="torso" d="M137 62 Q153 54 169 63 L174 112 Q154 124 133 111 Z"/>
    <path className="head" d="M139 43 Q126 29 137 16 Q150 5 162 17 Q171 30 160 43 L154 51 Z"/>
    <path className="hair" d="M135 29 Q131 10 149 8 Q165 9 169 26 Q157 18 146 24 Z"/>
  </g> : <g className="figure figure-mobility">
    <path className="limb" d="M145 112 L117 143 L91 151 M161 112 L190 142 L216 151"/>
    <path className="arm" d="M139 75 L105 54 L81 64 M163 75 L197 54 L221 64"/>
    <path className="torso" d="M137 62 Q153 54 169 63 L174 112 Q154 124 133 111 Z"/>
    <path className="head" d="M139 43 Q126 29 137 16 Q150 5 162 17 Q171 30 160 43 L154 51 Z"/>
    <path className="hair" d="M135 29 Q131 10 149 8 Q165 9 169 26 Q157 18 146 24 Z"/>
  </g>;
  return <div className={`exercise-demo demo-${variant}`}>
    <div className="demo-heading"><span className="demo-live"><i/> DEMONSTRAÇÃO DO MOVIMENTO</span><span>GUIA VISUAL</span></div>
    <div className="demo-stage">
      <div className="demo-halo"/>
      <svg className="demo-visual" viewBox="0 0 320 190" role="img" aria-label={`Posição ilustrada para ${name}`}>
        <defs>
          <linearGradient id="outfitPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff9dcc"/><stop offset="1" stopColor="#c9367f"/></linearGradient>
          <linearGradient id="skinTone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffddca"/><stop offset="1" stopColor="#df967f"/></linearGradient>
        </defs>
        <ellipse cx="158" cy="166" rx="112" ry="8" className="demo-shadow"/>
        {floor ? <rect x="35" y="151" width="250" height="11" rx="5.5" className="demo-mat"/> : <path d="M24 165 H296" className="demo-ground"/>}
        <g className="demo-motion-arrow"><path d="M267 45 Q289 66 267 89"/><path d="M259 82 L267 90 L275 82"/></g>
        {pose}
      </svg>
      <div className="demo-step-pill"><span>✦</span> {labels[variant]}</div>
    </div>
    <div className="demo-footer"><strong>{labels[variant]}</strong><span>Observe o alinhamento e execute sem pressa</span></div>
  </div>;
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

function HomePage({done,history,start,setTab}:{done:string[];history:WorkoutSession[];start:(w:Workout)=>void;setTab:(t:Tab)=>void}) {
  const totalSessions = history.length || done.length;
  const totalMinutes = history.length ? history.reduce((sum, session) => sum + session.duration, 0) : done.length * 18;
  return <><div className="welcome-row"><div><span className="eyebrow">SUA JORNADA COMEÇA NO SEU RITMO</span><h1>Olá, que bom ter você <em>por aqui.</em></h1><p>Seu corpo é sua casa. Cuide dele com carinho, um movimento de cada vez.</p></div><div className="welcome-flower">✿</div></div>
    <section className="hero-card"><div className="hero-copy"><span className="hero-tag"><Sparkles size={14}/> SEU MOMENTO DE HOJE</span><h2>Um pouco melhor<br/>a cada movimento.</h2><p>Comece com um treino pensado para você e transforme intenção em consistência.</p><button className="button-light" onClick={()=>start(workouts[0])}>Começar treino <ArrowRight size={17}/></button></div><div className="hero-illustration"><div className="sun-disc"/><div className="hero-person">♀</div><span className="hero-caption">FORÇA • EQUILÍBRIO • VOCÊ</span></div></section>
    <div className="stats-grid"><Stat icon={Flame} label="Sua jornada" value={totalSessions ? totalSessions + " treinos" : "Comece hoje"} note="Continue assim!"/><Stat icon={Clock3} label="Tempo em movimento" value={totalMinutes + " min"} note="Cada minuto conta"/><Stat icon={Award} label="Treinos concluídos" value={String(totalSessions)} note="Sua evolução começa aqui"/></div>
    <div className="section-heading"><div><span className="eyebrow">FEITO PARA VOCÊ</span><h2>Seu próximo treino</h2></div><button className="text-link" onClick={()=>setTab("Treinos")}>Ver todos <ArrowRight size={16}/></button></div>
    <div className="workout-grid">{workouts.slice(0,3).map(w=><WorkoutCard key={w.title} workout={w} start={start}/>)}</div>
    <div className="bottom-note"><Heart size={18}/><span>Não precisa ser perfeito. Só precisa ser seu.</span><span className="note-right">UM DIA DE CADA VEZ</span></div>
  </>;
}

function Stat({icon:Icon,label,value,note}:{icon:typeof Flame;label:string;value:string;note:string}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{note}</small></div>; }

function WorkoutCard({workout,start}:{workout:Workout;start:(w:Workout)=>void}) { return <article className="workout-card"><div className={"workout-art "+workout.color}><span>{workout.focus}</span><div className="art-symbol">{workout.focus==="Full body"?"◉":workout.focus==="Inferiores"?"✿":workout.focus==="Abdômen"?"◌":"〰"}</div></div><div className="workout-info"><div className="workout-meta"><span>{workout.level}</span><span><Clock3 size={13}/> {workout.time}</span></div><h3>{workout.title}</h3><p>{workout.description}</p><button className="card-action" onClick={()=>start(workout)}>Ver treino <ArrowRight size={15}/></button></div></article>; }

function WorkoutPage({items,query,setQuery,start}:{items:Workout[];query:string;setQuery:(v:string)=>void;start:(w:Workout)=>void}) { return <><PageHeading kicker="MOVIMENTO COM INTENÇÃO" title="Encontre seu ritmo." description="Treinos que acompanham sua fase, seu tempo e seus objetivos."/><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por treino, foco ou nível..."/></div><div className="filter-pills"><span className="filter-active">Todos os treinos</span><span>Iniciante</span><span>Intermediário</span><span>Avançado</span></div><div className="workout-grid">{items.map(w=><WorkoutCard key={w.title} workout={w} start={start}/>)}</div>{items.length===0&&<p className="empty-state">Não encontramos treinos com esse termo. Tente outra busca.</p>}</>; }

function ExplorePage({goal,setGoal,setTab,start,challengeStarted,challengeDay,onStartChallenge}:{goal:string;setGoal:(v:string)=>void;setTab:(t:Tab)=>void;start:(w:Workout)=>void;challengeStarted:boolean;challengeDay:number;onStartChallenge:()=>void}) { const goals=[["Perder peso","Movimente-se com leveza e constância","↗"],["Ganhar massa","Construa força progressivamente","✳"],["Definição","Encontre equilíbrio entre força e controle","◇"],["Fortalecimento","Uma base forte para todos os movimentos","◉"],["Mobilidade","Mais liberdade para se movimentar","〰"]]; return <><PageHeading kicker="EXPLORE POSSIBILIDADES" title="O que faz sentido para você?" description="Escolha um caminho. A sua jornada pode mudar sempre que você precisar."/><div className="goal-grid">{goals.map(([name,desc,symbol])=><button key={name} onClick={()=>{setGoal(name);setTab("Treinos")}} className={goal===name?"goal-card goal-selected":"goal-card"}><span className="goal-symbol">{symbol}</span><strong>{name}</strong><small>{desc}</small><ChevronRight size={18}/></button>)}</div><div className="section-heading"><div><span className="eyebrow">COMECE POR AQUI</span><h2>Pequenos desafios, grandes hábitos</h2></div></div><div className="challenge-card"><div className="challenge-icon"><Target size={26}/></div><div><span className="eyebrow">DESAFIO DE 7 ETAPAS</span><h3>{challengeDay >= 7 ? "Desafio concluído!" : challengeStarted ? `Você está na etapa ${challengeDay + 1}` : "Uma semana por você"}</h3><p>{challengeDay >= 7 ? "Parabéns por completar sua semana de movimento." : "Sete etapas para criar espaço na rotina para se movimentar. No seu ritmo, sem pressão."}</p><div className="challenge-days">{Array.from({length:7},(_,i)=><span key={i} className={i<challengeDay?"day-done":i===challengeDay&&challengeStarted?"day-current":""}>{i<challengeDay?"✓":i+1}</span>)}</div></div><button className="button-primary" onClick={()=>challengeStarted?start(workouts[Math.min(challengeDay,workouts.length-1)]):onStartChallenge()}>{challengeDay>=7?"Repetir treino":challengeStarted?"Fazer treino":"Começar desafio"} <ArrowRight size={16}/></button></div></>; }

function ProgressPage({done,history}:{done:string[];history:WorkoutSession[]}) {
  const totalSessions = history.length || done.length;
  const totalMinutes = history.length ? history.reduce((sum, session) => sum + session.duration, 0) : done.length * 18;
  const legacyItems = done.filter(title => !history.some(session => session.title === title));
  return <><PageHeading kicker="CADA PASSO CONTA" title="Olha o quanto você já fez." description="A evolução não acontece de um dia para o outro. Ela acontece um dia de cada vez."/><div className="stats-grid"><Stat icon={Dumbbell} label="Treinos concluídos" value={String(totalSessions)} note="Sua dedicação"/><Stat icon={Clock3} label="Minutos ativos" value={totalMinutes+" min"} note="Tempo investido em você"/><Stat icon={Flame} label="Etapas concluídas" value={totalSessions?totalSessions+" treinos":"Comece hoje"} note="Constância é tudo"/></div><div className="progress-panel"><div className="section-heading"><div><span className="eyebrow">SEU HISTÓRICO</span><h2>Treinos realizados</h2></div><CalendarDays size={20}/></div>{totalSessions===0?<div className="empty-state"><div className="empty-icon"><BarChart3 size={28}/></div><h3>Sua história começa hoje.</h3><p>Conclua seu primeiro treino e ele aparecerá aqui.</p></div>:<>{history.slice().reverse().map(session=><div className="history-row" key={session.id}><span className="history-check"><Check size={16}/></span><div><strong>{session.title}</strong><small>Treino concluído • {session.duration} min</small></div><span className="history-date">{new Date(session.completedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span></div>)}{legacyItems.map((title,index)=><div className="history-row" key={`legacy-${index}`}><span className="history-check"><Check size={16}/></span><div><strong>{title}</strong><small>Treino concluído • data não registrada</small></div><span className="history-date">Anterior</span></div>)}</>}</div><p className="gentle-reminder"><Heart size={17}/> Compare-se apenas com quem você era ontem.</p></>;
}

function ProfilePage({goal,setGoal,level,setLevel,days,setDays,setOnboarding}:{goal:string;setGoal:(v:string)=>void;level:string;setLevel:(v:string)=>void;days:string;setDays:(v:string)=>void;setOnboarding:(v:boolean)=>void}) { return <><PageHeading kicker="SEU ESPAÇO" title="Sua jornada, suas escolhas." description="Um plano que respeita seu momento e evolui junto com você."/><div className="profile-card"><div className="profile-avatar">M</div><div><h2>Minha jornada</h2><p>Você está construindo um hábito para a vida.</p></div><span className="profile-badge"><Sparkles size={14}/> Em evolução</span></div><div className="settings-list"><div className="setting-row"><div><strong>Meu objetivo</strong><small>{goal}</small></div><button onClick={()=>setOnboarding(true)}>Editar <ChevronRight size={16}/></button></div><div className="setting-row"><div><strong>Nível de treino</strong><small>{level}</small></div><button onClick={()=>setOnboarding(true)}>Editar <ChevronRight size={16}/></button></div><div className="setting-row"><div><strong>Disponibilidade</strong><small>{days} por semana</small></div><button onClick={()=>setOnboarding(true)}>Editar <ChevronRight size={16}/></button></div></div><div className="privacy-note"><Heart size={18}/><span>Seu corpo, seu tempo, suas regras. Ajuste seu plano sempre que precisar.</span></div></>; }
