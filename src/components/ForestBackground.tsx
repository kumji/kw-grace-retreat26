// Decorative, non-interactive nature illustration behind the landing page content.
// Pure SVG (no external assets) so it stays crisp, tiny, and license-free.
export function ForestBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute -left-8 -top-8 h-32 w-32 opacity-90 sm:h-44 sm:w-44"
        viewBox="0 0 120 120"
        fill="none"
      >
        <g className="animate-leaf-sway" style={{ transformOrigin: '10px 10px' }}>
          <path
            d="M10 10c40 0 70 20 90 60-45 5-80-15-95-45-3-6 0-15 5-15z"
            fill="#86e6b3"
          />
          <path
            d="M10 10c30 10 50 30 65 55"
            stroke="#16965b"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".5"
          />
        </g>
      </svg>

      <svg
        className="absolute -right-6 -top-6 h-24 w-24 rotate-90 opacity-80 sm:h-32 sm:w-32"
        viewBox="0 0 120 120"
        fill="none"
      >
        <g className="animate-leaf-sway" style={{ transformOrigin: '10px 10px', animationDelay: '-1.4s' }}>
          <path
            d="M10 10c40 0 70 20 90 60-45 5-80-15-95-45-3-6 0-15 5-15z"
            fill="#71e2cd"
          />
        </g>
      </svg>

      <svg
        className="absolute inset-x-0 bottom-0 h-44 w-full sm:h-64"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <g opacity=".45" fill="#a9f0e0">
          <circle cx="120" cy="220" r="95" />
          <circle cx="330" cy="190" r="125" />
          <circle cx="620" cy="230" r="105" />
          <circle cx="900" cy="190" r="135" />
          <circle cx="1180" cy="225" r="100" />
          <circle cx="1400" cy="200" r="115" />
        </g>
        <g opacity=".75" fill="#86e6b3">
          <circle cx="60" cy="265" r="75" />
          <circle cx="250" cy="248" r="100" />
          <circle cx="480" cy="275" r="85" />
          <circle cx="720" cy="245" r="110" />
          <circle cx="980" cy="270" r="90" />
          <circle cx="1220" cy="250" r="105" />
          <circle cx="1420" cy="275" r="80" />
        </g>
        <g fill="#22b872">
          <circle cx="150" cy="305" r="58" />
          <circle cx="380" cy="298" r="74" />
          <circle cx="600" cy="310" r="62" />
          <circle cx="850" cy="296" r="78" />
          <circle cx="1080" cy="306" r="60" />
          <circle cx="1320" cy="298" r="70" />
        </g>
      </svg>
    </div>
  );
}
