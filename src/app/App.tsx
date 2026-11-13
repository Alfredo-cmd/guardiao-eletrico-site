import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
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

const hashes: Record<View, string> = {
  home: '#/',
  pitch: '#/comparar',
  explore: '#/explorar',
  how: '#/como-funciona',
  pricing: '#/planos',
}

function viewFromHash(hash: string): View {
  switch (hash) {
    case '#/comparar':
      return 'pitch'
    case '#/explorar':
      return 'explore'
    case '#/como-funciona':
      return 'how'
    case '#/planos':
      return 'pricing'
    default:
      return 'home'
  }
}

export function App() {
  const [view, setView] = useState<View>(() =>
    typeof window === 'undefined' ? 'home' : viewFromHash(window.location.hash),
  )

  // Keep the URL shareable and make the browser back/forward buttons work.
  useEffect(() => {
    const initialHash = window.location.hash
    if (!initialHash || !Object.values(hashes).includes(initialHash)) {
      window.history.replaceState(null, '', hashes.home)
    }
    const syncFromLocation = () => setView(viewFromHash(window.location.hash))
    window.addEventListener('hashchange', syncFromLocation)
    window.addEventListener('popstate', syncFromLocation)
    return () => {
      window.removeEventListener('hashchange', syncFromLocation)
      window.removeEventListener('popstate', syncFromLocation)
    }
  }, [])

  useEffect(() => {
    document.title = titles[view]
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [view])

  const navigate = useCallback((next: View) => {
    const target = hashes[next]
    if (window.location.hash !== target) {
      window.history.pushState(null, '', target)
    }
    setView(next)
  }, [])

  const home = useCallback(() => navigate('home'), [navigate])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault()
          const main = document.getElementById('conteudo')
          main?.focus()
          main?.scrollIntoView({ block: 'start' })
        }}
      >
        Pular para o conteúdo
      </a>

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
              onCompare={() => navigate('pitch')}
              onExplore={() => navigate('explore')}
              onHow={() => navigate('how')}
              onPricing={() => navigate('pricing')}
            />
          )}

          {view === 'how' && (
            <HowItWorksScreen
              onBack={home}
              onCompare={() => navigate('pitch')}
              onPricing={() => navigate('pricing')}
            />
          )}

          {view === 'pricing' && (
            <PricingScreen
              onBack={home}
              onHome={home}
              onCompare={() => navigate('pitch')}
              onHow={() => navigate('how')}
            />
          )}

          {(view === 'pitch' || view === 'explore') && (
            <SimulatorScreen
              key={view}
              mode={view}
              onExit={home}
              onHow={() => navigate('how')}
              onPricing={() => navigate('pricing')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}
