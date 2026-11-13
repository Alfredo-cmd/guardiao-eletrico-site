import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Camera, Check, Info, Lightbulb, RotateCcw, ShieldCheck, ShoppingBag, X } from 'lucide-react'

interface SummaryOverlayProps {
  onRestart: () => void
  onHome: () => void
  onHow: () => void
  onPricing: () => void
}

const cameraPoints = [
  'Grava a fachada, sem interpretar a cena.',
  'A visão obstruída não gera aviso automático.',
  'A ocorrência é percebida apenas depois.',
]

const guardianPoints = [
  'Câmera e sensor de vibração avaliados em conjunto.',
  'Mão + vibração acionam o buzzer local.',
  'Alarme e aviso no celular, obstrução e adulteração seguem em desenvolvimento.',
]

export function SummaryOverlay({ onRestart, onHome, onHow, onPricing }: SummaryOverlayProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1213]/96 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <motion.div
        ref={panelRef}
        className="relative my-auto w-full max-w-[960px] border-[3px] border-ink bg-paper p-5 text-ink shadow-[14px_14px_0_#F2C230] sm:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
          <span className="folio">
            <strong>Laudo 001</strong> / encerramento da demonstração
          </span>
          <span className="stamp stamp--alert">Simulação</span>
        </div>

        <h2
          id="summary-title"
          className="display mt-5 max-w-[760px] text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.94]"
        >
          Não basta registrar uma ameaça.
          <br />
          É preciso identificá-la e reagir.
        </h2>

        <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="border-t-2 border-ink pt-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center bg-[#F2C230] text-ink">
                <Camera size={16} />
              </span>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.05em] text-muted">Câmera básica</div>
                <div className="text-[14px] font-bold leading-tight">Registro sem alerta</div>
              </div>
            </div>
            <ul className="mt-3">
              {cameraPoints.map((item) => (
                <li key={item} className="flex gap-2 border-b border-ink/15 py-2 text-[12px] leading-snug text-[#3F4A44]">
                  <X size={13} className="mt-0.5 flex-none text-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-ink pt-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center bg-[#2F6B52] text-white">
                <ShieldCheck size={16} />
              </span>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.05em] text-muted">Guardião Elétrico</div>
                <div className="text-[14px] font-bold leading-tight">Detecção combinada</div>
              </div>
            </div>
            <ul className="mt-3">
              {guardianPoints.map((item) => (
                <li key={item} className="flex gap-2 border-b border-ink/15 py-2 text-[12px] leading-snug text-[#3F4A44]">
                  <Check size={13} className="mt-0.5 flex-none text-safe" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-l-4 border-safety bg-[#F2C230]/10 px-3 py-2.5 text-[11px] leading-relaxed text-[#3F4A44]">
          <p className="flex gap-2">
            <Info size={13} className="mt-0.5 flex-none text-ink" />
            <span>
              <strong className="font-bold text-ink">Protótipo atual:</strong> detecção de mão, sensor de vibração,
              regra combinada e buzzer local. <strong className="font-bold text-ink">Planejado:</strong> obstrução,
              adulteração física, alarme e aviso no celular. A comparação é com uma câmera básica sem alertas
              inteligentes, não com todas as câmeras.
            </span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t-2 border-ink pt-4 sm:flex-row sm:flex-wrap sm:items-center">
          <button type="button" ref={primaryRef} className="btn btn-primary" onClick={onRestart}>
            <RotateCcw size={15} /> Repetir demonstração
          </button>
          <button type="button" className="btn btn-ghost" onClick={onPricing}>
            <ShoppingBag size={15} /> Ver planos e simular compra
          </button>
          <button type="button" className="btn btn-quiet" onClick={onHow}>
            <Lightbulb size={15} /> Como o Guardião pensa
          </button>
          <button type="button" className="btn btn-quiet sm:ml-auto" onClick={onHome}>
            Voltar ao início
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
