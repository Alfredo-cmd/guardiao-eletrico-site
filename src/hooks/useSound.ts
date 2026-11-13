import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tiny WebAudio helper: no audio files, no network, no autoplay.
 * The context is only created after an explicit user gesture (the sound
 * toggle), which keeps browsers happy and the pitch silent by default.
 */
export function useSound(alarm: boolean, phone: boolean) {
  const [soundOn, setSoundOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const prevAlarm = useRef(false)
  const prevPhone = useRef(false)

  const ensureContext = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const beep = useCallback(
    (ctx: AudioContext, start: number, freq: number, duration: number, volume = 0.14, type: OscillatorType = 'square') => {
      const t = ctx.currentTime + start
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(volume, t + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + duration + 0.03)
    },
    [],
  )

  const playAlarm = useCallback(() => {
    const ctx = ensureContext()
    if (!ctx) return
    beep(ctx, 0, 660, 0.2, 0.12)
    beep(ctx, 0.22, 880, 0.2, 0.12)
    beep(ctx, 0.44, 660, 0.2, 0.12)
    beep(ctx, 0.66, 880, 0.32, 0.11)
  }, [beep, ensureContext])

  const playChime = useCallback(() => {
    const ctx = ensureContext()
    if (!ctx) return
    beep(ctx, 0, 880, 0.14, 0.07, 'sine')
    beep(ctx, 0.16, 1320, 0.26, 0.06, 'sine')
  }, [beep, ensureContext])

  useEffect(() => {
    if (soundOn && alarm && !prevAlarm.current) playAlarm()
    prevAlarm.current = alarm
  }, [alarm, soundOn, playAlarm])

  useEffect(() => {
    if (soundOn && phone && !prevPhone.current) playChime()
    prevPhone.current = phone
  }, [phone, soundOn, playChime])

  useEffect(() => {
    return () => {
      void ctxRef.current?.close()
      ctxRef.current = null
    }
  }, [])

  const toggleSound = useCallback(() => {
    const next = !soundOn
    setSoundOn(next)
    if (next) {
      ensureContext()
      if (alarm) playAlarm()
    }
  }, [alarm, ensureContext, playAlarm, soundOn])

  return { soundOn, toggleSound }
}
