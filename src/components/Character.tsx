interface CharacterProps {
  pose?: 'idle' | 'walk' | 'reach'
  walking?: boolean
  opacity?: number
}

const skin = '#e6b58d'
const skinShade = '#cf9a72'
const jacket = '#f2c230'
const jacketShade = '#d6a81f'
const pants = '#2b3c56'
const pantsShade = '#22314a'
const hair = '#242c3a'
const shoe = '#17202e'

/**
 * Neutral, friendly 2.5D character. Feet sit on (0, 0); the whole figure is
 * roughly 150 px tall, matching the isometric scale of the house.
 */
export function Character({ pose = 'idle', walking = false, opacity = 1 }: CharacterProps) {
  const reach = pose === 'reach'

  return (
    <g opacity={opacity}>
      <ellipse cx="2" cy="3" rx="25" ry="6.5" fill="rgba(3, 9, 18, 0.45)" />

      <g className={walking ? 'char-walk' : undefined}>
        <g className="char-bob">
          {/* back leg */}
          <g className="char-leg-back">
            <rect x="-13" y="-54" width="11" height="50" rx="5.5" fill={pantsShade} />
            <rect x="-17" y="-9" width="19" height="9" rx="4.5" fill={shoe} />
          </g>

          {/* front leg */}
          <g className="char-leg-front">
            <rect x="4" y="-54" width="11" height="50" rx="5.5" fill={pants} />
            <rect x="2" y="-9" width="20" height="9" rx="4.5" fill="#1d2839" />
          </g>

          {/* back arm */}
          <g transform="rotate(6 17 -108)">
            <rect x="16" y="-110" width="10" height="40" rx="5" fill={jacketShade} />
            <circle cx="21" cy="-70" r="5.4" fill={skinShade} />
          </g>

          {/* torso */}
          <path
            d="M-19 -113 Q-23 -99 -20 -78 L-18 -50 Q0 -43 18 -50 L20 -78 Q23 -99 19 -113 Q0 -121 -19 -113 Z"
            fill={jacket}
          />
          <path d="M-19 -113 Q-23 -99 -20 -78 L-18 -50 Q-8 -46 0 -45 L0 -119 Q-10 -118 -19 -113 Z" fill={jacketShade} opacity="0.55" />
          <path d="M0 -118 L0 -45" stroke="#8a6a12" strokeWidth="1.4" opacity="0.6" />
          <path d="M-14 -66 L-4 -66 L-4 -58 L-14 -58 Z" fill="#a17a12" opacity="0.55" />
          <path d="M-13 -96 Q0 -88 13 -96" fill="none" stroke="#a17a12" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* collar */}
          <path d="M-14 -112 Q0 -104 14 -112 L12 -118 Q0 -111 -12 -118 Z" fill="#f8e2a1" />

          {/* front arm (reaches to the wall when needed) */}
          <g
            transform={reach ? 'rotate(-118 18 -108)' : 'rotate(-7 18 -108)'}
            style={{ transition: 'transform 700ms cubic-bezier(0.34, 1.3, 0.64, 1)' }}
          >
            <rect x="13" y="-111" width="10.5" height="41" rx="5.2" fill={jacket} />
            <rect x="13" y="-80" width="10.5" height="10" rx="5" fill={skin} />
            {reach && (
              <g>
                <circle cx="18" cy="-70" r="6" fill={skin} />
                <rect x="13.5" y="-74" width="3.4" height="8" rx="1.7" fill={skin} />
                <rect x="17.4" y="-75.5" width="3.4" height="9" rx="1.7" fill={skin} />
                <rect x="21.2" y="-74" width="3.2" height="8" rx="1.6" fill={skin} />
              </g>
            )}
            {!reach && <circle cx="18" cy="-71" r="5.4" fill={skin} />}
          </g>

          {/* neck */}
          <rect x="-4.5" y="-124" width="9" height="9" rx="3" fill={skinShade} />

          {/* head */}
          <g className={walking ? 'char-sway' : undefined}>
            <circle cx="0" cy="-137" r="16" fill={skin} />
            <path d="M-16 -138 Q-16 -156 0 -156 Q16 -156 16 -138 Q10 -148 0 -148 Q-10 -148 -16 -138 Z" fill={hair} />
            <path d="M-16.5 -138 Q-17 -150 -10 -154 L-8 -148 Q-13 -144 -13 -137 Z" fill={hair} />
            <path d="M-16 -145 Q-14 -158 0 -158 Q14 -158 16 -145 Q15 -149 8 -150 Q0 -152 -8 -150 Q-15 -149 -16 -145 Z" fill="#2f3f56" />
            <path d="M-16 -145 Q-12 -153 0 -153 Q12 -153 16 -145 L16 -141 Q0 -148 -16 -141 Z" fill="#f2c230" opacity="0.9" />
            <circle cx="6" cy="-138" r="1.6" fill="#2b3242" />
            <path d="M9 -132 Q12 -131 13 -133" fill="none" stroke="#b9855f" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  )
}
