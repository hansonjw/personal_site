interface LogoProps {
  size?: number
}

export default function LogoOption2({ size = 48 }: LogoProps) {
  const cx = 50
  const cy = 50
  const r = 40
  const blackR = r + 4    // black halo — concentric, slightly larger than main
  const eclipseOffset = 9  // how far each eclipse circle is offset from center

  // Intersection points of a lower-left to upper-right diagonal with the circle
  // Upper-right point (~1 o'clock): angle = -45°
  const p1x = cx + r * Math.cos((-45 * Math.PI) / 180)
  const p1y = cy + r * Math.sin((-45 * Math.PI) / 180)

  // Lower-left point (~7 o'clock): angle = 135°
  const p2x = cx + r * Math.cos((135 * Math.PI) / 180)
  const p2y = cy + r * Math.sin((135 * Math.PI) / 180)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue eclipse — 270° (top) */}
      <circle
        cx={cx + eclipseOffset * Math.cos((270 * Math.PI) / 180)}
        cy={cy + eclipseOffset * Math.sin((270 * Math.PI) / 180)}
        r={r} fill="#5fbcd3"
      />

      {/* Yellow eclipse — 30° (lower-right) */}
      <circle
        cx={cx + eclipseOffset * Math.cos((30 * Math.PI) / 180)}
        cy={cy + eclipseOffset * Math.sin((30 * Math.PI) / 180)}
        r={r} fill="#e8d44d"
      />

      {/* White eclipse — 150° (lower-left) */}
      <circle
        cx={cx + eclipseOffset * Math.cos((150 * Math.PI) / 180)}
        cy={cy + eclipseOffset * Math.sin((150 * Math.PI) / 180)}
        r={r} fill="white"
      />

      {/* Black halo — concentric, slightly larger, covers overlapping eclipse edges */}
      <circle cx={cx} cy={cy} r={blackR} fill="#000000" />

      {/* Main circle fill */}
      <circle cx={cx} cy={cy} r={r} fill="#1a1714" />

      {/* Crescent fill — lighter gray section */}
      <path
        d={`M ${p1x} ${p1y} A ${r} ${r} 0 0 1 ${p2x} ${p2y} A ${r * 2} ${r * 2} 0 0 0 ${p1x} ${p1y} Z`}
        fill="#2e2b28"
      />

      {/* Black border — drawn last, cleans up edges */}
      <circle cx={cx} cy={cy} r={r} stroke="black" strokeWidth="2" fill="none" />

    </svg>
  )
}
