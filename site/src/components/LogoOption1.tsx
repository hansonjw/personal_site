interface LogoProps {
  size?: number
}

export default function LogoOption1({ size = 48 }: LogoProps) {
  const cx = 50
  const cy = 50
  const r = 40
  const yellowR = 80  // 2x the circle radius

  // Intersection points of a lower-left to upper-right diagonal with the circle
  // Upper-right point (~1 o'clock): angle = -45°
  const p1x = cx + r * Math.cos((-45 * Math.PI) / 180)  // 78.28
  const p1y = cy + r * Math.sin((-45 * Math.PI) / 180)  // 21.72

  // Lower-left point (~7 o'clock): angle = 135°
  const p2x = cx + r * Math.cos((135 * Math.PI) / 180)  // 21.72
  const p2y = cy + r * Math.sin((135 * Math.PI) / 180)  // 78.28

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle fill — dark warm gray */}
      <circle cx={cx} cy={cy} r={r} fill="#1a1714" />

      {/* Crescent fill — white region between circle border and yellow arc */}
      <path
        d={`M ${p1x} ${p1y} A ${r} ${r} 0 0 1 ${p2x} ${p2y} A ${yellowR} ${yellowR} 0 0 0 ${p1x} ${p1y} Z`}
        fill="white"
      />

      {/* Yellow arc — drawn first so white and turquoise appear on top at intersections */}
      <path
        d={`M ${p1x} ${p1y} A ${yellowR} ${yellowR} 0 0 1 ${p2x} ${p2y}`}
        stroke="#e8d44d"
        strokeWidth="1.5"
        fill="none"
      />

      {/* White arc — lower-right half of circle (clockwise from P1 through bottom to P2) */}
      <path
        d={`M ${p1x} ${p1y} A ${r} ${r} 0 0 1 ${p2x} ${p2y}`}
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Turquoise arc — upper-left half of circle (counter-clockwise from P1 through top to P2) */}
      <path
        d={`M ${p1x} ${p1y} A ${r} ${r} 0 0 0 ${p2x} ${p2y}`}
        stroke="#5fbcd3"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
