/** Brand illustration: laptop with code, graduation cap and a growth chart (Education + Technology + Career Growth). */
export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 460"
      role="img"
      aria-labelledby="hero-illustration-title"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="hero-illustration-title">
        Illustration of a graduation cap resting on a laptop showing code, beside a rising career growth chart
      </title>
      <defs>
        <linearGradient id="hi-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9e8ff" />
          <stop offset="1" stopColor="#eef5ff" />
        </linearGradient>
        <linearGradient id="hi-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f2d6b" />
          <stop offset="1" stopColor="#1e7bf2" />
        </linearGradient>
        <linearGradient id="hi-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa033" />
          <stop offset="1" stopColor="#ea6c00" />
        </linearGradient>
        <filter id="hi-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0a1f4d" floodOpacity="0.16" />
        </filter>
      </defs>

      {/* Backdrop */}
      <circle cx="270" cy="235" r="200" fill="url(#hi-bg)" />
      <circle cx="430" cy="90" r="10" fill="#ff8a00" opacity="0.9" />
      <circle cx="70" cy="330" r="7" fill="#1e7bf2" opacity="0.6" />
      <circle cx="110" cy="90" r="5" fill="#0f2d6b" opacity="0.4" />

      {/* Laptop */}
      <g filter="url(#hi-shadow)">
        <rect x="120" y="160" width="290" height="185" rx="14" fill="#0a1f4d" />
        <rect x="132" y="172" width="266" height="161" rx="6" fill="#0f2d6b" />
        <path d="M92 345h346l-18 26a14 14 0 0 1-11.6 6H121.6a14 14 0 0 1-11.6-6Z" fill="#c9d6ea" />
        <rect x="235" y="345" width="60" height="7" rx="3.5" fill="#a9bad4" />
      </g>
      {/* Code lines */}
      <g fontFamily="ui-monospace, monospace" fontSize="15" fontWeight="700">
        <text x="150" y="203" fill="#ffa033">{"</>"}</text>
      </g>
      <g strokeLinecap="round" strokeWidth="7">
        <line x1="190" y1="198" x2="260" y2="198" stroke="#1e7bf2" />
        <line x1="150" y1="222" x2="200" y2="222" stroke="#6ea8ff" />
        <line x1="212" y1="222" x2="300" y2="222" stroke="#ffffff" opacity="0.55" />
        <line x1="170" y1="244" x2="240" y2="244" stroke="#ffa033" />
        <line x1="252" y1="244" x2="330" y2="244" stroke="#6ea8ff" />
        <line x1="170" y1="266" x2="220" y2="266" stroke="#ffffff" opacity="0.55" />
        <line x1="232" y1="266" x2="290" y2="266" stroke="#1e7bf2" />
        <line x1="150" y1="288" x2="210" y2="288" stroke="#6ea8ff" />
        <line x1="150" y1="310" x2="250" y2="310" stroke="#ffffff" opacity="0.35" />
      </g>

      {/* Graduation cap on the laptop */}
      <g filter="url(#hi-shadow)">
        <path d="M265 70 360 108 265 146 170 108Z" fill="url(#hi-blue)" />
        <path d="M212 125v26c0 12 24 22 53 22s53-10 53-22v-26l-53 21Z" fill="#0a1f4d" />
        <path d="M265 108 330 124v42" fill="none" stroke="#ff8a00" strokeWidth="4" strokeLinecap="round" />
        <circle cx="330" cy="170" r="7" fill="#ff8a00" />
      </g>

      {/* Growth card */}
      <g filter="url(#hi-shadow)">
        <rect x="360" y="215" width="140" height="120" rx="16" fill="#ffffff" />
        <rect x="380" y="290" width="16" height="28" rx="4" fill="#b5d2ff" />
        <rect x="404" y="274" width="16" height="44" rx="4" fill="#6ea8ff" />
        <rect x="428" y="256" width="16" height="62" rx="4" fill="#1e7bf2" />
        <rect x="452" y="236" width="16" height="82" rx="4" fill="url(#hi-orange)" />
        <path d="M380 270l30-18 24 8 36-30" fill="none" stroke="#0a1f4d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M462 228h10v10" fill="none" stroke="#0a1f4d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Learn / Build / Grow chips */}
      <g filter="url(#hi-shadow)" fontFamily="Poppins, Inter, sans-serif" fontSize="14" fontWeight="600">
        <rect x="24" y="178" width="96" height="38" rx="19" fill="#ffffff" />
        <circle cx="44" cy="197" r="6" fill="#1e7bf2" />
        <text x="58" y="202" fill="#0a1f4d">Learn</text>

        <rect x="36" y="240" width="96" height="38" rx="19" fill="#ffffff" />
        <circle cx="56" cy="259" r="6" fill="#0f2d6b" />
        <text x="70" y="264" fill="#0a1f4d">Build</text>

        <rect x="380" y="360" width="96" height="38" rx="19" fill="#ffffff" />
        <circle cx="400" cy="379" r="6" fill="#ff8a00" />
        <text x="414" y="384" fill="#0a1f4d">Grow</text>
      </g>
    </svg>
  );
}
