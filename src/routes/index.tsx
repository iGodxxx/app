import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
      { property: "og:title", content: "Calistenia Asiática | Seu movimento, sua evolução" },
      { property: "og:description", content: "Treinos de calistenia pensados para sua rotina, seu corpo e seus objetivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Tab = "Início" | "Treinos" | "Explorar" | "Evolução" | "Perfil";
type Workout = { title: string; level: string; time: string; focus: string; color: string; description: string; exercises: string[] };
type WorkoutSession = { id: string; title: string; completedAt: string; duration: number; calories?: number; weightKg?: number };

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

export function App() {
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
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("calistenia-asiatica-state");
      if (saved) {
        const data = JSON.parse(saved) as { done?: string[]; history?: WorkoutSession[]; goal?: string; level?: string; days?: string; weightKg?: number | null; challengeDay?: number; challengeStarted?: boolean; startedAt?: string; unlockedDay?: number; nextUnlockAt?: string | null; completedDays?: number[] };
        if (Array.isArray(data.done)) setDone(data.done);
        if (Array.isArray(data.history)) setHistory(data.history);
        if (typeof data.goal === "string") setGoal(data.goal);
        if (typeof data.level === "string") setLevel(data.level);
        if (typeof data.days === "string") setDays(data.days);
        if (typeof data.weightKg === "number" && Number.isFinite(data.weightKg) && data.weightKg >= 30 && data.weightKg <= 250) setWeightKg(data.weightKg);
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
    localStorage.setItem("calistenia-asiatica-state", JSON.stringify({ done, history, goal, level, days, weightKg, challengeDay, challengeStarted, startedAt: startedAt ?? new Date().toISOString(), unlockedDay, nextUnlockAt, completedDays }));
  }, [done, history, goal, level, days, weightKg, challengeDay, challengeStarted, startedAt, unlockedDay, nextUnlockAt, completedDays, hydrated]);
  const filtered = useMemo(() => workouts.filter(w => (w.title + w.focus + w.level).toLowerCase().includes(query.toLowerCase())), [query]);
  useEffect(() => { if (!nextUnlockAt) return; const check = () => { if (Date.now() >= new Date(nextUnlockAt).getTime()) { setUnlockedDay(day => Math.min(31, day + 1)); setNextUnlockAt(null); } }; check(); const timer = window.setInterval(check, 30_000); return () => window.clearInterval(timer); }, [nextUnlockAt]);
  useEffect(() => { if (hydrated && !startedAt) setStartedAt(new Date().toISOString()); }, [hydrated, startedAt]);
  const dayWorkout = (day: number): Workout => {
    const workout = workouts[(day - 1) % workouts.length];
    if (!workout) throw new Error("Treino indisponível para este dia.");
    return workout;
  };
  const start = (w: Workout, day = unlockedDay) => { if (day > unlockedDay || day < 1 || completedDays.includes(day)) return; setActiveDay(day); setActive(w); setStep(0); };
  const finish = () => {
    if (active) {
      if (!done.includes(active.title)) setDone([...done, active.title]);
      if (!completedDays.includes(activeDay)) {
        setCompletedDays(previous => [...previous, activeDay]);
        if (activeDay < 31) setNextUnlockAt(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
      }
      const duration = Number.parseInt(active.time, 10) || 0;
      const calories = weightKg !== null && weightKg >= 30 && weightKg <= 250 ? estimateWorkoutCalories(active, duration, weightKg, level) : undefined;
      setHistory(previous => [...previous, { id: `${Date.now()}-${previous.length}`, title: active.title, completedAt: new Date().toISOString(), duration, ...(calories !== undefined ? { calories, weightKg: weightKg ?? undefined } : {}) }]);
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
          {tab === "Perfil" && <ProfilePage goal={goal} level={level} days={days} weightKg={weightKg} setOnboarding={setOnboarding} />}
        </div>
      </main>
      <nav className="mobile-nav">{nav.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "mobile-link active" : "mobile-link"} onClick={() => setTab(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      {active && <div className="modal-backdrop"><section className="workout-modal"><div className="modal-head"><span className="eyebrow">SEU TREINO GUIADO</span><button className="icon-button" onClick={() => setActive(null)} aria-label="Fechar"><X size={20}/></button></div><div className="workout-progress"><span style={{width: ((step + 1) / active.exercises.length * 100) + "%"}}/></div><div className="exercise-count">EXERCÍCIO {step + 1} DE {active.exercises.length}</div><ExerciseDemo name={(active.exercises[step] ?? "")} /><h2>{(active.exercises[step] ?? "")}</h2><p className="muted">{exerciseGuidance((active.exercises[step] ?? ""))}</p><p className="safety-hint">Respeite seus limites. Interrompa se sentir dor, tontura ou mal-estar.</p><div className="tip-box"><Sparkles size={18}/><span><strong>Como executar</strong> {exerciseGuidance((active.exercises[step] ?? ""))}<br/><strong>Respiração</strong> Solte o ar durante o esforço e inspire no retorno, sem prender a respiração.</span></div><div className="exercise-prescription"><span><strong>2–3</strong><small>séries</small></span><span><strong>8–12</strong><small>repetições</small></span><span><strong>45s</strong><small>descanso</small></span></div>{weightKg !== null && weightKg >= 30 && weightKg <= 250 ? <div className="calorie-estimate-inline"><Flame size={16}/><span>Estimativa deste treino: <strong>~{estimateWorkoutCalories(active, Number.parseInt(active.time, 10) || 0, weightKg, level)} kcal</strong></span></div> : <button type="button" className="weight-nudge" onClick={()=>{setActive(null);setTab("Perfil");setOnboarding(true)}}>Informe seu peso no perfil para ver a estimativa de calorias</button>}<div className="modal-actions"><button className="button-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Anterior</button>{step < active.exercises.length - 1 ? <button className="button-primary" onClick={() => setStep(step + 1)}>Próximo exercício <ArrowRight size={17}/></button> : <button className="button-primary" onClick={finish}><Check size={17}/> Concluir treino</button>}</div></section></div>}
      {onboarding && <div className="modal-backdrop"><section className="settings-modal"><div className="modal-head"><span className="eyebrow">AJUSTE SUA JORNADA</span><button className="icon-button" onClick={() => setOnboarding(false)}><X size={20}/></button></div><h2>Seu plano, seu ritmo.</h2><p className="muted">Personalize suas preferências de treino.</p><label>Seu objetivo</label><div className="choice-grid">{["Perder peso","Ganhar massa","Definição","Fortalecimento","Mobilidade"].map(x=><button className={goal===x?"choice chosen":"choice"} onClick={()=>setGoal(x)} key={x}>{x}</button>)}</div><label>Nível atual</label><div className="choice-grid">{["Iniciante","Intermediário","Avançado"].map(x=><button className={level===x?"choice chosen":"choice"} onClick={()=>setLevel(x)} key={x}>{x}</button>)}</div><label>Disponibilidade semanal</label><div className="choice-grid">{["2 dias","3 dias","4 dias","5 dias"].map(x=><button className={days===x?"choice chosen":"choice"} onClick={()=>setDays(x)} key={x}>{x}</button>)}</div><label htmlFor="weight-kg">Peso corporal (kg)</label><input id="weight-kg" className="weight-input" type="number" min="30" max="250" step="0.1" placeholder="Ex.: 65" value={weightKg ?? ""} onChange={e=>{const value=e.target.value;setWeightKg(value===""?null:Number(value))}}/><small className="weight-help">Usamos esse dado somente para estimar o gasto calórico.</small><button className="button-primary full" onClick={()=>setOnboarding(false)}>Salvar preferências <Check size={17}/></button></section></div>}
    </div>
  );
}


function estimateWorkoutCalories(workout: Workout, durationMinutes: number, weightKg: number, level: string) {
  // MET aproximado com referência ao Compendium 2024: calistenia leve 2.8, moderada 3.8 e circuito com peso corporal 6.0.
  let met = 3.8;
  if (workout.focus === "Mobilidade" || workout.focus === "Abdômen") met = 2.8;
  else if (workout.focus === "Cardio") met = 4.5;
  else if (workout.level === "Avançado" || level === "Avançado") met = 6.0;
  else if (level === "Intermediário") met = 4.2;
  const kcal = met * 3.5 * weightKg / 200 * durationMinutes;
  return Math.max(0, Math.round(kcal));
}

function ExerciseDemo({name}:{name:string}) {
  const normalized = name.toLocaleLowerCase("pt-BR");
  const video: { src: string; label: string; credit: string; source: string; youtube?: boolean; embed?: boolean } | null =
    /agachamento livre/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/rYTjvY7dm9c", label: "Agachamento livre", credit: "YouTube", source: "https://youtu.be/rYTjvY7dm9c", youtube: true }
    : /agachamento isométrico/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/p7B3hja6s4U", label: "Agachamento isométrico", credit: "YouTube", source: "https://youtu.be/p7B3hja6s4U", youtube: true }
    : /agachamento sumô/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/E4Ls2VkNSHE", label: "Agachamento sumô", credit: "Anand Physical Therapy Academy", source: "https://youtu.be/E4Ls2VkNSHE", youtube: true }
    : /afundo alternado/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/9jJWonbDUb4", label: "Avanço alternado", credit: "YouTube", source: "https://youtu.be/9jJWonbDUb4", youtube: true }
    : /ponte unilateral/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/tcW8Vk6fejw", label: "Elevação de quadril unilateral", credit: "YouTube", source: "https://youtu.be/tcW8Vk6fejw", youtube: true }
    : /ponte de glúteos|elevação pélvica/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/BFds0DZZcHw", label: "Elevação de quadril no solo", credit: "YouTube", source: "https://youtu.be/BFds0DZZcHw", youtube: true }
    : /prancha baixa/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/iRd3uGDCzXM", label: "Prancha", credit: "YouTube", source: "https://youtu.be/iRd3uGDCzXM", youtube: true }
    : /prancha lateral/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/skSkMx95OhA", label: "Prancha lateral", credit: "YouTube", source: "https://youtu.be/skSkMx95OhA", youtube: true }
    : /flexão tradicional/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/EY6M9C4RsZQ", label: "Flexão de braço", credit: "YouTube", source: "https://youtu.be/EY6M9C4RsZQ", youtube: true }
    : /flexão inclinada/.test(normalized)
    ? { src: "https://videos.pexels.com/video-files/6740158/6740158-hd_1920_1080_25fps.mp4", label: "Flexão inclinada", credit: "Mikhail Nilov", source: "https://www.pexels.com/video/a-woman-exercising-in-the-gym-6740158/" }
    : /prancha com joelhos/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/fTDkzk5GcEY", label: "Prancha com joelhos", credit: "Joanna Soh", source: "https://youtu.be/fTDkzk5GcEY", youtube: true }
    : /aquecimento articular/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/oLu9kwDzBdg", label: "Aquecimento geral", credit: "NHS", source: "https://youtu.be/oLu9kwDzBdg", youtube: true }
    : /dead bug/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/so_-E6xr_Ew", label: "Dead bug", credit: "University of Wyoming", source: "https://youtu.be/so_-E6xr_Ew", youtube: true }
    : /bird dog/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/fC2oDpExXOo", label: "Bird dog", credit: "University of Wyoming", source: "https://youtu.be/fC2oDpExXOo", youtube: true }
    : /abdominal curto/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/5uiKrMxaXFA", label: "Abdominal curto", credit: "University of Wyoming", source: "https://youtu.be/5uiKrMxaXFA", youtube: true }
    : /respiração e relaxamento/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/C13Gw4XFfs0", label: "Respiração abdominal", credit: "NHS Inform", source: "https://youtu.be/C13Gw4XFfs0", youtube: true }
    : /mobilidade de ombros/.test(normalized)
    ? { src: "https://player.vimeo.com/video/384087789", label: "Mobilidade de ombros e braços", credit: "Strive & Uplift", source: "https://vimeo.com/384087789", embed: true }
    : /flexão na parede/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/zQjJuQwaiAc", label: "Flexão na parede", credit: "The Diabetes Resistance", source: "https://youtu.be/zQjJuQwaiAc", youtube: true }
    : /prancha alta com toque/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/8WrpdRpIdGg", label: "Prancha alta com toque", credit: "University of Maryland", source: "https://youtu.be/8WrpdRpIdGg", youtube: true }
    : /prancha alta/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/5rGrXCFvfiY", label: "Prancha alta", credit: "University of Maryland", source: "https://youtu.be/5rGrXCFvfiY", youtube: true }
    : /superman/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/uexOGyxLr7E", label: "Superman", credit: "Cleveland Clinic", source: "https://youtu.be/uexOGyxLr7E", youtube: true }
    : /alongamento peitoral/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/nNWfX6wrHrA", label: "Alongamento peitoral", credit: "BCCSA", source: "https://youtu.be/nNWfX6wrHrA", youtube: true }
    : /círculos de ombros/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/X7NtqY9kCCM", label: "Rotação dos ombros", credit: "Leicestershire Partnership NHS Trust", source: "https://youtu.be/X7NtqY9kCCM", youtube: true }
    : /gato e vaca/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/PGDnZ-sCC_o", label: "Gato e vaca", credit: "Doctor O'Donovan", source: "https://youtu.be/PGDnZ-sCC_o", youtube: true }
    : /mobilidade de quadril/.test(normalized)
    ? { src: "https://player.vimeo.com/video/660518448", label: "Círculos de quadril", credit: "Strive & Uplift", source: "https://vimeo.com/660518448", embed: true }
    : /alongamento de posterior|alongamento de pernas/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/xx5WTWo_ado", label: "Alongamento posterior da coxa", credit: "Brighton Physiotherapist", source: "https://youtu.be/xx5WTWo_ado", youtube: true }
    : /respiração profunda/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/IYTZwBzjNC0", label: "Respiração consciente", credit: "NHS Inform", source: "https://youtu.be/IYTZwBzjNC0", youtube: true }
    : /marcha estacionária/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/Ih-JqDrOXBQ", label: "Marcha com elevação dos joelhos", credit: "OriGym", source: "https://youtu.be/Ih-JqDrOXBQ", youtube: true }
    : /passo lateral/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/L9FzqnlmjCE", label: "Passo lateral", credit: "MedStar Health", source: "https://youtu.be/L9FzqnlmjCE", youtube: true }
    : /agachamento curto/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/jaPzvgZFQBI", label: "Agachamento parcial", credit: "Massachusetts General Hospital", source: "https://youtu.be/jaPzvgZFQBI", youtube: true }
    : /elevação alternada de joelhos/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/-aQbL65YHR0", label: "Elevação alternada de joelhos", credit: "OriGym", source: "https://youtu.be/-aQbL65YHR0", youtube: true }
    : /desaceleração/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/Z_d4rVxZTmY", label: "Desaceleração e alongamento", credit: "NHS", source: "https://youtu.be/Z_d4rVxZTmY", youtube: true }
    : /coice em quatro apoios/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/J2DTx5CKdqk", label: "Extensão de quadril em quatro apoios", credit: "Physical Therapy First", source: "https://youtu.be/J2DTx5CKdqk", youtube: true }
    : /abdução lateral/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/g9FtnmsIYgI", label: "Abdução lateral de quadril", credit: "Baptist Health", source: "https://youtu.be/g9FtnmsIYgI", youtube: true }
    : /alongamento de glúteos/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/6G-bKam5tyk", label: "Alongamento de glúteos", credit: "Doctor O'Donovan", source: "https://youtu.be/6G-bKam5tyk", youtube: true }
    : /agachamento com pausa/.test(normalized)
    ? { src: "https://player.vimeo.com/video/476048891", label: "Agachamento com pausa", credit: "Luke Tarbatt", source: "https://vimeo.com/476048891", embed: true }
    : /afundo reverso/.test(normalized)
    ? { src: "https://www.youtube-nocookie.com/embed/gd1a7i7-CMY", label: "Afundo reverso", credit: "University of Wyoming", source: "https://youtu.be/gd1a7i7-CMY", youtube: true }
    : null;

  const kind = /ponte|elevação pélvica/.test(normalized) ? "bridge"
    : /prancha|flexão|push|superman/.test(normalized) ? "floor"
    : /dead bug|abdominal/.test(normalized) ? "core"
    : /bird dog|quatro apoios|coice|abdução/.test(normalized) ? "quadruped"
    : /afundo/.test(normalized) ? "lunge"
    : /agachamento|sumô/.test(normalized) ? "squat"
    : /marcha|passo lateral|joelhos/.test(normalized) ? "cardio"
    : /alongamento|mobilidade|círculos|gato|respiração|desaceleração/.test(normalized) ? "stretch"
    : "standing";

  const movement = /aquecimento articular/.test(normalized) ? "Aquecimento: movimentos articulares"
    : /agachamento sumô/.test(normalized) ? "Agachamento com base ampla"
    : /agachamento isométrico/.test(normalized) ? "Sustentação na posição de agachamento"
    : /agachamento com pausa/.test(normalized) ? "Agachamento com pausa no ponto baixo"
    : /agachamento/.test(normalized) ? "Flexão e extensão dos joelhos e quadril"
    : /afundo/.test(normalized) ? "Passo para trás e descida controlada"
    : /ponte unilateral/.test(normalized) ? "Elevação de quadril com uma perna"
    : /ponte|elevação pélvica/.test(normalized) ? "Elevação e descida do quadril"
    : /flexão na parede/.test(normalized) ? "Flexão com apoio na parede"
    : /flexão inclinada/.test(normalized) ? "Flexão com mãos em apoio elevado"
    : /flexão tradicional/.test(normalized) ? "Flexão de braços no solo"
    : /prancha lateral/.test(normalized) ? "Sustentação lateral do tronco"
    : /prancha/.test(normalized) ? "Sustentação do corpo em linha reta"
    : /dead bug/.test(normalized) ? "Alternância de braço e perna opostos"
    : /bird dog/.test(normalized) ? "Extensão de braço e perna opostos"
    : /abdominal curto/.test(normalized) ? "Pequena elevação dos ombros"
    : /coice/.test(normalized) ? "Extensão de uma perna para trás"
    : /abdução lateral/.test(normalized) ? "Elevação lateral da perna"
    : /superman/.test(normalized) ? "Elevação suave de braços e pernas"
    : /marcha estacionária/.test(normalized) ? "Marcha alternada sem sair do lugar"
    : /passo lateral/.test(normalized) ? "Passos controlados para os lados"
    : /elevação alternada de joelhos/.test(normalized) ? "Elevação alternada dos joelhos"
    : /gato e vaca/.test(normalized) ? "Alternância entre arredondar e estender a coluna"
    : /círculos de ombros|mobilidade de ombros/.test(normalized) ? "Rotação suave dos ombros"
    : /mobilidade de quadril/.test(normalized) ? "Movimento circular e controlado do quadril"
    : /alongamento de posterior|alongamento de pernas/.test(normalized) ? "Alongamento suave da parte posterior das pernas"
    : /alongamento peitoral/.test(normalized) ? "Abertura suave da região do peito"
    : /alongamento de glúteos/.test(normalized) ? "Alongamento confortável dos glúteos"
    : /respiração/.test(normalized) ? "Inspiração e expiração lentas"
    : /desaceleração/.test(normalized) ? "Redução gradual do ritmo"
    : "Movimento lento, controlado e sem impacto";
  const movementClass = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="exercise-demo exercise-video-demo">
      <div className="demo-heading">
        <span className="demo-live"><i/> DEMONSTRAÇÃO DO MOVIMENTO</span>
        <span>{video ? "VÍDEO REAL" : "ANIMAÇÃO GUIADA"}</span>
      </div>
      {video ? (
        <>
          {video.youtube || video.embed ? (
            <iframe className="exercise-real-video" src={video.src} title={video.label} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          ) : (
            <video className="exercise-real-video" src={video.src} autoPlay loop muted playsInline controls preload="metadata" aria-label={video.label} />
          )}
          <div className="demo-footer">
            <strong>{video.label}</strong>
            <span>Vídeo por {video.credit} · <a href={video.source} target="_blank" rel="noreferrer">Fonte {video.youtube ? "YouTube" : video.embed ? "Vimeo" : "Pexels"}</a></span>
          </div>
        </>
      ) : (
        <>
          <div className={`demo-stage demo-stage-${kind} demo-movement-${movementClass}`} role="img" aria-label={`Animação demonstrativa de ${name}`}>
            <div className="demo-halo"/>
            <svg className={`demo-visual figure-${kind}`} viewBox="0 0 360 190" aria-hidden="true">
              <defs>
                <linearGradient id="skinTone" x1="0" x2="1"><stop offset="0" stopColor="#d99b82"/><stop offset="1" stopColor="#f0c2a5"/></linearGradient>
                <linearGradient id="outfitPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f58ab7"/><stop offset="1" stopColor="#c83e83"/></linearGradient>
              </defs>
              <ellipse className="demo-shadow" cx="180" cy="160" rx="100" ry="9"/>
              <path className="demo-ground" d="M45 160H315"/>
              <rect className="demo-mat" x="82" y="151" width="196" height="8" rx="4"/>
              {kind === "bridge" ? (
                <g className="figure figure-bridge">
                  <circle className="head" cx="112" cy="119" r="12"/><path className="hair" d="M101 116q4-17 19-9l5 9-8-3-9 4z"/>
                  <path className="limb" d="M123 128Q153 144 184 132L224 144"/><path className="limb" d="M224 144l22 12m-22-12 8-17"/>
                  <path className="limb" d="M143 139l-3 17m3-17 16 17"/><path className="arm" d="M119 132l-14 18m14-18 2 18"/>
                  <path className="torso" d="M124 124q28 8 48 7l13 9q-28 13-62-2z"/>
                </g>
              ) : kind === "floor" || kind === "core" ? (
                <g className="figure figure-floor">
                  <circle className="head" cx="103" cy="119" r="12"/><path className="hair" d="M92 116q4-17 19-9l5 9-8-3-9 4z"/>
                  <path className="torso" d="M115 112q34-8 72 3l-5 18q-39 2-68-5z"/>
                  <path className="limb" d="M180 119l45 12 38 1m-38-1 25-16"/>
                  <path className="limb" d="M180 125l-18 22-42 2m42-2 30 6"/>
                  <path className="arm" d="M126 119l-22 19-23 1m23-1 18 10"/>
                  <path className="arm" d="M137 119l-8 23"/>
                </g>
              ) : kind === "quadruped" ? (
                <g className="figure figure-birddog">
                  <circle className="head" cx="125" cy="104" r="11"/><path className="hair" d="M115 101q4-15 17-8l5 8-9-2-8 5z"/>
                  <path className="torso" d="M137 104q28-8 52 2l-4 15q-28 5-49-3z"/>
                  <path className="limb" d="M151 117l-4 24-17 12m17-12 19 12"/>
                  <path className="limb" d="M183 114l12 25 17 10m-17-10-2 14"/>
                  <path className="arm" d="M140 110l-20 23-21 1m21-1 13 15"/>
                  <path className="arm" d="M180 108l31-15 28-1"/>
                </g>
              ) : kind === "squat" || kind === "lunge" ? (
                <g className={`figure figure-${kind}`}>
                  <circle className="head" cx="177" cy="42" r="13"/><path className="hair" d="M164 39q4-17 20-9l6 10-10-3-11 5z"/>
                  <path className="torso" d="M164 57q14-7 27 0l7 44-34 0z"/>
                  <path className="arm" d="M166 65l-24 24-13 4m48-28 24 23 13 3"/>
                  <path className="limb" d="M171 99l-20 28-22 8m22-8 18 25h26"/>
                  <path className="limb" d="M190 99l21 23 22 2m-22-2-9 33h25"/>
                </g>
              ) : (
                <g className={`figure figure-${kind}`}>
                  <circle className="head" cx="177" cy="37" r="13"/><path className="hair" d="M164 34q4-17 20-9l6 10-10-3-11 5z"/>
                  <path className="torso" d="M164 52q14-7 27 0l7 48-34 0z"/>
                  <path className="arm" d="M166 60l-24 28-9 16m48-44 24 28 9 16"/>
                  <path className="limb" d="M171 98l-8 33-2 27m2-27 16 27"/>
                  <path className="limb" d="M190 98l9 33 2 27m-2-27-16 27"/>
                </g>
              )}
              <path className="demo-motion-arrow" d={kind === "bridge" ? "M260 137q18-22 0-42m0 0-7 8m7-8 7 8" : kind === "squat" || kind === "lunge" ? "M250 62q17 17 0 34m0 0-7-8m7 8 7-8" : "M260 88q18-16 0-32m0 0-7 8m7-8 7 8"}/>
            </svg>
            <span className="demo-step-pill"><span>●</span> {movement}</span>
          </div>
          <div className="demo-footer">
            <strong>{name}</strong>
            <span>{movement}. Animação ilustrativa; siga também as instruções escritas.</span>
          </div>
        </>
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
  const current = unlockedDay;
  return <><div className="welcome-row"><div><span className="eyebrow">SUA JORNADA COMEÇA NO SEU RITMO</span><h1>Olá, que bom ter você <em>por aqui.</em></h1><p>Um treino por dia. Cada etapa libera a próxima no seu tempo.</p></div><div className="welcome-flower">✿</div></div>
    <section className="hero-card"><div className="hero-copy"><span className="hero-tag"><Sparkles size={14}/> DIA {current} DA SUA JORNADA</span><h2>Um pouco melhor<br/>a cada movimento.</h2><p>{nextUnlockAt ? "Seu próximo treino será liberado 24 horas após a conclusão do último." : "Seu treino de hoje está pronto. Vamos começar?"}</p><button className="button-light" disabled={completedDays.includes(current)} onClick={()=>start(dayWorkout(current),current)}>{completedDays.includes(current)?"Aguardando próxima liberação":"Começar treino"} <ArrowRight size={17}/></button></div><div className="hero-illustration"><div className="sun-disc"/><div className="hero-person">♀</div><span className="hero-caption">FORÇA • EQUILÍBRIO • VOCÊ</span></div></section>
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



function Stat({ icon: Icon, label, value, note }: { icon: typeof Flame; label: string; value: string; note: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{note}</small></div>;
}

function WorkoutCard({ workout, start }: { workout: Workout; start: () => void }) {
  return <article className="workout-card"><div className={`workout-art ${workout.color}`}><span>{workout.focus}</span><Dumbbell className="art-symbol" size={80}/></div><div className="workout-info"><div className="workout-meta"><span>{workout.level}</span><span><Clock3 size={12}/>{workout.time}</span></div><h3>{workout.title}</h3><p>{workout.description}</p><Button variant="link" className="card-action" onClick={start}>Começar treino <ArrowRight size={14}/></Button></div></article>;
}

function ExplorePage({ setGoal, goal, setTab, challengeStarted, challengeDay, onStartChallenge }: { setGoal: (goal: string) => void; goal: string; setTab: (tab: Tab) => void; start: (workout: Workout, day?: number) => void; challengeStarted: boolean; challengeDay: number; onStartChallenge: () => void }) {
  return <><PageHeading kicker="ENCONTRE SEU CAMINHO" title="Movimento com propósito." description="Seu corpo, seus objetivos, seu ritmo."/><div className="goal-grid">{["Perder peso", "Ganhar massa", "Definição", "Fortalecimento", "Mobilidade"].map(item => <Button variant="ghost" key={item} className={`goal-card h-auto whitespace-normal ${goal === item ? "goal-selected" : ""}`} aria-pressed={goal === item} onClick={() => setGoal(item)}><span className="goal-symbol"><Target size={22}/></span><strong>{item}</strong><small>{goal === item ? "Seu objetivo atual" : "Uma nova direção"}</small><ChevronRight size={18}/></Button>)}</div><section className="challenge-card"><div className="challenge-icon"><Flame size={25}/></div><div><span className="eyebrow">CONSISTÊNCIA EM MOVIMENTO</span><h3>Desafio de 7 dias</h3><p>{challengeStarted ? `${challengeDay} de 7 treinos concluídos` : "Pequenos passos para criar uma rotina de movimento."}</p><div className="challenge-days">{Array.from({length: 7}, (_, i) => <span key={i} className={i < challengeDay ? "day-done" : i === challengeDay ? "day-current" : ""}>{i < challengeDay ? <Check size={12}/> : i + 1}</span>)}</div></div><Button className="button-primary" onClick={challengeStarted ? () => setTab("Treinos") : onStartChallenge}>{challengeStarted ? "Ver treinos" : "Começar desafio"}<ArrowRight size={16}/></Button></section></>;
}

function ProgressPage({ done, history }: { done: string[]; history: WorkoutSession[] }) {
  const totalSessions = history.length || done.length;
  const totalMinutes = history.length ? history.reduce((sum, session) => sum + session.duration, 0) : done.length * 18;
  const totalCalories = history.reduce((sum, session) => sum + (session.calories ?? 0), 0);
  const calorieSessions = history.filter(session => session.calories !== undefined).length;
  return <><PageHeading kicker="SUA EVOLUÇÃO" title="Cada movimento conta." description="Celebre os passos que você já deu."/><div className="stats-grid"><Stat icon={Dumbbell} label="Treinos concluídos" value={String(totalSessions)} note="Sua consistência"/><Stat icon={Clock3} label="Tempo em movimento" value={`${totalMinutes} min`} note="Tempo dedicado a você"/><Stat icon={Award} label="Treinos diferentes" value={String(done.length)} note="Novas conquistas"/></div><div className="calorie-summary"><div className="calorie-summary-icon"><Flame size={22}/></div><div><span className="eyebrow">GASTO ESTIMADO</span><strong>{totalCalories.toLocaleString("pt-BR")} kcal</strong><small>{calorieSessions ? `Calculado em ${calorieSessions} treino(s) registrado(s)` : "Informe seu peso e conclua um treino para começar a estimativa"}</small></div></div><section className="progress-panel"><div className="section-heading"><h2>Histórico de treinos</h2></div>{totalSessions === 0 ? <div className="empty-state"><div className="empty-icon"><Activity size={25}/></div><h3>Sua jornada está começando</h3><p>Seu primeiro treino será uma nova conquista.</p></div> : history.length > 0 ? [...history].reverse().map(session => <div className="history-row" key={session.id}><span className="history-check"><Check size={16}/></span><div><strong>{session.title}</strong><small>{session.duration} min · {session.calories !== undefined ? `~${session.calories} kcal estimadas` : "Calorias não estimadas"} · Concluído</small></div><span className="history-date">{new Date(session.completedAt).toLocaleDateString("pt-BR")}</span></div>) : done.map(title => <div className="history-row" key={title}><span className="history-check"><Check size={16}/></span><div><strong>{title}</strong><small>Concluído</small></div></div>)}</section><p className="gentle-reminder"><Heart size={16}/>Estimativas aproximadas: o gasto real varia conforme intensidade, pausas e características individuais.</p></>;
}

function ProfilePage({ goal, level, days, weightKg, setOnboarding }: { goal: string; level: string; days: string; weightKg: number | null; setOnboarding: (open: boolean) => void }) {
  return <><PageHeading kicker="SEU ESPAÇO" title="Minha jornada." description="Um plano que acompanha seu ritmo."/><div className="profile-card"><div className="profile-avatar">M</div><div><h2>Minha jornada</h2><p>Seu espaço de evolução</p></div><span className="profile-badge"><Sparkles size={14}/>Em movimento</span></div><div className="settings-list">{[{label: "Seu objetivo", value: goal}, {label: "Nível atual", value: level}, {label: "Disponibilidade semanal", value: days}, {label: "Peso corporal", value: weightKg ? `${weightKg.toLocaleString("pt-BR")} kg` : "Não informado"}].map(item => <div key={item.label} className="setting-row"><div><strong>{item.label}</strong><small>{item.value}</small></div><Button variant="link" aria-label={`Alterar ${item.label.toLowerCase()}`} onClick={() => setOnboarding(true)}>Alterar<ChevronRight size={15}/></Button></div>)}</div><p className="privacy-note"><Lock size={17}/>Suas preferências ficam salvas neste dispositivo.</p></>;
}
