import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CircleHelp,
  Info,
  Play,
  Radio,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Brand } from '../components/Brand'
import { HouseScene } from '../components/HouseScene'

interface HomeScreenProps {
  onCompare: () => void
  onExplore: () => void
  onHow: () => void
}

const idleSignals = {
  recording: true,
  hand: false,
  vibration: false,
  obstructed: false,
  tamper: false,
  alarm: false,
  phone: false,
  phoneAlarm: false,
}

export function HomeScreen({ onCompare, onExplore, onHow }: HomeScreenProps) {
  return (
    <div className="app-shell">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Brand />
        <div className="flex items-center gap-2">
          <span className="chip chip-live chip-dot hidden sm:inline-flex">Simulação ilustrativa</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm whitespace-nowrap"
            onClick={onHow}
            aria-label="Como funciona?"
          >
            <CircleHelp size={15} /> <span className="hidden sm:inline">Como funciona?</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-10 px-5 pb-10 pt-1 sm:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14">
        <section className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-[#35D6EF]" />
            <span className="eyebrow eyebrow-cyan">Pitch PIINC · demonstração interativa</span>
          </div>

          <h1 className="mt-4 font-display text-[clamp(3.1rem,7vw,6.1rem)] font-bold uppercase leading-[0.87] tracking-[-0.035em]">
            <span className="block text-paper">Guardião</span>
            <span className="block gradient-text">Elétrico</span>
          </h1>

          <p className="mt-4 font-display text-[clamp(1.15rem,2.3vw,1.6rem)] font-medium leading-tight text-paper/92">
            Uma mesma ameaça. <span className="text-[#F4C95D]">Duas respostas.</span>
          </p>

          <p className="mt-3 max-w-[530px] text-[13.5px] leading-relaxed text-muted sm:text-[14.5px]">
            Uma câmera que apenas registra e um sistema que combina sinais para identificar uma possível interferência e
            reagir na hora. Acompanhe a mesma cena nas duas versões.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" className="btn btn-primary btn-lg" onClick={onCompare}>
              <Play size={18} fill="currentColor" />
              Comparar os sistemas
              <span className="ml-1 rounded-md bg-[#06131F]/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.12em]">
                ~1 MIN
              </span>
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={onExplore}>
              <SlidersHorizontal size={18} /> Explorar o Guardião
            </button>
          </div>

          <button
            type="button"
            className="btn btn-quiet mt-2 !px-0 text-[12.5px]"
            onClick={onHow}
          >
            Como funciona? <ArrowUpRight size={14} />
          </button>

          <div className="mt-6 grid gap-2.5 rounded-2xl border border-white/8 bg-white/2 p-3.5 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <ShieldCheck size={15} className="mt-0.5 flex-none text-[#57D9B2]" />
              <p className="text-[11px] leading-snug text-muted">
                <strong className="block font-semibold text-paper/85">Protótipo atual</strong>
                Detecção de mão + vibração → buzzer local.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles size={15} className="mt-0.5 flex-none text-[#F4C95D]" />
              <p className="text-[11px] leading-snug text-muted">
                <strong className="block font-semibold text-paper/85">Planejado</strong>
                Obstrução, adulteração e alarme no celular.
              </p>
            </div>
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-snug text-muted/65">
            <Info size={12} className="mt-0.5 flex-none" />
            A comparação é com uma câmera básica sem alertas inteligentes — não com todas as câmeras.
          </p>
        </section>

        <section className="relative min-w-0">
          <div className="pointer-events-none absolute -inset-6 rounded-[38px] bg-[#35D6EF]/6 blur-3xl" />
          <div className="panel relative p-2.5">
            <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/80">Visão do sistema</span>
              <span className="chip chip-current chip-dot">Simulação</span>
            </div>

            <div className="relative overflow-hidden rounded-[16px] border border-white/8">
              <HouseScene
                signals={idleSignals}
                character={0}
                pose="idle"
                highlight="house"
                lens="guardian"
                compact
              />

              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-[#08111F]/75 px-2.5 py-1 backdrop-blur">
                <span className="live-dot" />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/75">Residência demonstrativa</span>
              </div>

              <div className="pointer-events-none absolute inset-x-3 bottom-3">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#08111F]/80 px-2.5 py-2 backdrop-blur-md">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-paper/80">
                    <Camera size={12} className="text-[#35D6EF]" /> Câmera
                  </span>
                  <ArrowRight size={11} className="text-white/25" />
                  <span className="flex items-center gap-1 text-[10px] font-medium text-paper/80">
                    <Radio size={12} className="text-[#57D9B2]" /> Vibração
                  </span>
                  <ArrowRight size={11} className="text-white/25" />
                  <span className="flex items-center gap-1 rounded-md border border-[#57D9B2]/25 bg-[#57D9B2]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#B9F4E3]">
                    <Siren size={12} /> Buzzer local
                  </span>
                  <span className="ml-auto hidden font-mono text-[8px] uppercase tracking-[0.16em] text-muted/60 sm:block">
                    protótipo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="flex items-center gap-1.5 text-[10.5px] text-muted/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4C95D]" />
              Ilustração 2.5D · sem imagens externas
            </span>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted/50">
              guardião elétrico · v1
            </span>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 border-t border-white/6 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted/50 sm:px-8">
        <span>Simulação ilustrativa · pitch PIINC</span>
        <span className="flex items-center gap-4">
          <span>Funciona offline</span>
          <span className="hidden sm:inline">Sem coleta de dados</span>
        </span>
      </footer>
    </div>
  )
}
