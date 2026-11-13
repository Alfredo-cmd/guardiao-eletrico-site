import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HomeScreen } from '../screens/HomeScreen'
import { HowItWorksScreen } from '../screens/HowItWorksScreen'
import { PricingScreen } from '../screens/PricingScreen'
import { SimulatorScreen } from '../screens/SimulatorScreen'

type View = 'home' | 'pitch' | 'explore' | 'how' | 'pricing'

const titles: Record<View, string> = {
  home: 'Guardião Elétrico — Simulação interativa',
  pitch: 'Guardião Elétrico — Comparação guiada',
  explore: 'Guardião Elétrico — Explorar sinais',
  how: 'Guardião Elétrico — Como funciona',
  pricing: 'Guardião Elétrico — Planos e simulação de compra',
}

export function App() {
  const [view, setView] = useState<View>('home')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.title = titles[view]
  }, [view])

  const home = () => setView('home')

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={view}
        className="min-h-dvh"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {view === 'home' && (
          <HomeScreen
            onCompare={() => setView('pitch')}
            onExplore={() => setView('explore')}
            onHow={() => setView('how')}
            onPricing={() => setView('pricing')}
          />
        )}

        {view === 'how' && (
          <HowItWorksScreen onBack={home} onCompare={() => setView('pitch')} />
        )}

        {view === 'pricing' && (
          <PricingScreen
            onBack={home}
            onHome={home}
            onCompare={() => setView('pitch')}
            onHow={() => setView('how')}
          />
        )}

        {(view === 'pitch' || view === 'explore') && (
          <SimulatorScreen
            key={view}
            mode={view}
            onExit={home}
            onHow={() => setView('how')}
            onPricing={() => setView('pricing')}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
