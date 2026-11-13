import { useId, type CSSProperties } from 'react'
import {
  Camera as CameraIcon,
  CameraOff,
  Hand,
  Radio,
  Siren,
  ShieldAlert,
  Zap,
} from 'lucide-react'
import { Character } from './Character'
import { PhoneNotification } from './PhoneNotification'
import { iso, poly, CAMERA_POS, BOX_CENTER, type Point } from '../lib/iso'
import type { Highlight, Signals } from '../data/scenes'

interface HouseSceneProps {
  signals: Signals
  character?: number
  pose?: 'idle' | 'walk' | 'reach'
  highlight?: Highlight
  lens?: 'camera' | 'guardian' | 'summary'
  characterSnap?: boolean
  characterDuration?: number
  planned?: boolean
  compact?: boolean
  className?: string
}

const cream = '#e8e1d0'
const creamSide = '#cec3af'
const creamDark = '#b9ad96'
const roof = '#2f4b53'
const roofDark = '#1f3339'
const roofLight = '#466870'

export function HouseScene({
  signals,
  character = 0,
  pose = 'idle',
  highlight = null,
  lens = 'guardian',
  characterSnap = false,
  characterDuration = 3200,
  planned = false,
  compact = false,
  className = '',
}: HouseSceneProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const id = (name: string) => `${name}-${uid}`

  const guardian = lens !== 'camera'
  const walking = pose === 'walk'

  // Character path (screen space) — starts off the left edge of the yard.
  const start: Point = [-78, 505]
  const end: Point = [374, 604]
  const cx = start[0] + (end[0] - start[0]) * character
  const cy = start[1] + (end[1] - start[1]) * character

  // House shell
  const B = iso(4, 0, 2.6)
  const C = iso(4, 3, 2.6)
  const D = iso(0, 3, 2.6)
  const Bb = iso(4, 0, 0)
  const Cb = iso(4, 3, 0)
  const Db = iso(0, 3, 0)

  // Hip roof: short ridge along x, two visible faces (south slope + east hip).
  const eaveS1 = iso(-0.38, 3.38, 2.64)
  const eaveS2 = iso(4.38, 3.38, 2.64)
  const eaveN2 = iso(4.38, -0.38, 2.64)
  const ridge1 = iso(1.0, 1.5, 3.52)
  const ridge2 = iso(3.0, 1.5, 3.52)

  // Door and window on the front-left wall (y = 3)
  const door = [
    iso(0.66, 3, 0),
    iso(1.7, 3, 0),
    iso(1.7, 3, 2.02),
    iso(0.66, 3, 2.02),
  ]
  const doorGlow = [
    iso(0.82, 3, 2.06),
    iso(1.54, 3, 2.06),
    iso(1.54, 3, 2.5),
    iso(0.82, 3, 2.5),
  ]
  const windowMain = [
    iso(2.9, 3, 1.12),
    iso(3.66, 3, 1.12),
    iso(3.66, 3, 2.06),
    iso(2.9, 3, 2.06),
  ]
  const windowSide = [
    iso(4, 1.0, 1.28),
    iso(4, 1.82, 1.28),
    iso(4, 1.82, 2.12),
    iso(4, 1.0, 2.12),
  ]

  // External electrical box
  const box = [
    iso(2.02, 3, 0.98),
    iso(2.68, 3, 0.98),
    iso(2.68, 3, 1.84),
    iso(2.02, 3, 1.84),
  ]
  const boxCenter = BOX_CENTER
  const cameraPos = CAMERA_POS
  const sensorPos = iso(2.56, 3, 1.98)
  const buzzerPos = iso(1.14, 3, 2.34)

  const groundRing = character > 0.85
  const idleDevices = !signals.hand && !signals.vibration && !signals.alarm

  const focus = (() => {
    if (highlight === 'camera') return { x: cameraPos[0], y: cameraPos[1] + 4, r: 34 }
    if (highlight === 'box') return { x: boxCenter[0], y: boxCenter[1], r: 62 }
    if (highlight === 'sensor') return { x: boxCenter[0], y: boxCenter[1] - 10, r: 52 }
    if (highlight === 'buzzer') return { x: buzzerPos[0], y: buzzerPos[1], r: 34 }
    return null
  })()

  const tone = planned ? '#f2c230' : signals.alarm ? '#d94a35' : '#efefe6'

  const tagStyle = (p: Point, dx = 0, dy = 0): CSSProperties => ({
    left: `calc(${(p[0] / 1000) * 100}% + ${dx}px)`,
    top: `calc(${(p[1] / 720) * 100}% + ${dy}px)`,
  })

  return (
    <div
      className={`scene-frame ${signals.alarm ? 'is-alarm' : ''} ${planned ? 'is-planned' : ''} ${
        signals.obstructed ? 'is-obstructed' : ''
      } ${className}`}
    >
      <div className="scene-aspect">
        <svg
          className="scene-svg"
          viewBox="0 0 1000 720"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#132b2c" />
              <stop offset="58%" stopColor="#0d2022" />
              <stop offset="100%" stopColor="#081416" />
            </linearGradient>
            <linearGradient id={id('grass')} x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#1d4038" />
              <stop offset="48%" stopColor="#173530" />
              <stop offset="100%" stopColor="#0e2823" />
            </linearGradient>
            <linearGradient id={id('grassEdge')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6cc49b" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#6cc49b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6cc49b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={id('wallFront')} x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#f2ebdb" />
              <stop offset="62%" stopColor={cream} />
              <stop offset="100%" stopColor="#d8cdb8" />
            </linearGradient>
            <linearGradient id={id('wallSide')} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor={creamSide} />
              <stop offset="100%" stopColor={creamDark} />
            </linearGradient>
            <linearGradient id={id('roof')} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor={roofLight} />
              <stop offset="48%" stopColor={roof} />
              <stop offset="100%" stopColor={roofDark} />
            </linearGradient>
            <linearGradient id={id('roofEast')} x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#263e44" />
              <stop offset="55%" stopColor="#20363c" />
              <stop offset="100%" stopColor="#172a2f" />
            </linearGradient>
            <linearGradient id={id('metal')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e7e2d6" />
              <stop offset="100%" stopColor="#b9b4a6" />
            </linearGradient>
            <linearGradient id={id('glass')} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#f8d97a" />
              <stop offset="55%" stopColor="#f2c230" />
              <stop offset="100%" stopColor="#d6a81f" />
            </linearGradient>
            <radialGradient id={id('moonGlow')} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#efe6cc" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#efe6cc" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id('alarmGlow')} cx="36%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#d94a35" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#d94a35" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id('warmPool')} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f2c230" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#f2c230" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={id('beam')} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#f2c230" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#f2c230" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f2c230" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={id('beamBasic')} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#efefe6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#efefe6" stopOpacity="0" />
            </linearGradient>
            <filter id={id('softShadow')} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="0" />
            </filter>
            <filter id={id('glow')} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="0" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={id('glowStrong')} x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="0" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id={id('roofClip')}>
              <polygon points={poly([eaveS1, eaveS2, ridge2, ridge1])} />
            </clipPath>
          </defs>

          {/* backdrop */}
          <rect width="1000" height="720" fill={`url(#${id('sky')})`} />

          {/* moon + stars */}
          <g opacity="0.9">
            <circle cx="142" cy="112" r="86" fill={`url(#${id('moonGlow')})`} />
            <circle cx="142" cy="112" r="27" fill="#efe6cc" opacity="0.16" />
            <circle cx="142" cy="112" r="18" fill="#f5edda" opacity="0.6" />
            <circle cx="135" cy="107" r="4" fill="#cdbfa3" opacity="0.35" />
            <circle cx="149" cy="117" r="2.5" fill="#cdbfa3" opacity="0.3" />
            {[
              [236, 76, 1.4],
              [318, 132, 1.1],
              [402, 62, 1.6],
              [856, 96, 1.2],
              [905, 176, 1.4],
              [588, 84, 1.1],
              [742, 60, 1.3],
              [76, 236, 1.2],
              [932, 300, 1.1],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="#efe6cc" opacity={0.45} />
            ))}
          </g>

          {/* yard platform */}
          <g>
            <polygon
              points={poly([
                [500, 252],
                [948, 508],
                [500, 756],
                [52, 508],
              ])}
              fill={`url(#${id('grass')})`}
              stroke={`url(#${id('grass')})`}
              strokeWidth="34"
              strokeLinejoin="round"
            />
            <polyline
              points={poly([
                [500, 258],
                [940, 510],
              ])}
              fill="none"
              stroke="#6cc49b"
              strokeWidth="2"
              opacity="0.28"
            />
            <polyline
              points={poly([
                [500, 258],
                [60, 510],
              ])}
              fill="none"
              stroke="#6cc49b"
              strokeWidth="2"
              opacity="0.16"
            />
            {/* grass texture */}
            {[
              [300, 560],
              [350, 610],
              [250, 620],
              [420, 660],
              [600, 660],
              [680, 600],
              [740, 540],
              [820, 540],
              [880, 500],
              [200, 540],
              [150, 500],
              [520, 690],
              [640, 620],
              [760, 500],
              [330, 500],
            ].map(([x, y], i) => (
              <g key={i} opacity={0.5}>
                <path
                  d={`M${x} ${y} q-4 -9 -8 -11 M${x} ${y} q1 -10 4 -13 M${x} ${y} q6 -6 9 -8`}
                  stroke="#6cc49b"
                  strokeWidth="1.6"
                  fill="none"
                  opacity="0.35"
                />
              </g>
            ))}
          </g>

          {/* tree */}
          <g>
            <ellipse cx="174" cy="404" rx="46" ry="15" fill="#061312" opacity="0.55" />
            <path d="M170 402 L166 336 L180 336 L178 404 Z" fill="#40352b" />
            <path d="M166 336 Q160 300 172 288" stroke="#40352b" strokeWidth="5" fill="none" />
            <circle cx="168" cy="300" r="42" fill="#1e4038" />
            <circle cx="134" cy="316" r="28" fill="#1e4038" />
            <circle cx="203" cy="318" r="26" fill="#234a40" />
            <circle cx="172" cy="272" r="27" fill="#2a564a" />
            <circle cx="152" cy="292" r="10" fill="#6cc49b" opacity="0.18" />
            <circle cx="188" cy="284" r="14" fill="#6cc49b" opacity="0.12" />
          </g>

          {/* bushes + rocks */}
          <g>
            <ellipse cx="596" cy="612" rx="34" ry="12" fill="#061312" opacity="0.5" />
            <circle cx="584" cy="602" r="18" fill="#1e4038" />
            <circle cx="608" cy="606" r="14" fill="#234a40" />
            <circle cx="598" cy="590" r="12" fill="#2a564a" />
            <ellipse cx="250" cy="556" rx="20" ry="7" fill="#061312" opacity="0.5" />
            <circle cx="243" cy="548" r="11" fill="#1e4038" />
            <circle cx="256" cy="550" r="8" fill="#234a40" />
            <ellipse cx="700" cy="632" rx="34" ry="11" fill="#061312" opacity="0.45" />
            <circle cx="684" cy="622" r="16" fill="#1e4038" />
            <circle cx="706" cy="624" r="12" fill="#234a40" />
            <circle cx="696" cy="610" r="10" fill="#2a564a" />
            <circle cx="721" cy="616" r="7" fill="#1e4038" />
          </g>

          {/* stepping stones */}
          <g opacity="0.75">
            {[
              [86, 552],
              [132, 566],
              [180, 578],
              [228, 588],
              [276, 596],
              [324, 602],
              [368, 606],
            ].map(([x, y], i) => (
              <g key={i}>
                <polygon
                  points={`${x},${y - 8} ${x + 15},${y} ${x},${y + 8} ${x - 15},${y}`}
                  fill="#334d45"
                />
                <polygon
                  points={`${x},${y - 6} ${x + 11},${y} ${x},${y + 4} ${x - 11},${y}`}
                  fill="#5f7a6c"
                  opacity="0.55"
                />
              </g>
            ))}
          </g>

          {/* house shadow */}
          <ellipse cx="560" cy="512" rx="330" ry="118" fill="#061312" opacity="0.55" filter={`url(#${id('softShadow')})`} />

          {/* warm light pool from the window */}
          <ellipse cx="462" cy="560" rx="120" ry="52" fill={`url(#${id('warmPool')})`} opacity="0.15" />

          {/* right wall (x = 4) */}
          <polygon points={poly([B, C, Cb, Bb])} fill={`url(#${id('wallSide')})`} />
          <path d={`M${B[0]} ${B[1]} L${C[0]} ${C[1]}`} stroke="#8f8572" strokeWidth="1.5" opacity="0.4" />
          {[0.9, 1.55, 2.2].map((z) => (
            <line
              key={z}
              x1={iso(4, 0, z)[0]}
              y1={iso(4, 0, z)[1]}
              x2={iso(4, 3, z)[0]}
              y2={iso(4, 3, z)[1]}
              stroke="#8f8572"
              strokeWidth="1"
              opacity="0.22"
            />
          ))}
          {/* side window */}
          <polygon
            points={poly([
              [windowSide[0][0] - 4, windowSide[0][1] - 4],
              [windowSide[1][0] + 4, windowSide[1][1]],
              [windowSide[2][0] + 4, windowSide[2][1] - 4],
              [windowSide[3][0] - 4, windowSide[3][1] - 4],
            ])}
            fill="#efefe6"
          />
          <polygon points={poly(windowSide)} fill={`url(#${id('glass')})`} opacity="0.92" />
          <polygon
            points={poly(windowSide)}
            fill="none"
            stroke="#7a5a14"
            strokeWidth="1.6"
            opacity="0.5"
          />
          <line
            x1={iso(4, 1.42, 1.28)[0]}
            y1={iso(4, 1.42, 1.28)[1]}
            x2={iso(4, 1.42, 2.12)[0]}
            y2={iso(4, 1.42, 2.12)[1]}
            stroke="#7a5a14"
            strokeWidth="1.4"
            opacity="0.5"
          />
          <line
            x1={iso(4, 1.0, 1.7)[0]}
            y1={iso(4, 1.0, 1.7)[1]}
            x2={iso(4, 1.82, 1.7)[0]}
            y2={iso(4, 1.82, 1.7)[1]}
            stroke="#7a5a14"
            strokeWidth="1.4"
            opacity="0.5"
          />

          {/* downspout on the side wall */}
          <g>
            <path
              d={`M${iso(4.04, 0.6, 2.56)[0]} ${iso(4.04, 0.6, 2.56)[1]} L${iso(4.04, 0.6, 0.2)[0]} ${
                iso(4.04, 0.6, 0.2)[1]
              } L${iso(4.04, 0.98, 0.03)[0]} ${iso(4.04, 0.98, 0.03)[1]}`}
              fill="none"
              stroke="#5f6d67"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M${iso(4.04, 0.6, 2.56)[0]} ${iso(4.04, 0.6, 2.56)[1]} L${iso(4.04, 0.6, 0.2)[0]} ${
                iso(4.04, 0.6, 0.2)[1]
              } L${iso(4.04, 0.98, 0.03)[0]} ${iso(4.04, 0.98, 0.03)[1]}`}
              fill="none"
              stroke="#8c9a94"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[1.85, 0.95].map((z) => (
              <rect
                key={z}
                x={iso(4.04, 0.6, z)[0] - 4}
                y={iso(4.04, 0.6, z)[1] - 2}
                width="8"
                height="4"
                rx="1"
                fill="#5f6d67"
              />
            ))}
          </g>

          {/* front-left wall (y = 3) */}
          <polygon points={poly([D, C, Cb, Db])} fill={`url(#${id('wallFront')})`} />
          {/* corner trim */}
          <line x1={C[0]} y1={C[1]} x2={Cb[0]} y2={Cb[1]} stroke="#8f8572" strokeWidth="3" opacity="0.7" />
          <line x1={D[0]} y1={D[1]} x2={Db[0]} y2={Db[1]} stroke="#9b907b" strokeWidth="2" opacity="0.55" />
          {/* siding lines */}
          {[0.7, 1.35, 2.0].map((z) => (
            <line
              key={z}
              x1={iso(0, 3, z)[0]}
              y1={iso(0, 3, z)[1]}
              x2={iso(4, 3, z)[0]}
              y2={iso(4, 3, z)[1]}
              stroke="#8f8572"
              strokeWidth="1"
              opacity="0.2"
            />
          ))}

          {/* foundation plinth */}
          <polygon
            points={poly([iso(0, 3, 0), iso(4, 3, 0), iso(4, 3, 0.15), iso(0, 3, 0.15)])}
            fill="#c9bda6"
          />
          <polygon
            points={poly([iso(4, 0, 0), iso(4, 3, 0), iso(4, 3, 0.15), iso(4, 0, 0.15)])}
            fill="#a89d87"
          />

          {/* stone step */}
          <polygon
            points={poly([
              iso(0.6, 3.3, 0.14),
              iso(1.78, 3.3, 0.14),
              iso(1.78, 3.52, 0.14),
              iso(0.6, 3.52, 0.14),
            ])}
            fill="#a89d87"
          />
          <polygon
            points={poly([
              iso(0.6, 3.52, 0),
              iso(1.78, 3.52, 0),
              iso(1.78, 3.52, 0.14),
              iso(0.6, 3.52, 0.14),
            ])}
            fill="#8f8572"
          />

          {/* door */}
          <polygon
            points={poly([
              [door[0][0] - 5, door[0][1] + 4],
              [door[1][0] + 5, door[1][1] + 4],
              [door[2][0] + 5, door[2][1]],
              [door[3][0] - 5, door[3][1]],
            ])}
            fill="#efefe6"
          />
          <polygon points={poly(door)} fill="#1d4a52" />
          <polygon points={poly(door)} fill="none" stroke="#0c2226" strokeWidth="2" />
          <polygon points={poly(doorGlow)} fill="#f2c230" opacity="0.55" />
          <polygon points={poly(doorGlow)} fill="#f8d97a" opacity="0.22" filter={`url(#${id('glow')})`} />
          <polygon
            points={poly([
              iso(0.82, 3, 0.32),
              iso(1.54, 3, 0.32),
              iso(1.54, 3, 1.52),
              iso(0.82, 3, 1.52),
            ])}
            fill="none"
            stroke="#3f6b6f"
            strokeWidth="1.6"
            opacity="0.8"
          />
          <line
            x1={iso(1.18, 3, 0)[0]}
            y1={iso(1.18, 3, 0)[1]}
            x2={iso(1.18, 3, 2.02)[0]}
            y2={iso(1.18, 3, 2.02)[1]}
            stroke="#0c2226"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <circle cx={iso(1.5, 3, 1.02)[0]} cy={iso(1.5, 3, 1.02)[1]} r="3.2" fill="#f2c230" />
          {/* house number */}
          <g transform={`translate(${iso(1.86, 3, 1.92)[0]}, ${iso(1.86, 3, 1.92)[1]}) rotate(-30)`}>
            <rect x="-10" y="-9" width="20" height="16" rx="3" fill="#efefe6" />
            <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#101617">
              23
            </text>
          </g>

          {/* window on the front wall */}
          <polygon
            points={poly([
              [windowMain[0][0] - 5, windowMain[0][1] + 4],
              [windowMain[1][0] + 5, windowMain[1][1] + 4],
              [windowMain[2][0] + 5, windowMain[2][1] - 5],
              [windowMain[3][0] - 5, windowMain[3][1] - 5],
            ])}
            fill="#efefe6"
          />
          <polygon points={poly(windowMain)} fill={`url(#${id('glass')})`} />
          <polygon
            points={poly(windowMain)}
            fill="none"
            stroke="#7a5a14"
            strokeWidth="2"
            opacity="0.55"
          />
          <line
            x1={iso(3.28, 3, 1.12)[0]}
            y1={iso(3.28, 3, 1.12)[1]}
            x2={iso(3.28, 3, 2.06)[0]}
            y2={iso(3.28, 3, 2.06)[1]}
            stroke="#7a5a14"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <line
            x1={iso(2.9, 3, 1.59)[0]}
            y1={iso(2.9, 3, 1.59)[1]}
            x2={iso(3.66, 3, 1.59)[0]}
            y2={iso(3.66, 3, 1.59)[1]}
            stroke="#7a5a14"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <polygon
            points={poly(windowMain)}
            fill="#f8d97a"
            opacity="0.18"
            filter={`url(#${id('glow')})`}
          />

          {/* conduit from the box to the ground */}
          <path
            d={`M${iso(2.35, 3.02, 0.98)[0]} ${iso(2.35, 3.02, 0.98)[1]} L${iso(2.35, 3.02, 0.35)[0]} ${
              iso(2.35, 3.02, 0.35)[1]
            } L${iso(2.1, 3.05, 0.18)[0]} ${iso(2.1, 3.05, 0.18)[1]}`}
            fill="none"
            stroke="#8c9a94"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* external electrical box */}
          <polygon points={poly(box)} fill="#0a1415" opacity="0.35" transform="translate(4,5)" />
          <polygon points={poly(box)} fill={`url(#${id('metal')})`} />
          <polygon points={poly(box)} fill="none" stroke="#5e6b65" strokeWidth="1.6" />
          <polygon
            points={poly([
              iso(2.02, 3, 1.22),
              iso(2.68, 3, 1.22),
              iso(2.68, 3, 1.36),
              iso(2.02, 3, 1.36),
            ])}
            fill="#a7b0a8"
            opacity="0.55"
          />
          {/* meter window */}
          <polygon
            points={poly([
              iso(2.11, 3, 1.48),
              iso(2.59, 3, 1.48),
              iso(2.59, 3, 1.76),
              iso(2.11, 3, 1.76),
            ])}
            fill="#0b1a1b"
          />
          <polygon
            points={poly([
              iso(2.11, 3, 1.48),
              iso(2.59, 3, 1.48),
              iso(2.59, 3, 1.76),
              iso(2.11, 3, 1.76),
            ])}
            fill="#f2c230"
            opacity="0.24"
          />
          <circle cx={iso(2.3, 3, 1.62)[0]} cy={iso(2.3, 3, 1.62)[1]} r="5" fill="#f8d97a" opacity="0.5" />
          <line
            x1={iso(2.3, 3, 1.62)[0]}
            y1={iso(2.3, 3, 1.62)[1]}
            x2={iso(2.42, 3, 1.7)[0]}
            y2={iso(2.42, 3, 1.7)[1]}
            stroke="#f8f2df"
            strokeWidth="1.2"
            opacity="0.8"
          />
          {/* breakers */}
          {[0.0, 0.17, 0.34].map((offset) => (
            <rect
              key={offset}
              x={iso(2.12 + offset, 3, 1.28)[0]}
              y={iso(2.12 + offset, 3, 1.28)[1]}
              width="11"
              height="6"
              rx="1.4"
              fill="#2a3634"
              transform={`rotate(-30 ${iso(2.12 + offset, 3, 1.28)[0]} ${iso(2.12 + offset, 3, 1.28)[1]})`}
            />
          ))}
          {/* warning sticker */}
          <g transform={`translate(${iso(2.58, 3, 1.1)[0]}, ${iso(2.58, 3, 1.1)[1]}) rotate(-30)`}>
            <circle r="4.5" fill="#f2c230" />
            <path d="M0.8 -2.4 L-1.8 0.6 L-0.2 0.6 L-0.8 2.8 L1.9 -0.3 L0.3 -0.3 Z" fill="#101617" />
          </g>

          {/* hip roof */}
          <polygon points={poly([eaveS1, eaveS2, ridge2, ridge1])} fill={`url(#${id('roof')})`} />
          <polygon points={poly([eaveN2, eaveS2, ridge2])} fill={`url(#${id('roofEast')})`} />

          {/* tile rows — south slope */}
          <g clipPath={`url(#${id('roofClip')})`} opacity="0.26">
            {[0.14, 0.28, 0.42, 0.56, 0.7, 0.84].map((t) => {
              const x1 = ridge1[0] + (eaveS1[0] - ridge1[0]) * t
              const y1 = ridge1[1] + (eaveS1[1] - ridge1[1]) * t
              const x2 = ridge2[0] + (eaveS2[0] - ridge2[0]) * t
              const y2 = ridge2[1] + (eaveS2[1] - ridge2[1]) * t
              return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#172a2f" strokeWidth="1.5" />
            })}
          </g>

          {/* tile rows — east hip */}
          <g opacity="0.2">
            {[0.32, 0.52, 0.72].map((t) => {
              const ax = ridge2[0] + (eaveN2[0] - ridge2[0]) * t
              const ay = ridge2[1] + (eaveN2[1] - ridge2[1]) * t
              const bx = ridge2[0] + (eaveS2[0] - ridge2[0]) * t
              const by = ridge2[1] + (eaveS2[1] - ridge2[1]) * t
              return <line key={t} x1={ax} y1={ay} x2={bx} y2={by} stroke="#172a2f" strokeWidth="1.3" />
            })}
          </g>

          {/* fascia, hips and ridge */}
          <polyline points={poly([eaveS1, eaveS2])} fill="none" stroke="#172a2f" strokeWidth="7" strokeLinejoin="round" />
          <polyline points={poly([eaveN2, eaveS2])} fill="none" stroke="#14262a" strokeWidth="7" strokeLinejoin="round" />
          <polyline points={poly([eaveS1, ridge1])} fill="none" stroke="#4a6a70" strokeWidth="5" strokeLinecap="round" />
          <polyline points={poly([ridge2, eaveN2])} fill="none" stroke="#1a2c31" strokeWidth="4" strokeLinecap="round" />
          <polyline points={poly([ridge2, eaveS2])} fill="none" stroke="#4a6a70" strokeWidth="5" strokeLinecap="round" />
          <polyline points={poly([ridge1, ridge2])} fill="none" stroke="#7f989b" strokeWidth="6" strokeLinecap="round" />
          <polyline
            points={poly([ridge1, ridge2])}
            fill="none"
            stroke="#a9bfc1"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* camera beam */}
          {!signals.obstructed && (
            <g>
              <polygon
                points={poly([
                  [cameraPos[0] - 4, cameraPos[1] + 12],
                  [222, 566],
                  [452, 668],
                  [470, 512],
                ])}
                fill={`url(#${id(guardian ? 'beam' : 'beamBasic')})`}
              />
              <polyline
                points={poly([
                  [cameraPos[0] - 4, cameraPos[1] + 12],
                  [222, 566],
                ])}
                fill="none"
                stroke={guardian ? '#f2c230' : '#f2c230'}
                strokeWidth="1.2"
                strokeDasharray="5 7"
                opacity="0.4"
              />
              <polyline
                points={poly([
                  [cameraPos[0] - 4, cameraPos[1] + 12],
                  [470, 512],
                ])}
                fill="none"
                stroke={guardian ? '#f2c230' : '#f2c230'}
                strokeWidth="1.2"
                strokeDasharray="5 7"
                opacity="0.28"
              />
            </g>
          )}

          {/* detection zone around the installation */}
          {guardian && !signals.obstructed && (
            <polygon
              points={poly([
                [398, 352],
                [488, 396],
                [488, 502],
                [398, 458],
              ])}
              fill={planned ? 'rgba(242, 194, 48, 0.06)' : 'rgba(242, 194, 48, 0.04)'}
              stroke={planned ? '#f2c230' : '#f2c230'}
              strokeWidth="1.6"
              strokeDasharray="7 7"
              opacity="0.6"
              className="dash-flow"
            />
          )}

          {/* vibration sensor on the box */}
          {guardian && (
            <g transform={`translate(${sensorPos[0]}, ${sensorPos[1]})`}>
              <rect x="-8" y="-7" width="16" height="13" rx="4" fill="#0e2224" stroke="#f2c230" strokeWidth="1.3" />
              <circle cx="0" cy="-0.5" r="3.4" fill={signals.vibration ? '#6cc49b' : '#f2c230'} opacity="0.9" />
              <line x1="5" y1="-7" x2="9" y2="-17" stroke="#f2c230" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="9" cy="-18" r="2.4" fill="#6cc49b" />
            </g>
          )}

          {/* vibration waves */}
          {signals.vibration && (
            <g>
              {[46, 70, 94].map((r, i) => (
                <circle
                  key={r}
                  cx={boxCenter[0]}
                  cy={boxCenter[1]}
                  r={r}
                  fill="none"
                  stroke="#6cc49b"
                  strokeWidth="2"
                  className={`wave-pulse ${i === 1 ? 'wave-pulse--2' : i === 2 ? 'wave-pulse--3' : ''}`}
                />
              ))}
            </g>
          )}

          {/* camera */}
          <g transform={`translate(${cameraPos[0]}, ${cameraPos[1]}) scale(1.4)`}>
            <line x1="12" y1="4" x2="22" y2="11" stroke="#7d8a84" strokeWidth="4" strokeLinecap="round" />
            <g transform="rotate(18)">
              {guardian && <circle cx="-15" cy="0" r="12" fill="#f2c230" opacity="0.16" filter={`url(#${id('glow')})`} />}
              <rect x="-24" y="-9" width="34" height="18" rx="6" fill="#efefe6" />
              <rect x="-24" y="-9" width="34" height="18" rx="6" fill="none" stroke="#a8b0a8" strokeWidth="1.2" />
              <path d="M10 -6 L18 0 L10 6 Z" fill="#b9c0b5" />
              <circle cx="-15" cy="0" r="7" fill="#0b1112" />
              <circle cx="-16.5" cy="-1.8" r="2.4" fill="#f8d97a" opacity="0.85" />
              <circle cx="-13" cy="2" r="1.2" fill="#6cc49b" opacity="0.8" />
            </g>
            <circle
              cx="11"
              cy="12"
              r="3"
              fill={guardian ? '#6cc49b' : '#d94a35'}
              className="blink"
            />
          </g>

          {/* buzzer / siren under the eave */}
          <g transform={`translate(${buzzerPos[0]}, ${buzzerPos[1]})`}>
            <rect x="-7" y="-8" width="14" height="5" rx="2" fill="#2a3634" />
            <path d="M-10 8 Q-10 -6 0 -6 Q10 -6 10 8 Z" fill={signals.alarm ? '#d94a35' : '#6e3a33'} />
            <path d="M-10 8 Q-10 -6 0 -6 Q10 -6 10 8 Z" fill="none" stroke="#2a1714" strokeWidth="1" />
            <rect x="-11" y="8" width="22" height="4" rx="2" fill="#2a3634" />
            {signals.alarm && (
              <g>
                <circle r="24" fill="none" stroke="#d94a35" strokeWidth="2" className="alarm-ring" />
                <circle r="24" fill="none" stroke="#d94a35" strokeWidth="1.4" className="alarm-ring" style={{ animationDelay: '0.4s' }} />
              </g>
            )}
          </g>

          {/* focus ring */}
          {focus && (
            <g>
              <circle
                cx={focus.x}
                cy={focus.y}
                r={focus.r}
                fill="none"
                stroke={tone}
                strokeWidth="1.6"
                strokeDasharray="3 6"
                opacity="0.8"
                
              />
              <circle
                cx={focus.x}
                cy={focus.y}
                r={focus.r - 8}
                fill="none"
                stroke={tone}
                strokeWidth="1.2"
                opacity="0.25"
                className="ring-pulse ring-pulse--slow"
              />
            </g>
          )}

          {/* ground ring under the character */}
          {groundRing && !signals.obstructed && (
            <polygon
              points={poly([
                [cx, cy - 24],
                [cx + 54, cy],
                [cx, cy + 24],
                [cx - 54, cy],
              ])}
              fill={signals.hand ? 'rgba(108, 196, 155, 0.10)' : 'rgba(242, 194, 48, 0.05)'}
              stroke={signals.hand ? '#6cc49b' : '#f2c230'}
              strokeWidth="1.2"
              strokeDasharray="4 8"
              opacity="0.55"
            />
          )}

          {/* character */}
          <g
            className={`char-move ${characterSnap ? 'char-move--snap' : ''}`}
            style={
              {
                transform: `translate(${cx}px, ${cy}px)`,
                '--char-duration': `${characterDuration}ms`,
              } as CSSProperties
            }
          >
            <Character pose={pose} walking={walking} />
          </g>

          {/* hand detection frame */}
          {signals.hand && !signals.obstructed && (
            <g>
              <rect
                x={cx - 52}
                y={cy - 190}
                width="112"
                height="150"
                rx="6"
                fill="none"
                stroke="#6cc49b"
                strokeWidth="1.5"
                strokeDasharray="10 6"
                opacity="0.75"
              />
              {[
                [cx - 52, cy - 190, 1, 1],
                [cx + 60, cy - 190, -1, 1],
                [cx - 52, cy - 40, 1, -1],
                [cx + 60, cy - 40, -1, -1],
              ].map(([x, y, sx, sy], i) => (
                <path
                  key={i}
                  d={`M${x} ${y + 16 * sy} L${x} ${y} L${x + 16 * sx} ${y}`}
                  fill="none"
                  stroke="#6cc49b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )}

          {/* tamper (planned) */}
          {signals.tamper && (
            <g>
              <circle
                cx={boxCenter[0]}
                cy={boxCenter[1]}
                r="66"
                fill="none"
                stroke="#f2c230"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity="0.9"
              />
              <circle
                cx={boxCenter[0]}
                cy={boxCenter[1]}
                r="80"
                fill="none"
                stroke="#f2c230"
                strokeWidth="1"
                opacity="0.3"
                className="ring-pulse"
              />
            </g>
          )}

          {/* alarm glow */}
          {signals.alarm && (
            <g>
              <rect width="1000" height="720" fill={`url(#${id('alarmGlow')})`} className="alarm-flash" />
              <g transform={`translate(${buzzerPos[0]}, ${buzzerPos[1]})`}>
                <circle r="14" fill="#d94a35" filter={`url(#${id('glowStrong')})`} opacity="0.65" />
              </g>
            </g>
          )}

          {/* obstruction overlay */}
          {signals.obstructed && (
            <g>
              <rect
                width="1000"
                height="720"
                fill={planned ? '#0d1a1b' : '#081416'}
                opacity={planned ? '0.6' : '0.72'}
              />
              <rect
                width="1000"
                height="720"
                fill="none"
                stroke={planned ? '#f2c230' : '#d94a35'}
                strokeWidth="2"
                opacity="0.28"
              />
              {[196, 356, 516].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke={planned ? '#f2c230' : '#d94a35'}
                  strokeWidth="20"
                  opacity="0.03"
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* scene HUD */}
      {!compact && (
        <div className="scene-hud">
          <span className="hud-pill">
            <span className={lens === 'camera' ? 'rec-dot' : 'live-dot'} />
            <strong>{lens === 'camera' ? 'REC' : signals.alarm ? 'ALERTA' : 'MONITORANDO'}</strong>
          </span>
          <span className="hud-pill">22:41</span>
        </div>
      )}

      <div />
      <div className="scene-vignette" />

      {/* contextual tags */}
      {!compact && !signals.obstructed && (
        <>
          {guardian && idleDevices && (highlight === 'camera' || highlight === 'house') && (
            <span className="scene-tag scene-tag--cyan" style={tagStyle(cameraPos, -36, -34)}>
              <CameraIcon size={12} /> CAM 01 / visão
            </span>
          )}
          {guardian && idleDevices && (highlight === 'sensor' || highlight === 'box' || highlight === 'house') && (
            <span className="scene-tag scene-tag--mint" style={tagStyle(boxCenter, 30, 26)}>
              <Radio size={12} /> SV 02 / vibração
            </span>
          )}
          {!guardian && highlight === 'camera' && (
            <span className="scene-tag scene-tag--gold" style={tagStyle(cameraPos, -34, -34)}>
              <CameraIcon size={12} /> CAM 01 / apenas grava
            </span>
          )}
          {!guardian && highlight === 'box' && (
            <span className="scene-tag scene-tag--gold" style={tagStyle(boxCenter, 26, 22)}>
              <Zap size={12} /> Instalação elétrica
            </span>
          )}
          {signals.hand && !signals.alarm && (
            <span className="scene-tag scene-tag--mint" style={{ left: '29%', top: '58%' }}>
              <Hand size={12} /> Mão detectada
            </span>
          )}
          {signals.vibration && !signals.alarm && (
            <span className="scene-tag scene-tag--mint" style={{ left: '50%', top: '55%' }}>
              <Radio size={12} /> Vibração
            </span>
          )}
          {signals.alarm && (
            <span className="scene-tag scene-tag--alert" style={tagStyle(buzzerPos, -84, -30)}>
              <Siren size={12} /> Alarme local
            </span>
          )}
        </>
      )}

      {planned && signals.tamper && (
        <span className="scene-tag scene-tag--gold" style={{ left: 14, top: 54 }}>
          <ShieldAlert size={12} /> Adulteração / planejado
        </span>
      )}

      {signals.obstructed && (
        <div className={`obstruction-label ${planned ? 'is-planned' : ''}`}>
          <span className="ob-icon">
            <CameraOff size={20} />
          </span>
          <span className="ob-title">{planned ? 'Obstrução detectada' : 'Visão obstruída'}</span>
          <span className="ob-sub">
            {planned
              ? 'Alerta planejado de obstrução — critérios de confirmação ainda em desenvolvimento.'
              : 'A câmera não mostra mais a área. Nenhum alerta automático configurado neste cenário.'}
          </span>
          {planned && <span className="chip chip-planned">Planejado</span>}
        </div>
      )}

      {(signals.phone || signals.phoneAlarm) && (
        <PhoneNotification variant={signals.phoneAlarm ? 'alarm' : 'notification'} />
      )}
    </div>
  )
}
