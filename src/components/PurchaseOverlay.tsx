import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Barcode, Check, CreditCard, QrCode, ShieldCheck, X } from 'lucide-react'
import { formatBRL, PURCHASE_DISCLAIMER, type Plan } from '../data/plans'

interface PurchaseOverlayProps {
  plan: Plan
  quantity: number
  onClose: () => void
  onHome: () => void
}

type PaymentMethod = 'pix' | 'cartao' | 'boleto'

const payments: { id: PaymentMethod; label: string; icon: typeof QrCode }[] = [
  { id: 'pix', label: 'Pix', icon: QrCode },
  { id: 'cartao', label: 'Cartão', icon: CreditCard },
  { id: 'boleto', label: 'Boleto', icon: Barcode },
]

export function PurchaseOverlay({ plan, quantity, onClose, onHome }: PurchaseOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [payment, setPayment] = useState<PaymentMethod>('pix')
  const [accepted, setAccepted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [orderCode] = useState(() => {
    const year = new Date().getFullYear()
    const seq = String(Math.floor(100 + Math.random() * 900))
    return `GE-${year}-${seq}`
  })

  const setupTotal = plan.setup * quantity
  const monthlyTotal = plan.monthly * quantity

  useEffect(() => {
    panelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
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
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1213]/96 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-title"
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        className="relative my-auto w-full max-w-[720px] border-[3px] border-ink bg-paper p-5 text-ink shadow-[14px_14px_0_#F2C230] outline-none sm:p-7"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-ink pb-3">
          <div>
            <span className="folio">
              <strong>Pedido {orderCode}</strong> / simulação de compra
            </span>
            <h2 id="purchase-title" className="display mt-2 text-[clamp(2rem,4vw,3.2rem)] leading-none">
              {confirmed ? 'Pedido simulado' : 'Confirmar compra'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="stamp stamp--alert">Simulação</span>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
              onClick={onClose}
              aria-label="Fechar simulação de compra"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {confirmed ? (
          <div className="pt-5">
            <div className="flex flex-wrap items-center gap-3 border-2 border-safe p-3">
              <span className="grid h-10 w-10 place-items-center bg-safe text-white">
                <Check size={20} />
              </span>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.05em] text-muted">Pedido</div>
                <div className="font-display text-[26px] leading-none">{orderCode}</div>
              </div>
              <div className="sm:ml-auto sm:text-right">
                <div className="font-mono text-[9px] uppercase tracking-[0.05em] text-muted">Status</div>
                <div className="text-[13px] font-bold text-safe">Simulado</div>
              </div>
            </div>

            <div className="mt-4 border border-ink/20">
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Plano</span>
                <strong>{plan.name}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Quantidade</span>
                <strong>{quantity} kit{quantity > 1 ? 's' : ''}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Pagamento simulado</span>
                <strong className="capitalize">{payment === 'cartao' ? 'Cartão' : payment}</strong>
              </div>
              <div className="flex items-center justify-between bg-safety/15 px-3 py-3">
                <span className="text-[12px] font-bold">Total inicial</span>
                <strong className="font-display text-[26px] leading-none">{formatBRL(setupTotal)}</strong>
              </div>
            </div>

            <p className="mt-3 border-l-4 border-safe pl-3 text-[11px] leading-relaxed text-muted">
              Nenhum pagamento foi processado. Esta tela existe apenas para demonstrar o fluxo comercial no pitch.
            </p>

            <div className="mt-5 flex flex-col gap-2 border-t-2 border-ink pt-4 sm:flex-row">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Voltar aos planos
              </button>
              <button type="button" className="btn btn-ghost" onClick={onHome}>
                Ir para o início
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-5">
            <div className="border border-ink/20">
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Plano</span>
                <strong>{plan.name}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Quantidade</span>
                <strong>{quantity} kit{quantity > 1 ? 's' : ''}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Kit</span>
                <strong>{formatBRL(plan.setup)} / unidade</strong>
              </div>
              <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 text-[12px]">
                <span className="text-muted">Mensalidade</span>
                <strong>{monthlyTotal > 0 ? `${formatBRL(monthlyTotal)} / mês` : 'Sem mensalidade'}</strong>
              </div>
              <div className="flex items-center justify-between bg-safety/15 px-3 py-3">
                <span className="text-[12px] font-bold">Total inicial</span>
                <strong className="font-display text-[28px] leading-none">{formatBRL(setupTotal)}</strong>
              </div>
            </div>

            <div className="mt-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.05em] text-muted">Forma de pagamento</span>
              <div className="mt-2 grid grid-cols-3 border border-ink" role="radiogroup" aria-label="Forma de pagamento simulada">
                {payments.map(({ id, label, icon: Icon }, index) => {
                  const selected = payment === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPayment(id)}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2.5 text-[11.5px] font-semibold transition-colors ${
                        index < payments.length - 1 ? 'border-r border-ink' : ''
                      } ${selected ? 'bg-safety text-ink' : 'bg-transparent text-muted hover:bg-ink hover:text-paper'}`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2 border border-ink/20 px-3 py-2.5 text-[11px] leading-snug text-[#3F4A44]">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 flex-none accent-[#2F6B52]"
              />
              <span>
                Entendi que esta é uma <strong className="text-ink">simulação</strong>. Nenhum pagamento será processado e
                nenhum pedido será criado.
              </span>
            </label>

            <p className="mt-3 flex items-start gap-2 border-l-2 border-safety pl-3 text-[10px] leading-relaxed text-muted">
              <ShieldCheck size={12} className="mt-0.5 flex-none" />
              {PURCHASE_DISCLAIMER}
            </p>

            <div className="mt-5 flex flex-col gap-2 border-t-2 border-ink pt-4 sm:flex-row">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!accepted}
                onClick={() => setConfirmed(true)}
              >
                Confirmar pedido simulado
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
