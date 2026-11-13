import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, Check, EyeOff, Hand, Info, ShieldAlert, Siren, Smartphone, Waves } from 'lucide-react'
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
        className={`grid h-8 w-8 flex-none place-items-center border ${
          checked
            ? planned
              ? 'border-safety bg-safety/10 text-safety'
              : 'border-ink bg-ink/5 text-ink'
            : 'border-ink/25 text-ink/45'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold text-ink">{label}</span>
        <span className="block truncate text-[10.5px] text-muted">{hint}</span>
      </span>
      <span className="hidden font-mono text-[8.5px] text-muted sm:inline">{checked ? 'SIM' : 'NÃO'}</span>
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
    <section className="border-2 border-ink bg-paper" aria-labelledby="flow-title">
      <header className="flex items-start justify-between gap-3 bg-ink px-4 py-3 text-paper">
        <div>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.05em] text-safety">Ficha 003 / regra</span>
          <h2 id="flow-title" className="mt-0.5 text-[20px] font-bold leading-tight">
            Teste a regra combinada
          </h2>
        </div>
        <span className="stamp" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}>
          Interativo
        </span>
      </header>

      <div className="p-4 sm:p-5">
        <p className="max-w-[52ch] text-[12px] leading-relaxed text-muted">
          Ligue e desligue os sinais. O alarme local só dispara quando a câmera vê uma mão <strong className="text-ink">e</strong> o
          sensor sente vibração.
        </p>

        <div className="mt-4 border-t border-ink/20">
          <SignalSwitch
            label="Câmera detecta mão?"
            hint="Visão computacional na área monitorada"
            icon={<Hand size={16} />}
            checked={hand}
            onChange={() => setHand((value) => !value)}
          />
          <SignalSwitch
            label="Sensor detecta vibração?"
            hint="Sensor de vibração na instalação elétrica"
            icon={<Waves size={16} />}
            checked={vibration}
            onChange={() => setVibration((value) => !value)}
          />
        </div>

        <div className="my-2 flex justify-center text-ink/35">
          <ArrowDown size={14} />
        </div>

        <div className="flex items-center gap-3 border border-ink px-3 py-3">
          <span className="grid h-10 w-10 flex-none place-items-center bg-ink font-display text-[20px] text-safety">
            E
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[8px] uppercase tracking-[0.04em] text-muted">Condição de alerta</div>
            <div className="mt-0.5 font-mono text-[11px] text-ink">
              mão <span className="text-safety">E</span> vibração
            </div>
          </div>
          <span className="ml-auto hidden text-right text-[9.5px] leading-tight text-muted sm:block">
            Os dois sinais
            <br />
            precisam estar ativos
          </span>
        </div>

        <div className="my-2 flex justify-center text-ink/35">
          <ArrowDown size={14} />
        </div>

        <div
          aria-live="polite"
          className={`border-l-4 p-3 ${alarm ? 'border-signal bg-signal/8' : 'border-ink/30 bg-paper-2'}`}
        >
          <div className="flex items-center gap-2">
            <Siren size={14} className={alarm ? 'text-signal' : 'text-ink/60'} />
            <span className="font-mono text-[8px] uppercase tracking-[0.04em] text-muted">Buzzer local</span>
            <span className={`ml-auto font-mono text-[8px] ${alarm ? 'text-signal' : 'text-muted'}`}>
              {alarm ? 'ATIVO' : 'EM ESPERA'}
            </span>
          </div>
          <div className={`mt-1 text-[18px] font-bold leading-tight ${alarm ? 'text-signal' : 'text-ink'}`}>
            {alarm ? 'Alarme local ativo' : 'Em espera'}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 border border-ink/20 bg-paper-2 px-3 py-2 font-mono text-[9.5px] leading-relaxed text-muted">
          <Info size={11} className="mt-0.5 flex-none text-ink" />
          <span>
            maoDetectada <span className="text-[#7A5A14]">&amp;&amp;</span> vibracaoDetectada → alarmeLocal = true
          </span>
        </div>

        <div className="mt-5 border-2 border-ink border-l-[6px] border-l-safety p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] font-bold">Recursos planejados</span>
            <span className="stamp stamp--planned">Independentes</span>
          </div>
          <p className="mt-1 text-[10.5px] leading-snug text-muted">
            Estas ramificações <strong className="text-ink">não</strong> usam a regra acima. No futuro, elas também
            acionariam o alarme local e o alarme no celular pelo app — ainda não implementado.
          </p>

          <div className="mt-1 border-t border-ink/15">
            <SignalSwitch
              label="Obstrução da câmera"
              hint="Alerta próprio quando a visão é perdida"
              icon={<EyeOff size={16} />}
              checked={obstruction}
              onChange={() => setObstruction((value) => !value)}
              planned
            />
            <SignalSwitch
              label="Adulteração física"
              hint="Sensor dedicado a interferência no equipamento"
              icon={<ShieldAlert size={16} />}
              checked={tamper}
              onChange={() => setTamper((value) => !value)}
              planned
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {obstruction && (
              <span className="chip">
                <Check size={9} /> Alerta de obstrução
              </span>
            )}
            {tamper && (
              <span className="chip">
                <Check size={9} /> Alerta de adulteração
              </span>
            )}
            {!obstruction && !tamper && <span className="chip chip-ghost">Ative para ver a lógica futura</span>}
          </div>

          <div className="mt-3 border-t border-ink/15 pt-3">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
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
                  animate={{ opacity: 1, height: 286 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative mx-auto mt-3 h-[250px] w-full max-w-[280px] overflow-hidden border border-ink/20 bg-paper-2"
                >
                  <div className="absolute inset-0">
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
