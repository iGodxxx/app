import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, ArrowRight, Award, BarChart3, CalendarDays, Check, ChevronRight,
  Clock3, Dumbbell, Flame, Heart, Home, Play, Plus, Search, Settings,
  Sparkles, Target, UserRound, Waves, X, Zap
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

const workouts: Workout[] = [
  { title: "Corpo inteiro em movimento", level: "Iniciante", time: "18 min", focus: "Full body", color: "peach", description: "Uma sequência leve para ativar o corpo todo e construir consistência.", exercises: ["Aquecimento articular", "Agachamento livre", "Flexão inclinada", "Ponte de glúteos", "Prancha com joelhos"] },
  { title: "Pernas & glúteos", level: "Intermediário", time: "24 min", focus: "Inferiores", color: "lilac", description: "Fortaleça pernas e glúteos com movimentos controlados e progressivos.", exercises: ["Agachamento sumô", "Afundo alternado", "Elevação pélvica", "Agachamento isométrico", "Alongamento de pernas"] },
  { title: "Core forte", level: "Iniciante", time: "12 min", focus: "Abdômen", color: "sage", description: "Estabilidade e consciência corporal para fortalecer a região central.", exercises: ["Dead bug", "Prancha baixa", "Bird dog", "Abdominal curto", "Respiração e relaxamento"] },
  { title: "Braços & postura", level: "Intermediário", time: "20 min", focus: "Superiores", color: "rose", description: "Trabalhe braços, ombros e postura sem precisar de equipamentos.", exercises: ["Mobilidade de ombros", "Flexão na parede", "Prancha alta", "Superman", "Alongamento peitoral"] },
];

const nav: { label: Tab; icon: typeof Home }[] = [
  { label: "Início", icon: Home }, { label: "Treinos", icon: Dumbbell }, { label: "Explorar", icon: Search }, { label: "Evolução", icon: BarChart3 }, { label: "Perfil", icon: UserRound },
];

