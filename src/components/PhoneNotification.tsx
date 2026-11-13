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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      role="status"
      aria-label={
        isAlarm
          ? `Simulação de alarme tocando no celular pelo aplicativo do Guardião Elétrico, às ${DEMO_TIME}, em ${ADDRESS}. Recurso planejado.`
          : `Notificação simulada: possível interferência detectada em ${ADDRESS}, às ${DEMO_TIME}. Recurso planejado.`
      }
    >
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="px-2.5 pb-2.5 pt-1.5">
          <div className="flex items-center justify-between font-mono text-[8.5px] text-paper/50">
            <span>{DEMO_TIME}</span>
            <span className="flex items-center gap-2">
              <Wifi size={9} />
              <BatteryFull size={10} />
            </span>
          </div>

          {isAlarm ? (
            <div className="mt-1.5 border-l-4 border-[#D94A35] bg-paper p-2.5 text-ink">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 flex-none place-items-center bg-[#F2C230] text-ink">
                  <ShieldAlert size={14} strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-bold leading-tight">Guardião Elétrico</span>
                  <span className="block font-mono text-[7px] uppercase tracking-[0.05em] text-[#D94A35]">
                    app aberto / alarme
                  </span>
                </span>
              </div>

              <div className="mt-2.5 flex items-start gap-2">
                <span className="grid h-9 w-9 flex-none place-items-center border border-[#D94A35] text-[#D94A35]">
                  <Siren size={19} className="alarm-flash" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold leading-[1.05] tracking-[-0.02em]">Alarme disparado</p>
                  <p className="mt-1 text-[8.5px] leading-snug text-[#5A665F]">
                    Possível interferência na instalação elétrica
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.04em] text-[#2F6B52]">
                <span className="h-1.5 w-1.5 bg-[#2F6B52]" />
                Alarme no celular ligado
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[7.5px] text-[#5A665F]">
                <MapPin size={8} className="flex-none" />
                {ADDRESS_SHORT} / {DEMO_TIME}
              </div>

              <div className="mt-2 flex items-center justify-center gap-1.5 border border-[#101617] bg-[#101617] py-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-[#EFEFE6]">
                <VolumeX size={10} /> Silenciar no app
              </div>

              <div className="mt-1.5 font-mono text-[6.5px] uppercase tracking-[0.1em] text-[#D94A35]">
                Simulação / planejado
              </div>
            </div>
          ) : (
            <>
              <div className="mt-1.5 border-l-4 border-[#F2C230] bg-paper p-2.5 text-ink">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 flex-none place-items-center bg-[#F2C230] text-ink">
                    <ShieldAlert size={14} strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[10px] font-bold">Guardião Elétrico</span>
                      <span className="font-mono text-[7px] text-[#5A665F]">agora</span>
                    </span>
                    <span className="block font-mono text-[7px] uppercase tracking-[0.05em] text-[#7A5A14]">
                      Alerta planejado
                    </span>
                  </span>
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-[10.5px] font-bold leading-snug">
                  <Bell size={11} className="mt-0.5 flex-none" />
                  Possível interferência detectada
                </p>
                <p className="mt-0.5 pl-[16px] text-[8.5px] leading-snug text-[#5A665F]">
                  Obstrução da câmera / vibração na instalação
                </p>
                <div className="mt-2 flex items-center gap-1.5 border-t border-ink/15 pt-1.5 font-mono text-[7.5px] text-[#5A665F]">
                  <MapPin size={8} className="flex-none" />
                  <span className="truncate">{ADDRESS_SHORT} / localização cadastrada</span>
                </div>
              </div>

              <div className="mt-1.5 text-center font-mono text-[6.5px] uppercase tracking-[0.12em] text-paper/40">
                Simulação / não envia avisos reais
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
