import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  Camera,
  EyeOff,
  Info,
  Maximize,
  Minimize,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Volume2,
  VolumeX,
  Waves,
  X,
} from 'lucide-react'
import { Brand } from '../components/Brand'
import { ComparisonSelector } from '../components/ComparisonSelector'
import { HouseScene } from '../components/HouseScene'
import { PlaybackControls } from '../components/PlaybackControls'
import { SensorPanel } from '../components/SensorPanel'
import { SummaryOverlay } from '../components/SummaryOverlay'
import { useFitAspect } from '../hooks/useFitAspect'
import { useFullscreen } from '../hooks/useFullscreen'
import { useSimulation } from '../hooks/useSimulation'
import { useSound } from '../hooks/useSound'
import type { Signals } from '../data/scenes'
import { steps } from '../data/scenes'

interface SimulatorScreenProps {
  mode: 'pitch' | 'explore'
  onExit: () => void
  onHow: () => void
}

function RuleCard({ signals, cameraMode, planned }: { signals: Signals; cameraMode: boolean; planned?: boolean }) {
  if (cameraMode) {
    return (
      <div className="verdict mt-3 p-3">
        <div className="flex items-center gap-1.5">
          <Camera size={13} className="text-[#F4C95D]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#F4C95D]/85">Regra de alerta</span>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
          Nenhuma regra automática configurada neste cenário. A câmera apenas grava.
        </p>
      </div>
    )
  }

  if (planned) {
    return (
      <div className="verdict mt-3 p-3" data-tone="planned">
        <div className="flex items-center gap-1.5">
          <ShieldAlert size={13} className="text-[#F4C95D]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#F4C95D]/85">Ramificação planejada</span>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
          Obstrução e adulteração acionariam alertas próprios — e, no futuro, também o alarme local e no celular.{' '}
          <strong className="text-paper/80">Sem depender</strong> da detecção de mão. Ainda não está implementado.
        </p>
        {signals.alarm && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md border border-dashed border-[#F4C95D]/35 bg-[#F4C95D]/6 px-2 py-1.5">
            <ShieldAlert size={11} className="text-[#FF8A94]" />
            <span className="text-[10px] text-muted">Alarme local + celular</span>
            <span className="ml-auto font-mono text-[7px] uppercase tracking-[0.14em] text-[#F4C95D]/90">
              planejado
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="verdict mt-3 p-3" data-tone={signals.alarm ? 'alert' : undefined}>
      <div className="flex items-center gap-1.5">
        <ShieldCheck size={13} className="text-[#57D9B2]" />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#57D9B2]/85">Regra do protótipo</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
        <span
          className="rounded-md border px-1.5 py-0.5"
          style={{
            borderColor: signals.hand ? 'rgba(87,217,178,0.45)' : 'var(--line)',
            color: signals.hand ? '#57D9B2' : '#7E93A8',
            background: signals.hand ? 'rgba(87,217,178,0.1)' : 'transparent',
          }}
        >
          MÃO
        </span>
        <span className="text-[#57D9B2]">E</span>
        <span
          className="rounded-md border px-1.5 py-0.5"
          style={{
            borderColor: signals.vibration ? 'rgba(87,217,178,0.45)' : 'var(--line)',
            color: signals.vibration ? '#57D9B2' : '#7E93A8',
            background: signals.vibration ? 'rgba(87,217,178,0.1)' : 'transparent',
          }}
        >
          VIBRAÇÃO
        </span>
        <ArrowRight size={12} className="text-white/25" />
        <span
          className="rounded-md border px-1.5 py-0.5"
          style={{
            borderColor: signals.alarm ? 'rgba(255,104,116,0.5)' : 'var(--line)',
            color: signals.alarm ? '#FF8A94' : '#7E93A8',
            background: signals.alarm ? 'rgba(255,104,116,0.1)' : 'transparent',
          }}
        >
          BUZZER
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] text-muted">Alarme local</span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color: signals.alarm ? '#FF8A94' : '#7E93A8' }}
        >
          {signals.alarm ? 'Ativo' : 'Em espera'}
        </span>
      </div>
      {signals.alarm && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md border border-dashed border-[#F4C95D]/35 bg-[#F4C95D]/6 px-2 py-1.5">
          <Smartphone size={11} className="text-[#F4C95D]" />
          <span className="text-[10px] text-muted">Alarme também no app do celular</span>
          <span className="ml-auto font-mono text-[7px] uppercase tracking-[0.14em] text-[#F4C95D]/90">planejado</span>
        </div>
      )}
    </div>
  )
}

function ExploreSwitch({
  label,
  hint,
  checked,
  onChange,
  planned = false,
  icon,
  disabled = false,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: () => void
  planned?: boolean
  icon: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      data-on={checked}
      data-planned={planned}
      className={`signal-row text-left ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span
        className="grid h-8 w-8 flex-none place-items-center rounded-lg border"
        style={{
          borderColor: checked
            ? planned
              ? 'rgba(244,201,93,0.4)'
              : 'rgba(53,214,239,0.4)'
            : 'var(--line)',
          color: checked ? (planned ? '#F4C95D' : '#35D6EF') : '#7E93A8',
          background: checked ? (planned ? 'rgba(244,201,93,0.08)' : 'rgba(53,214,239,0.08)') : 'transparent',
        }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-semibold text-paper/90">{label}</span>
        <span className="block truncate text-[10px] text-muted">{hint}</span>
      </span>
      <span className={`switch ${planned ? 'switch--planned' : ''}`} aria-hidden="true" />
    </button>
  )
}

export function SimulatorScreen({ mode, onExit, onHow }: SimulatorScreenProps) {
  const sim = useSimulation({ mode, autoStart: mode === 'pitch' })
  const { soundOn, toggleSound } = useSound(sim.signals.alarm, sim.signals.phone)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const { ref: sceneHolderRef, width: sceneWidth } = useFitAspect(1000 / 720)

  const { togglePlay, next, prev, restart, goToPhase, toggleExplore, setBasicMode, resetExplore } = sim

  useEffect(() => {
    if (mode !== 'pitch') return
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'A') {
        return
      }
      if (event.code === 'Space') {
        if (tag === 'BUTTON') return
        event.preventDefault()
        togglePlay()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
      } else if (event.key.toLowerCase() === 'r') {
        restart()
      } else if (event.key.toLowerCase() === 'm') {
        toggleSound()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode, togglePlay, next, prev, restart, toggleSound])

  const isExplore = mode === 'explore'
  const step = sim.step
  const nextStep = !isExplore ? steps[sim.index + 1] : undefined
  const cameraPhase = step.phase === 'camera'
  const sensorMode = cameraPhase ? 'camera' : step.phase === 'summary' ? 'summary' : 'guardian'
  const phaseForSelector = isExplore ? 'guardian' : step.phase

  const activeTitle = isExplore ? sim.readout.title : step.title
  const activeCaption = isExplore ? sim.readout.caption : step.caption
  const activePhaseLabel = isExplore ? 'Modo explorar' : step.phaseLabel
  const activePlanned = isExplore ? sim.planned : Boolean(step.planned)
  const panelChipLabel = activePlanned
    ? 'Planejado'
    : isExplore
      ? sim.explore.basicMode
        ? 'Câmera básica'
        : 'Protótipo atual'
      : cameraPhase
        ? 'Câmera básica'
        : 'Protótipo atual'
  const panelChipTone = activePlanned
    ? 'chip-planned'
    : isExplore
      ? sim.explore.basicMode
        ? 'chip-alert'
        : 'chip-live'
      : cameraPhase
        ? 'chip-ghost'
        : 'chip-live'

  return (
    <div className="app-shell min-h-dvh lg:h-dvh lg:overflow-hidden">
      <header className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Brand compact onClick={onExit} />
          <span className="hidden h-5 w-px bg-white/10 sm:block" />
          <span className={`chip hidden sm:inline-flex ${isExplore ? 'chip-planned' : 'chip-current'}`}>
            {isExplore ? 'Explorar' : 'Pitch guiado'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="btn btn-quiet btn-sm"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            title={soundOn ? 'Desativar som (M)' : 'Ativar som (M)'}
          >
            {soundOn ? <Volume2 size={16} className="text-[#57D9B2]" /> : <VolumeX size={16} />}
            <span className="hidden text-[11.5px] md:inline">{soundOn ? 'Som ligado' : 'Som desligado'}</span>
          </button>
          <button
            type="button"
            className="btn btn-quiet btn-sm !px-2.5"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            title="Tela cheia"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onExit}
            aria-label="Sair da demonstração"
            title="Voltar ao início"
          >
            <X size={15} /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1720px] flex-1 min-h-0 grid-cols-1 gap-3 px-4 pb-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_368px]">
        <section className="flex min-h-0 flex-col gap-2.5" aria-label="Demonstração animada">
          <ComparisonSelector
            active={phaseForSelector}
            mode={mode}
            onSelect={(phase) => goToPhase(phase)}
            basicMode={isExplore ? sim.explore.basicMode : undefined}
          />

          <div ref={sceneHolderRef} className="flex min-h-0 flex-1 items-center justify-center">
            <div style={{ width: sceneWidth ? `${sceneWidth}px` : '100%' }} className="max-w-full">
              <HouseScene
                signals={sim.signals}
                character={sim.character}
                pose={sim.pose}
                highlight={sim.highlight}
                lens={isExplore ? (sim.explore.basicMode ? 'camera' : 'guardian') : step.phase === 'camera' ? 'camera' : 'guardian'}
                characterSnap={sim.characterSnap}
                characterDuration={sim.characterDuration}
                planned={activePlanned}
              />
            </div>
          </div>

          <div className="panel px-3.5 py-3">
            <div className="flex items-start gap-3">
              <div className="hidden flex-none flex-col items-center gap-1 sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-black/25 font-mono text-[11px] font-semibold text-paper/80">
                  {isExplore ? 'EX' : String(sim.index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-muted/50">etapa</span>
              </div>

              <div className="min-w-0 flex-1" aria-live="polite">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="chip chip-ghost">{activePhaseLabel}</span>
                  {activePlanned && <span className="chip chip-planned">Planejado</span>}
                  {sim.signals.alarm && <span className="chip chip-alert chip-dot">Alarme local</span>}
                  {isExplore && sim.explore.basicMode && <span className="chip chip-alert">Câmera básica</span>}
                </div>
                <h2 className="mt-1 font-display text-[17px] font-semibold leading-tight text-paper sm:text-[19px]">
                  {activeTitle}
                </h2>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">{activeCaption}</p>
              </div>
            </div>

            <div className="mt-2.5">
              {isExplore ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={resetExplore}>
                    <RotateCcw size={14} /> Reiniciar sinais
                  </button>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted/60">
                    Atual: mão + vibração · planejado: obstrução/adulteração
                  </span>
                  <button
                    type="button"
                    className="btn btn-quiet btn-sm ml-auto"
                    onClick={() => setBasicMode(!sim.explore.basicMode)}
                    aria-pressed={sim.explore.basicMode}
                  >
                    <Camera size={14} /> {sim.explore.basicMode ? 'Voltar ao Guardião' : 'Ver como câmera básica'}
                  </button>
                </div>
              ) : (
                <PlaybackControls
                  index={sim.index}
                  total={sim.total}
                  playing={sim.playing}
                  isSummary={sim.isSummary}
                  duration={step.duration}
                  phase={step.phase}
                  onPrev={prev}
                  onNext={next}
                  onPlay={togglePlay}
                  onRestart={restart}
                />
              )}
            </div>
          </div>
        </section>

        <aside className="panel flex min-h-0 flex-col overflow-hidden" aria-label="Painel de sinais">
          <div className="border-b border-white/8 px-4 pb-3 pt-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow">{isExplore ? 'Explorar sinais' : 'Painel de leitura'}</span>
              <span className={`chip ${panelChipTone}`}>{panelChipLabel}</span>
            </div>
            <h2 className="mt-2 font-display text-[18px] font-semibold text-paper">
              {isExplore ? 'Controle os sinais' : step.title}
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              {isExplore
                ? 'Ative os sinais e acompanhe a resposta do sistema em tempo real.'
                : step.detail}
            </p>
          </div>

          <div className="panel-scroll flex min-h-0 flex-1 flex-col px-4 py-3">
            {isExplore ? (
              <>
                <div className="verdict p-3" data-tone={sim.readout.tone === 'alert' ? 'alert' : sim.readout.tone === 'planned' ? 'planned' : sim.readout.tone === 'good' ? 'good' : undefined}>
                  <div className="flex items-center gap-2">
                    <span className={`led ${sim.signals.alarm ? 'led--alert' : sim.signals.hand || sim.signals.vibration ? 'led--on' : ''}`} />
                    <span className="text-[13px] font-semibold text-paper/90">{sim.readout.title}</span>
                  </div>
                  <p className="mt-1 text-[11.5px] leading-snug text-muted">{sim.readout.caption}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="eyebrow">Modo de comparação</span>
                  {sim.explore.basicMode ? (
                    <span className="chip chip-alert">Sem alertas</span>
                  ) : (
                    <span className="chip chip-live chip-dot">Guardião</span>
                  )}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sim.explore.basicMode}
                  onClick={() => setBasicMode(!sim.explore.basicMode)}
                  className="signal-row mt-2 text-left"
                  data-on={sim.explore.basicMode}
                >
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[#F4C95D]/25 bg-[#F4C95D]/6 text-[#F4C95D]">
                    <Camera size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold text-paper/90">Câmera básica</span>
                    <span className="block text-[10px] leading-snug text-muted">
                      Apenas grava, sem interpretar sinais
                    </span>
                  </span>
                  <span className="switch" aria-hidden="true" />
                </button>

                <div className="mt-4 flex items-center justify-between">
                  <span className="eyebrow">Sinais do Guardião</span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#57D9B2]/80">Protótipo atual</span>
                </div>
                <div className="mt-2 grid gap-2">
                  <ExploreSwitch
                    label="Detectar mão"
                    hint="Visão computacional"
                    icon={<ShieldCheck size={15} />}
                    checked={sim.explore.hand}
                    onChange={() => toggleExplore('hand')}
                    disabled={sim.explore.basicMode}
                  />
                  <ExploreSwitch
                    label="Detectar vibração"
                    hint="Sensor na instalação"
                    icon={<Waves size={15} />}
                    checked={sim.explore.vibration}
                    onChange={() => toggleExplore('vibration')}
                    disabled={sim.explore.basicMode}
                  />
                </div>

                {sim.explore.basicMode && (
                  <p className="mt-2 text-[10.5px] leading-snug text-muted/80">
                    Desative a câmera básica para testar os sinais do Guardião.
                  </p>
                )}

                <div className="mt-4 rounded-xl border border-dashed border-[#F4C95D]/30 bg-[#F4C95D]/4 p-3">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-[#F4C95D]/85">Planejado</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#F4C95D]/70">independente</span>
                  </div>
                  <div className="mt-2 grid gap-2">
                    <ExploreSwitch
                      label="Obstruir câmera"
                      hint="Alerta próprio de visão perdida"
                      icon={<EyeOff size={15} />}
                      checked={sim.explore.obstruction}
                      onChange={() => toggleExplore('obstruction')}
                      planned
                      disabled={sim.explore.basicMode}
                    />
                    <ExploreSwitch
                      label="Detectar adulteração"
                      hint="Sensor físico dedicado"
                      icon={<ShieldAlert size={15} />}
                      checked={sim.explore.tamper}
                      onChange={() => toggleExplore('tamper')}
                      planned
                      disabled={sim.explore.basicMode}
                    />
                    <ExploreSwitch
                      label="Alarme no celular"
                      hint="Toca o alarme no app · planejado"
                      icon={<Smartphone size={15} />}
                      checked={sim.explore.phoneAlarm}
                      onChange={() => toggleExplore('phoneAlarm')}
                      planned
                      disabled={sim.explore.basicMode}
                    />
                  </div>
                </div>

                <RuleCard signals={sim.signals} cameraMode={sim.explore.basicMode} planned={sim.planned} />

                <div className="mt-auto pt-3">
                  <div className="flex items-start gap-2 rounded-lg border border-white/8 bg-black/15 px-3 py-2 text-[11px] leading-snug text-muted">
                    <Info size={12} className="mt-0.5 flex-none text-[#35D6EF]" />
                    <span>
                      Simulação: nenhum aviso real é enviado. O som é gerado localmente no navegador e começa
                      desligado.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <span className="eyebrow">Sinais monitorados</span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted/60">
                    {sensorMode === 'camera' ? 'câmera' : 'câmera + sensor'}
                  </span>
                </div>
                <SensorPanel signals={sim.signals} mode={sensorMode} />
                <RuleCard signals={sim.signals} cameraMode={cameraPhase} planned={Boolean(step.planned)} />

                <div className="mt-3 flex items-start gap-2 rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-[10.5px] leading-snug text-muted">
                  <Info size={12} className="mt-0.5 flex-none text-[#35D6EF]" />
                  <span>{step.statusLine}</span>
                </div>

                <div className="mt-auto pt-3">
                  <div className="rounded-xl border border-white/8 bg-black/15 p-3">
                    <div className="eyebrow">Nesta comparação</div>
                    <div className="mt-2 space-y-1.5">
                    <div
                      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                        cameraPhase
                          ? 'border-[#F4C95D]/30 bg-[#F4C95D]/8'
                          : 'border-transparent opacity-45'
                      }`}
                    >
                      <Camera size={12} className="text-[#F4C95D]" />
                      <span className="text-[11.5px] text-paper/80">Câmera básica · registra</span>
                      {cameraPhase && (
                        <span className="ml-auto font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#F4C95D]">
                          agora
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                        !cameraPhase
                          ? 'border-[#57D9B2]/30 bg-[#57D9B2]/8'
                          : 'border-transparent opacity-45'
                      }`}
                    >
                      <ShieldCheck size={12} className="text-[#57D9B2]" />
                      <span className="text-[11.5px] text-paper/80">Guardião · detecta e reage</span>
                      {!cameraPhase && (
                        <span className="ml-auto font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#57D9B2]">
                          agora
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                </div>

                {nextStep && (
                  <div className="mt-3 flex items-center gap-2 border-t border-white/8 pt-3">
                    <span className="eyebrow flex-none">A seguir</span>
                    <span className="truncate text-[11px] text-paper/70">{nextStep.title}</span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-quiet btn-sm mt-2 w-full !justify-between !px-2"
                  onClick={onHow}
                >
                  Entender a lógica do Guardião <ArrowRight size={13} />
                </button>
              </>
            )}
          </div>

          <div className="border-t border-white/8 px-4 py-2.5">
            <div className="flex items-center justify-between gap-2 text-[9.5px] leading-tight text-muted/70">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#57D9B2]" /> Protótipo atual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F4C95D]" /> Planejado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6874]" /> Alerta
              </span>
            </div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {sim.isSummary && (
          <SummaryOverlay
            key="summary"
            onRestart={restart}
            onHome={onExit}
            onHow={onHow}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
