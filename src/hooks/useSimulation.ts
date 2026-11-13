import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  initialExploreState,
  readExplore,
  steps,
  type ExploreReadout,
  type ExploreState,
  type Signals,
  type SimPhase,
} from '../data/scenes'

type SimMode = 'pitch' | 'explore'

interface UseSimulationOptions {
  mode: SimMode
  autoStart?: boolean
}

export function useSimulation({ mode, autoStart = false }: UseSimulationOptions) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [explore, setExplore] = useState<ExploreState>(initialExploreState)
  const elapsedRef = useRef(0)

  const step = steps[Math.min(index, steps.length - 1)]
  const isSummary = step.phase === 'summary'

  // Pitch mode: start automatically when the screen opens.
  useEffect(() => {
    if (mode === 'pitch' && autoStart) {
      elapsedRef.current = 0
      setIndex(0)
      setPlaying(true)
    }
  }, [mode, autoStart])

  // A summary step has no duration and must stop the autoplay clock.
  useEffect(() => {
    if (isSummary) setPlaying(false)
  }, [isSummary])

  // Autoplay clock. No per-frame React state: the visual progress bar is CSS.
  useEffect(() => {
    if (mode !== 'pitch' || !playing || step.duration <= 0) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - last, 250)
      last = now
      elapsedRef.current += dt

      if (elapsedRef.current >= step.duration) {
        if (index < steps.length - 1) {
          elapsedRef.current = 0
          setIndex(index + 1)
        } else {
          setPlaying(false)
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode, playing, step.duration, index])

  const goTo = useCallback(
    (nextIndex: number, play?: boolean) => {
      const clamped = Math.max(0, Math.min(steps.length - 1, nextIndex))
      elapsedRef.current = 0
      setIndex(clamped)
      if (clamped === steps.length - 1) setPlaying(false)
      else if (play !== undefined) setPlaying(play)
    },
    [],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])
  const restart = useCallback(() => goTo(0, true), [goTo])

  const togglePlay = useCallback(() => {
    if (isSummary) {
      goTo(0, true)
      return
    }
    setPlaying((value) => !value)
  }, [goTo, isSummary])

  const goToPhase = useCallback(
    (phase: Exclude<SimPhase, 'summary'>) => {
      const target = steps.findIndex((item) => item.phase === phase)
      if (target >= 0) goTo(target, true)
    },
    [goTo],
  )

  const readout = useMemo<ExploreReadout>(() => readExplore(explore), [explore])

  const exploreSignals = useMemo<Signals>(
    () => ({
      recording: true,
      hand: !explore.basicMode && explore.hand,
      vibration: !explore.basicMode && explore.vibration,
      obstructed: explore.obstruction,
      tamper: !explore.basicMode && explore.tamper,
      alarm: readout.alarm,
      phone: false,
      phoneAlarm: !explore.basicMode && explore.phoneAlarm && readout.alarm,
    }),
    [explore, readout.alarm],
  )

  const toggleExplore = useCallback((key: 'hand' | 'vibration' | 'obstruction' | 'tamper' | 'phoneAlarm') => {
    setExplore((state) => ({ ...state, [key]: !state[key] }))
  }, [])

  const setBasicMode = useCallback((value: boolean) => {
    setExplore((state) =>
      value
        ? { basicMode: true, hand: false, vibration: false, obstruction: false, tamper: false, phoneAlarm: false }
        : { ...state, basicMode: false },
    )
  }, [])

  const resetExplore = useCallback(() => setExplore(initialExploreState), [])

  const signals = mode === 'explore' ? exploreSignals : step.signals
  const character = mode === 'explore' ? 1 : step.character
  const pose = mode === 'explore' ? (explore.hand || explore.vibration ? 'reach' : 'idle') : step.pose
  const planned = mode === 'explore' ? readout.tone === 'planned' : Boolean(step.planned)
  const highlight = mode === 'explore' ? null : step.highlight
  const characterSnap = mode === 'pitch' && step.character === 0
  const characterDuration =
    mode === 'explore'
      ? 1200
      : step.id === 'cameraApproach' || step.id === 'guardianApproach'
        ? Math.round(step.duration * 0.72)
        : 900

  return {
    mode,
    step,
    index,
    total: steps.length,
    playing,
    isSummary,
    signals,
    character,
    pose,
    planned,
    highlight,
    characterSnap,
    characterDuration,
    // pitch controls
    next,
    prev,
    restart,
    togglePlay,
    goToPhase,
    goToStep: goTo,
    // explore
    explore,
    readout,
    toggleExplore,
    setBasicMode,
    resetExplore,
  }
}
