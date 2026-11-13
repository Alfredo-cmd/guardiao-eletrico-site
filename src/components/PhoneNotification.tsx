import { motion } from 'motion/react'
import { Bell, MapPin, ShieldAlert, Wifi, BatteryFull, Siren, VolumeX } from 'lucide-react'
import { ADDRESS, ADDRESS_SHORT, DEMO_TIME } from '../data/scenes'

interface PhoneNotificationProps {
  variant?: 'notification' | 'alarm'
}

export function PhoneNotification({ variant = 'notification' }: PhoneNotificationProps) {
  const isAlarm = variant === 'alarm'

  return (
    <motion.div
      className={`phone-shell ${isAlarm ? 'phone-shell--alarm' : ''}`}
      initial={{ opacity: 0, y: -14, scale: 0.94, rotate: 2 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 210, damping: 22 }}
      role="status"
      aria-label={
        isAlarm
          ? `Simulação de alarme tocando no celular pelo aplicativo do Guardião Elétrico, às ${DEMO_TIME}, em ${ADDRESS}. Recurso planejado.`
          : `Notificação simulada: possível interferência detectada em ${ADDRESS}, às ${DEMO_TIME}. Recurso planejado.`
      }
    >
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="px-3 pb-3 pt-2">
          <div className="flex items-center justify-between font-mono text-[9px] text-white/55">
            <span>{DEMO_TIME}</span>
            <span className="flex items-center gap-1.5">
              <Wifi size={10} />
              <BatteryFull size={11} />
            </span>
          </div>

          {isAlarm ? (
            <div className="mt-2 rounded-xl border border-[#FF6874]/45 bg-[#FF6874]/10 p-2.5 text-center">
              <div className="flex items-center gap-2 text-left">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-linear-to-br from-[#35D6EF] to-[#57D9B2] text-[#06131F]">
                  <ShieldAlert size={14} strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-semibold text-white/90">Guardião Elétrico</span>
                  <span className="block font-mono text-[7.5px] uppercase tracking-[0.16em] text-[#FF8A94]">
                    app aberto · alarme
                  </span>
                </span>
              </div>

              <div className="relative mx-auto mt-2 grid h-12 w-12 place-items-center">
                <span className="absolute inset-0 rounded-full border border-[#FF6874]/45 ring-pulse" />
                <span className="grid h-12 w-12 place-items-center rounded-full border border-[#FF6874]/50 bg-[#FF6874]/15 text-[#FF8A94]">
                  <Siren size={23} className="alarm-flash" />
                </span>
              </div>

              <p className="mt-2 text-[12px] font-bold leading-tight text-white">Alarme disparado</p>
              <p className="mt-0.5 text-[9.5px] leading-snug text-white/60">
                Possível interferência na instalação elétrica
              </p>

              <div className="mt-1.5 flex items-center justify-center gap-1.5 font-mono text-[8px] text-[#B9F4E3]/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#57D9B2] shadow-[0_0_8px_#57D9B2]" />
                Alarme no celular ligado
              </div>

              <div className="mt-2 flex items-center justify-center gap-1 font-mono text-[8px] text-white/50">
                <MapPin size={9} className="flex-none text-[#35D6EF]" />
                {ADDRESS_SHORT} · {DEMO_TIME}
              </div>

              <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[9px] font-semibold text-white/75">
                <VolumeX size={11} /> Silenciar no app
              </div>

              <div className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.2em] text-[#F4C95D]/60">
                simulação · planejado
              </div>
            </div>
          ) : (
            <>
              <div className="mt-2 rounded-xl border border-[#F4C95D]/35 bg-[#F4C95D]/8 p-2.5 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-linear-to-br from-[#35D6EF] to-[#57D9B2] text-[#06131F]">
                    <ShieldAlert size={14} strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[10px] font-semibold text-white/90">Guardião Elétrico</span>
                      <span className="font-mono text-[8px] text-white/40">agora</span>
                    </span>
                    <span className="block truncate font-mono text-[8px] uppercase tracking-[0.14em] text-[#F4C95D]/80">
                      Alerta planejado
                    </span>
                  </span>
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-[#F5F8FD]">
                  <Bell size={12} className="mt-0.5 flex-none text-[#F4C95D]" />
                  Possível interferência detectada
                </p>
                <p className="mt-1 pl-[18px] text-[9.5px] leading-snug text-white/55">
                  Obstrução da câmera · vibração na instalação
                </p>
                <div className="mt-2 flex items-center gap-1.5 border-t border-white/8 pt-2 font-mono text-[8px] text-white/50">
                  <MapPin size={9} className="flex-none text-[#35D6EF]" />
                  <span className="truncate">{ADDRESS_SHORT} · localização cadastrada</span>
                </div>
              </div>

              <div className="mt-2 text-center font-mono text-[7px] uppercase tracking-[0.24em] text-[#F4C95D]/55">
                Simulação · não envia avisos reais
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
