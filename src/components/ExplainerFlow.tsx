import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDown,
  Check,
  EyeOff,
  Hand,
  Info,
  ShieldAlert,
  Siren,
  Smartphone,
  Waves,
} from 'lucide-react'
import { PhoneNotification } from './PhoneNotification'

function SignalSwitch({
  label,
  hint,
  icon,
  checked,
  onChange,
  planned = false,
}: {
  label: string
  hint: string
  icon: ReactNode
  checked: boolean
  onChange: () => void
  planned?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      data-on={checked}
      data-planned={planned}
      className="signal-row text-left"
    >
      <span
        className="grid h-9 w-9 flex-none place-items-center rounded-[10px] border"
        style={{
          borderColor: checked
            ? planned
              ? 'rgba(244,201,93,0.4)'
              : 'rgba(53,214,239,0.4)'
            : 'var(--line)',
          background: checked
            ? planned
              ? 'rgba(244,201,93,0.1)'
              : 'rgba(53,214,239,0.1)'
            : 'rgba(8,17,31,0.4)',
          color: checked ? (planned ? '#F4C95D' : '#35D6EF') : '#7E93A8',
        }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold text-paper/90">{label}</span>
        <span className="block truncate text-[10.5px] text-muted">{hint}</span>
      </span>
      <span
        className="hidden font-mono text-[9px] uppercase tracking-[0.14em] sm:inline"
        style={{ color: checked ? (planned ? '#F4C95D' : '#57D9B2') : '#7E93A8' }}
      >
        {checked ? 'SIM' : 'NÃO'}
      </span>
      <span className={`switch ${planned ? 'switch--planned' : ''}`} aria-hidden="true" />
    </button>
  )
}

export function ExplainerFlow() {
  const [hand, setHand] = useState(false)
  const [vibration, setVibration] = useState(false)
  const [obstruction, setObstruction] = useState(false)
  const [tamper, setTamper] = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)

  const alarm = hand && vibration

  return (
    <section className="panel overflow-hidden" aria-labelledby="flow-title">
      <div className="border-b border-white/8 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">Lógica do protótipo</span>
          <span className="chip chip-current">Interativo</span>
        </div>
        <h2 id="flow-title" className="mt-1.5 font-display text-xl font-semibold text-paper sm:text-2xl">
          Teste a regra combinada
        </h2>
        <p className="mt-1 max-w-[540px] text-[12.5px] leading-snug text-muted">
          Ligue e desligue os sinais. O alarme local só dispara quando a câmera vê uma mão <strong className="text-paper/85">e</strong> o
          sensor sente vibração.
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid gap-2">
          <SignalSwitch
            label="Câmera detecta mão?"
            hint="Visão computacional na área monitorada"
            icon={<Hand size={17} />}
            checked={hand}
            onChange={() => setHand((value) => !value)}
          />
          <SignalSwitch
            label="Sensor detecta vibração?"
            hint="Sensor de vibração na instalação elétrica"
            icon={<Waves size={17} />}
            checked={vibration}
            onChange={() => setVibration((value) => !value)}
          />
        </div>

        <div className="my-2 flex justify-center text-white/25">
          <ArrowDown size={15} />
        </div>

        <div
          className="flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors"
          style={{
            borderColor: alarm ? 'rgba(87,217,178,0.45)' : 'var(--line)',
            background: alarm ? 'rgba(87,217,178,0.07)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span
            className="grid h-10 w-10 flex-none place-items-center rounded-full border font-display text-lg font-bold"
            style={{
              borderColor: alarm ? 'rgba(87,217,178,0.5)' : 'rgba(150,190,225,0.22)',
              color: alarm ? '#57D9B2' : '#9DB0C7',
              background: alarm ? 'rgba(87,217,178,0.12)' : 'transparent',
              boxShadow: alarm ? '0 0 26px -6px rgba(87,217,178,0.6)' : 'none',
            }}
          >
            E
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Condição de alerta</div>
            <div className="mt-0.5 font-mono text-[11px] leading-relaxed text-paper/85">
              mão <span className="text-[#57D9B2]">E</span> vibração
            </div>
          </div>
          <span className="ml-auto hidden text-right text-[10px] leading-tight text-muted sm:block">
            Os dois sinais
            <br />
            precisam estar ativos
          </span>
        </div>

        <div className="my-2 flex justify-center text-white/25">
          <ArrowDown size={15} />
        </div>

        <div
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors"
          style={{
            borderColor: alarm ? 'rgba(255,104,116,0.45)' : 'var(--line)',
            background: alarm ? 'rgba(255,104,116,0.08)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span
            className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border"
            style={{
              borderColor: alarm ? 'rgba(255,104,116,0.45)' : 'var(--line)',
              color: alarm ? '#FF6874' : '#7E93A8',
              background: alarm ? 'rgba(255,104,116,0.12)' : 'transparent',
            }}
          >
            <Siren size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Buzzer local</div>
            <div className="font-display text-[15px] font-semibold" style={{ color: alarm ? '#FF8A94' : '#F5F8FD' }}>
              {alarm ? 'Alarme local ativo' : 'Em espera'}
            </div>
          </div>
          <span className={`led ${alarm ? 'led--alert' : ''}`} />
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-white/8 bg-black/20 px-3 py-2 font-mono text-[10px] leading-relaxed text-muted">
          <Info size={12} className="mt-0.5 flex-none text-[#35D6EF]" />
          <span>
            maoDetectada <span className="text-[#57D9B2]">&amp;&amp;</span> vibracaoDetectada → alarmeLocal = true
          </span>
        </div>

        {/* planned branches */}
        <div className="mt-5 rounded-2xl border border-dashed border-[#F4C95D]/35 bg-[#F4C95D]/4 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[#F4C95D]/85">Recursos planejados</span>
            <span className="chip chip-planned">Independentes</span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted">
            Estas ramificações <strong className="text-paper/80">não</strong> usam a regra acima. No futuro, elas também
            acionariam o alarme local e o alarme no celular pelo app — ainda não implementado.
          </p>

          <div className="mt-3 grid gap-2">
            <SignalSwitch
              label="Obstrução da câmera (planejado)"
              hint="Alerta próprio quando a visão é perdida"
              icon={<EyeOff size={17} />}
              checked={obstruction}
              onChange={() => setObstruction((value) => !value)}
              planned
            />
            <SignalSwitch
              label="Adulteração física (planejado)"
              hint="Sensor dedicado a interferência no equipamento"
              icon={<ShieldAlert size={17} />}
              checked={tamper}
              onChange={() => setTamper((value) => !value)}
              planned
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {obstruction && (
              <span className="chip chip-planned">
                <Check size={10} /> Alerta de obstrução
              </span>
            )}
            {tamper && (
              <span className="chip chip-planned">
                <Check size={10} /> Alerta de adulteração
              </span>
            )}
            {!obstruction && !tamper && (
              <span className="chip chip-ghost">Ative para visualizar a lógica futura</span>
            )}
          </div>

          <div className="mt-3 border-t border-[#F4C95D]/15 pt-3">
            <button
              type="button"
              className="btn btn-sm border border-[#F4C95D]/35 bg-[#F4C95D]/8 text-[#FFE9B1] hover:bg-[#F4C95D]/14"
              onClick={() => setPhoneOpen((value) => !value)}
              aria-expanded={phoneOpen}
            >
              <Smartphone size={14} />
              {phoneOpen ? 'Ocultar notificação simulada' : 'Ver notificação simulada'}
            </button>

            <AnimatePresence initial={false}>
              {phoneOpen && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 262 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative mt-3 overflow-hidden rounded-xl border border-white/8 bg-black/20"
                >
                  <div className="absolute inset-0 grid place-items-center p-2">
                    <PhoneNotification />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