function App() {
  const [tab, setTab] = useState<Tab>("Início");
  const [active, setActive] = useState<Workout | null>(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState("Definição");
  const [level, setLevel] = useState("Iniciante");
  const [days, setDays] = useState("4 dias");
  const [onboarding, setOnboarding] = useState(false);
  const filtered = useMemo(() => workouts.filter(w => (w.title + w.focus + w.level).toLowerCase().includes(query.toLowerCase())), [query]);
  const start = (w: Workout) => { setActive(w); setStep(0); };
  const finish = () => { if (active && !done.includes(active.title)) setDone([...done, active.title]); setActive(null); setTab("Evolução"); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Waves size={22}/></span><span>calistenia<span className="brand-light">asiática</span><small>MOVE WITH PURPOSE</small></span></div>
        <div className="side-label">MENU</div>
        {nav.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "side-link selected" : "side-link"} onClick={() => setTab(label)}><Icon size={18}/>{label}{label === "Evolução" && done.length > 0 ? <span className="side-count">{done.length}</span> : null}</button>)}
        <div className="sidebar-bottom"><div className="side-quote">“Pequenos passos todos os dias criam grandes mudanças.”</div><div className="profile-mini"><div className="avatar">M</div><div><strong>Minha jornada</strong><small>Seu espaço de evolução</small></div><Settings size={17}/></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="mobile-brand">✿ calisteniaasiática</div><div className="breadcrumb">Sua jornada <span>/</span> {tab}</div><div className="top-actions"><span className="streak"><Flame size={16}/> {done.length + 1} dias</span><button className="icon-button" aria-label="Perfil" onClick={() => setTab("Perfil")}><UserRound size={19}/></button></div></header>
        <div className="content">
          {tab === "Início" && <HomePage done={done} start={start} setTab={setTab} />}
          {tab === "Treinos" && <WorkoutPage items={filtered} query={query} setQuery={setQuery} start={start} />}
          {tab === "Explorar" && <ExplorePage setGoal={setGoal} goal={goal} setTab={setTab} start={start} />}
          {tab === "Evolução" && <ProgressPage done={done} />}
          {tab === "Perfil" && <ProfilePage goal={goal} setGoal={setGoal} level={level} setLevel={setLevel} days={days} setDays={setDays} setOnboarding={setOnboarding} />}
        </div>
      </main>
      <nav className="mobile-nav">{nav.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "mobile-link active" : "mobile-link"} onClick={() => setTab(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      {active && <div className="modal-backdrop"><section className="workout-modal"><div className="modal-head"><span className="eyebrow">SEU TREINO GUIADO</span><button className="icon-button" onClick={() => setActive(null)} aria-label="Fechar"><X size={20}/></button></div><div className="workout-progress"><span style={{width: ((step + 1) / active.exercises.length * 100) + "%"}}/></div><div className="exercise-count">EXERCÍCIO {step + 1} DE {active.exercises.length}</div><div className="exercise-art"><div className="exercise-orbit"><Activity size={58}/></div></div><h2>{active.exercises[step]}</h2><p className="muted">Faça o movimento com controle, respeitando seu ritmo e sua amplitude confortável.</p><div className="tip-box"><Sparkles size={18}/><span><strong>Dica de execução</strong> Mantenha a respiração fluida e priorize a técnica antes da velocidade.</span></div><div className="modal-actions"><button className="button-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Anterior</button>{step < active.exercises.length - 1 ? <button className="button-primary" onClick={() => setStep(step + 1)}>Próximo exercício <ArrowRight size={17}/></button> : <button className="button-primary" onClick={finish}><Check size={17}/> Concluir treino</button>}</div></section></div>}
      {onboarding && <div className="modal-backdrop"><section className="settings-modal"><div className="modal-head"><span className="eyebrow">AJUSTE SUA JORNADA</span><button className="icon-button" onClick={() => setOnboarding(false)}><X size={20}/></button></div><h2>Seu plano, seu ritmo.</h2><p className="muted">Personalize suas preferências de treino.</p><label>Seu objetivo</label><div className="choice-grid">{["Perder peso","Ganhar massa","Definição","Fortalecimento","Mobilidade"].map(x=><button className={goal===x?"choice chosen":"choice"} onClick={()=>setGoal(x)} key={x}>{x}</button>)}</div><label>Nível atual</label><div className="choice-grid">{["Iniciante","Intermediário","Avançado"].map(x=><button className={level===x?"choice chosen":"choice"} onClick={()=>setLevel(x)} key={x}>{x}</button>)}</div><label>Disponibilidade semanal</label><div className="choice-grid">{["2 dias","3 dias","4 dias","5 dias"].map(x=><button className={days===x?"choice chosen":"choice"} onClick={()=>setDays(x)} key={x}>{x}</button>)}</div><button className="button-primary full" onClick={()=>setOnboarding(false)}>Salvar preferências <Check size={17}/></button></section></div>}
    </div>
  );
}

function PageHeading({kicker,title,description}:{kicker:string;title:string;description:string}) { return <div className="page-heading"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{description}</p></div>; }

function HomePage({done,start,setTab}:{done:string[];start:(w:Workout)=>void;setTab:(t:Tab)=>void}) {
  return <><div className="welcome-row"><div><span className="eyebrow">SEGUNDA-FEIRA, SUA NOVA CHANCE</span><h1>Olá, que bom ter você <em>por aqui.</em></h1><p>Seu corpo é sua casa. Cuide dele com carinho, um movimento de cada vez.</p></div><div className="welcome-flower">✿</div></div>
    <section className="hero-card"><div className="hero-copy"><span className="hero-tag"><Sparkles size={14}/> SEU MOMENTO DE HOJE</span><h2>Um pouco melhor<br/>a cada movimento.</h2><p>Comece com um treino pensado para você e transforme intenção em consistência.</p><button className="button-light" onClick={()=>start(workouts[0])}>Começar treino <ArrowRight size={17}/></button></div><div className="hero-illustration"><div className="sun-disc"/><div className="hero-person">♀</div><span className="hero-caption">FORÇA • EQUILÍBRIO • VOCÊ</span></div></section>
    <div className="stats-grid"><Stat icon={Flame} label="Sequência atual" value={done.length ? done.length + " dias" : "1 dia"} note="Continue assim!"/><Stat icon={Clock3} label="Tempo em movimento" value={done.length * 18 + " min"} note="Cada minuto conta"/><Stat icon={Award} label="Treinos concluídos" value={String(done.length)} note="Sua evolução começa aqui"/></div>
    <div className="section-heading"><div><span className="eyebrow">FEITO PARA VOCÊ</span><h2>Seu próximo treino</h2></div><button className="text-link" onClick={()=>setTab("Treinos")}>Ver todos <ArrowRight size={16}/></button></div>
    <div className="workout-grid">{workouts.slice(0,3).map(w=><WorkoutCard key={w.title} workout={w} start={start}/>)}</div>
    <div className="bottom-note"><Heart size={18}/><span>Não precisa ser perfeito. Só precisa ser seu.</span><span className="note-right">UM DIA DE CADA VEZ</span></div>
  </>;
}

function Stat({icon:Icon,label,value,note}:{icon:typeof Flame;label:string;value:string;note:string}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{note}</small></div>; }

function WorkoutCard({workout,start}:{workout:Workout;start:(w:Workout)=>void}) { return <article className="workout-card"><div className={"workout-art "+workout.color}><span>{workout.focus}</span><div className="art-symbol">{workout.focus==="Full body"?"◉":workout.focus==="Inferiores"?"✿":workout.focus==="Abdômen"?"◌":"〰"}</div></div><div className="workout-info"><div className="workout-meta"><span>{workout.level}</span><span><Clock3 size={13}/> {workout.time}</span></div><h3>{workout.title}</h3><p>{workout.description}</p><button className="card-action" onClick={()=>start(workout)}>Ver treino <ArrowRight size={15}/></button></div></article>; }

function WorkoutPage({items,query,setQuery,start}:{items:Workout[];query:string;setQuery:(v:string)=>void;start:(w:Workout)=>void}) { return <><PageHeading kicker="MOVIMENTO COM INTENÇÃO" title="Encontre seu ritmo." description="Treinos que acompanham sua fase, seu tempo e seus objetivos."/><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por treino, foco ou nível..."/></div><div className="filter-pills"><span className="filter-active">Todos os treinos</span><span>Iniciante</span><span>Intermediário</span><span>Avançado</span></div><div className="workout-grid">{items.map(w=><WorkoutCard key={w.title} workout={w} start={start}/>)}</div>{items.length===0&&<p className="empty-state">Não encontramos treinos com esse termo. Tente outra busca.</p>}</>; }

function ExplorePage({goal,setGoal,setTab,start}:{goal:string;setGoal:(v:string)=>void;setTab:(t:Tab)=>void;start:(w:Workout)=>void}) { const goals=[["Perder peso","Movimente-se com leveza e constância","↗"],["Ganhar massa","Construa força progressivamente","✳"],["Definição","Encontre equilíbrio entre força e controle","◇"],["Fortalecimento","Uma base forte para todos os movimentos","◉"],["Mobilidade","Mais liberdade para se movimentar","〰"]]; return <><PageHeading kicker="EXPLORE POSSIBILIDADES" title="O que faz sentido para você?" description="Escolha um caminho. A sua jornada pode mudar sempre que você precisar."/><div className="goal-grid">{goals.map(([name,desc,symbol])=><button key={name} onClick={()=>{setGoal(name);setTab("Treinos")}} className={goal===name?"goal-card goal-selected":"goal-card"}><span className="goal-symbol">{symbol}</span><strong>{name}</strong><small>{desc}</small><ChevronRight size={18}/></button>)}</div><div className="section-heading"><div><span className="eyebrow">COMECE POR AQUI</span><h2>Pequenos desafios, grandes hábitos</h2></div></div><div className="challenge-card"><div className="challenge-icon"><Target size={26}/></div><div><span className="eyebrow">DESAFIO DE 7 DIAS</span><h3>Uma semana por você</h3><p>Sete dias para criar espaço na rotina para se movimentar. No seu ritmo, sem pressão.</p></div><button className="button-primary" onClick={()=>start(workouts[0])}>Começar <ArrowRight size={16}/></button></div></>; }

function ProgressPage({done}:{done:string[]}) { return <><PageHeading kicker="CADA PASSO CONTA" title="Olha o quanto você já fez." description="A evolução não acontece de um dia para o outro. Ela acontece um dia de cada vez."/><div className="stats-grid"><Stat icon={Dumbbell} label="Treinos concluídos" value={String(done.length)} note="Sua dedicação"/><Stat icon={Clock3} label="Minutos ativos" value={done.length*18+" min"} note="Tempo investido em você"/><Stat icon={Flame} label="Sequência" value={done.length?done.length+" dias":"1 dia"} note="Constância é tudo"/></div><div className="progress-panel"><div className="section-heading"><div><span className="eyebrow">SEU HISTÓRICO</span><h2>Treinos realizados</h2></div><CalendarDays size={20}/></div>{done.length===0?<div className="empty-state"><div className="empty-icon"><BarChart3 size={28}/></div><h3>Sua história começa hoje.</h3><p>Conclua seu primeiro treino e ele aparecerá aqui.</p></div>:done.map((x,i)=><div className="history-row" key={i}><span className="history-check"><Check size={16}/></span><div><strong>{x}</strong><small>Treino concluído • {18} min</small></div><span className="history-date">Hoje</span></div>)}</div><p className="gentle-reminder"><Heart size={17}/> Compare-se apenas com quem você era ontem.</p></>; }

function ProfilePage({goal,setGoal,level,setLevel,days,setDays,setOnboarding}:{goal:string;setGoal:(v:string)=>void;level:string;setLevel:(v:string)=>void;days:string;setDays:(v:string)=>void;setOnboarding:(v:boolean)=>void}) { return <><PageHeading kicker="SEU ESPAÇO" title="Sua jornada, suas escolhas." description="Um plano que respeita seu momento e evolui junto com você."/><div className="profile-card"><div className="profile-avatar">M</div><div><h2>Minha jornada</h2><p>Você está construindo um hábito para a vida.</p></div><span className="profile-badge"><Sparkles size={14}/> Em evolução</span></div><div className="settings-list"><div className="setting-row"><div><strong>Meu objetivo</strong><small>{goal}</small></div><button onClick={()=>setOnboarding(true)}>Editar <ChevronRight size={16}/></button></div><div className="setting-row"><div><strong>Nível de treino</strong><small>{level}</small></div><button onClick={()=>setOnboarding(true)}>Editar <ChevronRight size={16}/></button></div><div className="setting-row"><div><strong>Disponibilidade</strong><small>{days} por semana</small></div><button onClick={()=>setOnboarding(true)}>Editar <ChevronRight size={16}/></button></div></div><div className="privacy-note"><Heart size={18}/><span>Seu corpo, seu tempo, suas regras. Ajuste seu plano sempre que precisar.</span></div></>; }
