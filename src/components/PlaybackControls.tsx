import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { steps, type SimPhase } from '../data/scenes'

interface PlaybackControlsProps {
  index: number
  total: number
  playing: boolean
  isSummary: boolean
  duration: number
  phase: SimPhase
  onPrev: () => void
  onNext: () => void
  onPlay: () => void
  onRestart: () => void
}

export function PlaybackControls({
  index,
  total,
  playing,
  isSummary,
  duration,
  phase,
  onPrev,
  onNext,
  onPlay,
  onRestart,
}: PlaybackControlsProps) {
  const stepNumber = Math.min(index + 1, total)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="btn btn-ghost btn-sm !px-2.5"
            onClick={onPrev}
            disabled={index === 0}
            aria-label="Etapa anterior"
            title="Etapa anterior (←)"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            className="btn btn-primary !rounded-xl !px-3.5 !py-2"
            onClick={onPlay}
            aria-label={playing ? 'Pausar' : isSummary ? 'Repetir demonstração' : 'Continuar'}
            title={playing ? 'Pausar (espaço)' : 'Continuar (espaço)'}
          >
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            <span className="hidden text-[13px] sm:inline">{playing ? 'Pausar' : isSummary ? 'Repetir' : 'Continuar'}</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm !px-2.5"
            onClick={onNext}
            disabled={index >= total - 1}
            aria-label="Próxima etapa"
            title="Próxima etapa (→)"
          >
            <ChevronRight size={17} />
          </button>
          <button
            type="button"
            className="btn btn-quiet btn-sm !px-2.5"
            onClick={onRestart}
            aria-label="Reiniciar demonstração"
            title="Reiniciar (R)"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="timeline ml-1 hidden flex-1 sm:flex" aria-hidden="true">
          {steps.map((step, i) => {
            const active = i === index
            const done = i < index
            return (
              <span className="timeline-seg" key={step.id} data-phase={step.phase} data-planned={step.planned ? 'true' : undefined}>
                <span
                  key={active ? `active-${index}` : 'fill'}
                  className={active ? `is-active ${playing ? 'is-running' : ''}` : ''}
                  style={{
                    transform: active ? undefined : done ? 'scaleX(1)' : 'scaleX(0)',
                    animationDuration: `${Math.max(step.duration, 400)}ms`,
                  }}
                />
              </span>
            )
          })}
        </div>

        <span className="ml-auto flex flex-none items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <span className="hidden sm:inline">{phase === 'camera' ? 'Câmera' : phase === 'guardian' ? 'Guardião' : 'Fim'}</span>
          <span className="rounded-md border border-white/10 bg-black/20 px-1.5 py-0.5 text-paper/80">
            {String(stepNumber).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </span>
      </div>

      <div className="timeline sm:hidden" aria-hidden="true">
        {steps.map((step, i) => {
          const active = i === index
          const done = i < index
          return (
            <span className="timeline-seg" key={step.id} data-phase={step.phase} data-planned={step.planned ? 'true' : undefined}>
              <span
                key={active ? `m-active-${index}` : 'm-fill'}
                className={active ? `is-active ${playing ? 'is-running' : ''}` : ''}
                style={{
                  transform: active ? undefined : done ? 'scaleX(1)' : 'scaleX(0)',
                  animationDuration: `${Math.max(duration, 400)}ms`,
                }}
              />
            </span>
          )
        })}
      </div>
    </div>
  )
}
