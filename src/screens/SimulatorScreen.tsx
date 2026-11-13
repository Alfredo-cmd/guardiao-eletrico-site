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
  onPricing: () => void
}

function RulePill({ active, label, tone = 'normal' }: { active: boolean; label: string; tone?: 'normal' | 'alert' }) {
  const activeClass =
    tone === 'alert'
      ? 'border-signal bg-signal/10 text-[#FF9F8F]'
      : 'border-safety bg-safety/10 text-safety'
  return (
    <span
      className={`border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] ${
        active ? activeClass : 'border-paper/20 text-paper/35'
      }`}
    >
      {label}
    </span>
  )
}

function RuleCard({ signals, cameraMode, planned }: { signals: Signals; cameraMode: boolean; planned?: boolean }) {
  if (cameraMode) {
    return (
      <div className="verdict mt-3 p-3">
        <span className="eyebrow">Regra de alerta</span>
        <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
          Nenhuma regra automática configurada neste cenário. A câmera apenas grava.
        </p>
      </div>
    )
  }

  if (planned) {
    return (
      <div className="verdict mt-3 p-3" data-tone="planned">
        <span className="eyebrow">Ramificação planejada</span>
        <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
          Obstrução e adulteração acionariam alertas próprios e, no futuro, também o alarme local e no celular —
          <strong className="text-paper/85"> sem depender</strong> da detecção de mão. Ainda não está implementado.
        </p>
        {signals.alarm && (
          <div className="mt-2 flex items-center gap-2 border-t border-paper/15 pt-2 text-[10px] text-muted">
            <span className="h-1.5 w-1.5 flex-none bg-signal" />
            <span>Alarme local + celular</span>
            <span className="ml-auto font-mono text-[8px] tracking-[0.04em] text-safety">PLANEJADO</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="verdict mt-3 p-3" data-tone={signals.alarm ? 'alert' : undefined}>
      <span className="eyebrow">Regra do protótipo</span>
      <div className="mt-2 flex items-center gap-1.5">
        <RulePill active={signals.hand} label="MÃO" />
        <span className="font-mono text-[9px] text-safety">E</span>
        <RulePill active={signals.vibration} label="VIBRAÇÃO" />
        <ArrowRight size={11} className="text-paper/30" />
        <RulePill active={signals.alarm} label="BUZZER" tone="alert" />
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-paper/15 pt-2">
        <span className="text-[10px] text-muted">Alarme local</span>
        <span className="font-mono text-[9px] tracking-[0.04em] text-paper/80">
          {signals.alarm ? 'ATIVO' : 'EM ESPERA'}
        </span>
      </div>
      {signals.alarm && (
        <div className="mt-2 flex items-center gap-2 border-t border-paper/15 pt-2 text-[10px] text-muted">
          <Smartphone size={11} className="flex-none text-safety" />
          <span>Também no app do celular</span>
          <span className="ml-auto font-mono text-[8px] tracking-[0.04em] text-safety">PLANEJADO</span>
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
      className={`signal-row ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span
        className={`grid h-8 w-8 flex-none place-items-center border ${
          checked ? (planned ? 'border-safety text-safety' : 'border-[#6CC49B] text-[#9FD9BB]') : 'border-paper/25 text-paper/55'
        }`}
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

export function SimulatorScreen({ mode, onExit, onHow, onPricing }: SimulatorScreenProps) {
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
    <div className="app-shell min-h-dvh bg-paper text-ink lg:h-dvh lg:overflow-hidden">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="flex items-center gap-3">
            <Brand compact onClick={onExit} />
            <span className={`chip hidden sm:inline-flex ${isExplore ? 'chip-planned' : 'chip-live'}`}>
              {isExplore ? 'Exploração livre' : 'Pitch guiado'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              className="btn btn-quiet btn-sm"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
              title={soundOn ? 'Desativar som (M)' : 'Ativar som (M)'}
            >
              {soundOn ? <Volume2 size={16} className="text-safety" /> : <VolumeX size={16} />}
              <span className="hidden text-[11px] md:inline">{soundOn ? 'Som ligado' : 'Som desligado'}</span>
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
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1720px] flex-1 min-h-0 grid-cols-1 gap-3 px-4 pb-3 pt-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <section className="flex min-h-0 flex-col gap-2.5" aria-label="Demonstração animada">
          <div className="border-b border-ink/25 pb-2">
            <ComparisonSelector
              active={phaseForSelector}
              mode={mode}
              onSelect={(phase) => goToPhase(phase)}
              basicMode={isExplore ? sim.explore.basicMode : undefined}
            />
          </div>

          <div className="plate flex min-h-0 flex-1 flex-col">
            <div className="plate-head">
              <span>
                <strong>Prancha 02</strong> / {isExplore ? 'exploração de sinais' : 'cena comparativa'}
              </span>
              <span>{activePhaseLabel}</span>
            </div>

            <div ref={sceneHolderRef} className="flex min-h-0 flex-1 items-center justify-center bg-ink">
              <div style={{ width: sceneWidth ? `${sceneWidth}px` : '100%' }} className="max-w-full">
                <HouseScene
                  signals={sim.signals}
                  character={sim.character}
                  pose={sim.pose}
                  highlight={sim.highlight}
                  lens={
                    isExplore
                      ? sim.explore.basicMode
                        ? 'camera'
                        : 'guardian'
                      : step.phase === 'camera'
                        ? 'camera'
                        : 'guardian'
                  }
                  characterSnap={sim.characterSnap}
                  characterDuration={sim.characterDuration}
                  planned={activePlanned}
                />
              </div>
            </div>

            <div className="plate-foot">
              <span>
                <b>CAM 01</b> câmera
              </span>
              <span>
                <b>SV 02</b> vibração
              </span>
              <span>
                <b>BZ 01</b> buzzer local
              </span>
              <span className="ml-auto">
                <b>{isExplore ? 'EX' : `${String(sim.index + 1).padStart(2, '0')}/12`}</b> etapa
              </span>
            </div>
          </div>

          <div className="console px-3.5 py-3">
            <div className="flex items-start gap-3">
              <div className="flex-none bg-safety px-2.5 py-1.5 text-ink">
                <span className="block font-display text-[22px] leading-none">
                  {isExplore ? 'EX' : String(sim.index + 1).padStart(2, '0')}
                </span>
                <span className="mt-0.5 block font-mono text-[6.5px] uppercase tracking-[0.08em]">etapa</span>
              </div>

              <div className="min-w-0 flex-1" aria-live="polite">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="chip chip-ghost">{activePhaseLabel}</span>
                  {activePlanned && <span className="chip chip-planned">Planejado</span>}
                  {sim.signals.alarm && <span className="chip chip-alert chip-dot">Alarme local</span>}
                  {isExplore && sim.explore.basicMode && <span className="chip chip-alert">Câmera básica</span>}
                </div>
                <h2 className="mt-1 text-[17px] font-bold leading-tight text-paper sm:text-[21px]">{activeTitle}</h2>
                <p className="mt-0.5 text-[13.5px] leading-snug text-muted">{activeCaption}</p>
              </div>
            </div>

            <div className="mt-2.5">
              {isExplore ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={resetExplore}>
                    <RotateCcw size={14} /> Reiniciar sinais
                  </button>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.04em] text-muted">
                    Atual: mão + vibração / planejado: obstrução e adulteração
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

        <aside className="console flex min-h-0 flex-col overflow-hidden" aria-label="Painel de sinais">
          <div className="border-b border-paper/15 px-4 pb-3 pt-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="folio">{isExplore ? 'Exploração de sinais' : 'Leitura da cena'}</span>
              <span className={`chip ${panelChipTone}`}>{panelChipLabel}</span>
            </div>
            <h2 className="mt-2 text-[19px] font-bold leading-tight text-paper">
              {isExplore ? 'Controle os sinais' : step.title}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {isExplore ? 'Ative os sinais e acompanhe a resposta do sistema em tempo real.' : step.detail}
            </p>
          </div>

          <div className="panel-scroll flex min-h-0 flex-1 flex-col px-4 py-3">
            {isExplore ? (
              <>
                <div
                  className="verdict p-3"
                  data-tone={
                    sim.readout.tone === 'alert'
                      ? 'alert'
                      : sim.readout.tone === 'planned'
                        ? 'planned'
                        : sim.readout.tone === 'good'
                          ? 'good'
                          : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`led ${
                        sim.signals.alarm
                          ? 'led--alert'
                          : sim.signals.hand || sim.signals.vibration
                            ? 'led--on'
                            : ''
                      }`}
                    />
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
                  className="signal-row mt-2"
                  data-on={sim.explore.basicMode}
                >
                  <span className="grid h-8 w-8 flex-none place-items-center border border-safety/60 text-safety">
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
                  <span className="font-mono text-[8px] uppercase tracking-[0.04em] text-[#9FD9BB]">
                    Protótipo atual
                  </span>
                </div>
                <div>
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
                  <p className="mt-2 text-[10.5px] leading-snug text-muted">
                    Desative a câmera básica para testar os sinais do Guardião.
                  </p>
                )}

                <div className="mt-4 border border-paper/15 border-l-2 border-l-safety p-3">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-safety">Planejado</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.04em] text-safety/80">
                      independente
                    </span>
                  </div>
                  <div className="mt-1">
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
                      hint="Toca o alarme no app / planejado"
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
                  <div className="flex items-start gap-2 border border-paper/15 px-3 py-2 text-[10.5px] leading-snug text-muted">
                    <Info size={12} className="mt-0.5 flex-none text-safety" />
                    <span>
                      Simulação: nenhum aviso real é enviado. O som é gerado localmente no navegador e começa
                      desligado.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-1 flex items-center justify-between">
                  <span className="eyebrow">Sinais monitorados</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.04em] text-paper/45">
                    {sensorMode === 'camera' ? 'câmera' : 'câmera + sensor'}
                  </span>
                </div>
                <SensorPanel signals={sim.signals} mode={sensorMode} />
                <RuleCard signals={sim.signals} cameraMode={cameraPhase} planned={Boolean(step.planned)} />

                <div className="mt-3 flex items-start gap-2 border border-paper/15 px-3 py-2 text-[10.5px] leading-snug text-muted">
                  <Info size={12} className="mt-0.5 flex-none text-safety" />
                  <span>{step.statusLine}</span>
                </div>

                <div className="mt-4 hidden border-t border-paper/15 pt-3 lg:block">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Sequência</span>
                    <span className="font-mono text-[8px] tracking-[0.04em] text-paper/40">
                      {String(sim.index + 1).padStart(2, '0')} / 12
                    </span>
                  </div>
                  <div className="mt-1.5">
                    {steps.map((item, i) => {
                      const isCurrent = i === sim.index
                      const isPast = i < sim.index
                      const startsPhase = i > 0 && steps[i - 1].phase !== item.phase
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-2 py-1 ${
                            startsPhase ? 'mt-1 border-t border-paper/10 pt-1.5' : ''
                          } ${isCurrent ? 'text-paper' : isPast ? 'text-paper/45' : 'text-paper/30'}`}
                        >
                          <span className={`w-5 flex-none font-mono text-[8px] ${isCurrent ? 'text-safety' : ''}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="truncate text-[9.5px] leading-tight">{item.title}</span>
                          {item.planned && <span className="ml-auto h-1 w-1 flex-none bg-safety/70" />}
                          {isCurrent && <span className="ml-auto h-1.5 w-1.5 flex-none bg-safety" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {nextStep && (
                  <div className="mt-3 flex items-center gap-2 border-t border-paper/15 pt-3">
                    <span className="eyebrow flex-none">A seguir</span>
                    <span className="truncate text-[11px] text-paper/70">{nextStep.title}</span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-quiet btn-sm mt-2 !px-0"
                  onClick={onHow}
                >
                  Entender a lógica do Guardião
                </button>
              </>
            )}
          </div>

          <div className="border-t border-paper/15 px-4 py-2.5">
            <div className="flex items-center justify-between gap-2 font-mono text-[8.5px] leading-tight text-paper/45">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#6CC49B]" /> Protótipo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-safety" /> Planejado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-signal" /> Alerta
              </span>
            </div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {sim.isSummary && (
          <SummaryOverlay key="summary" onRestart={restart} onHome={onExit} onHow={onHow} onPricing={onPricing} />
        )}
      </AnimatePresence>
    </div>
  )
}
