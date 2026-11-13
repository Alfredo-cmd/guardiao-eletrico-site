import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Camera, Check, Info, Lightbulb, RotateCcw, ShieldCheck, X } from 'lucide-react'

interface SummaryOverlayProps {
  onRestart: () => void
  onHome: () => void
  onHow: () => void
}

export function SummaryOverlay({ onRestart, onHome, onHow }: SummaryOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    primaryRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onHome()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!nodes || nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#050B14]/78 p-4 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <motion.div
        ref={panelRef}
        className="panel relative my-auto w-full max-w-[880px] overflow-hidden p-5 sm:p-8"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 190, damping: 24 }}
      >
        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#35D6EF]/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#F4C95D]/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Resumo da demonstração</span>
            <span className="chip chip-live chip-dot">Simulação</span>
          </div>

          <h2
            id="summary-title"
            className="mt-3 max-w-[700px] font-display text-[clamp(1.6rem,3.4vw,2.55rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-paper"
          >
            Não basta registrar uma ameaça.
            <span className="gradient-text"> É preciso identificá-la e reagir.</span>
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-[#F4C95D]/25 bg-[#F4C95D]/5 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#F4C95D]/35 bg-[#F4C95D]/10 text-[#F4C95D]">
                  <Camera size={17} />
                </span>
                <div>
                  <div className="eyebrow text-[#F4C95D]/80">Câmera básica</div>
                  <div className="font-display text-[15px] font-semibold text-paper">Registro sem alerta</div>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[12px] leading-snug text-muted">
                {[
                  'Grava a fachada, sem interpretar a cena.',
                  'A visão obstruída não gera aviso automático.',
                  'A ocorrência é percebida apenas depois.',
                ].map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <X size={13} className="mt-0.5 flex-none text-[#F4C95D]/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#57D9B2]/28 bg-[#57D9B2]/5 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#57D9B2]/35 bg-[#57D9B2]/10 text-[#57D9B2]">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <div className="eyebrow text-[#57D9B2]/80">Guardião Elétrico</div>
                  <div className="font-display text-[15px] font-semibold text-paper">Detecção combinada</div>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[12px] leading-snug text-muted">
                {[
                  'Câmera e sensor de vibração avaliados em conjunto.',
                  'Mão + vibração acionam o buzzer local.',
                  'Alarme e aviso no celular, obstrução e adulteração seguem em desenvolvimento.',
                ].map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <Check size={13} className="mt-0.5 flex-none text-[#57D9B2]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#F4C95D]/25 bg-[#F4C95D]/6 px-3.5 py-2.5 text-[11px] leading-snug text-[#FFE9B1]/85">
            <Info size={14} className="mt-0.5 flex-none text-[#F4C95D]" />
            <p>
              <strong className="font-semibold">Protótipo atual:</strong> detecção de mão, sensor de vibração, regra
              combinada e buzzer local. <strong className="font-semibold">Planejado:</strong> obstrução, adulteração
              física, alarme e aviso no celular. A comparação é com uma câmera básica sem alertas inteligentes, não com
              todas as câmeras.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button type="button" ref={primaryRef} className="btn btn-primary" onClick={onRestart}>
              <RotateCcw size={16} /> Repetir demonstração
            </button>
            <button type="button" className="btn btn-ghost" onClick={onHow}>
              <Lightbulb size={16} /> Como o Guardião pensa
            </button>
            <button type="button" className="btn btn-quiet sm:ml-auto" onClick={onHome}>
              Voltar ao início
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
