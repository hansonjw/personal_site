interface LogoProps {
  size?: number
}

export default function LogoOption3({ size = 48 }: LogoProps) {
  const cx = 50
  const cy = 50
  const r = 40
  const eclipseOffset = 9

  const p1x = cx + r * Math.cos((-45 * Math.PI) / 180)
  const p1y = cy + r * Math.sin((-45 * Math.PI) / 180)
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
        r={r} fill="#1a3a5c"
      />

      {/* Yellow eclipse — 30° (lower-right) */}
      <circle
        cx={cx + eclipseOffset * Math.cos((30 * Math.PI) / 180)}
        cy={cy + eclipseOffset * Math.sin((30 * Math.PI) / 180)}
        r={r} fill="#ffff00"
      />

      {/* Orange eclipse — 150° (lower-left) */}
      <circle
        cx={cx + eclipseOffset * Math.cos((150 * Math.PI) / 180)}
        cy={cy + eclipseOffset * Math.sin((150 * Math.PI) / 180)}
        r={r} fill="#3d1f1f"
      />

      {/* Main circle fill — black */}
      <circle cx={cx} cy={cy} r={r} fill="black" />

      {/* Crescent fill — lighter gray */}
      <path
        d={`M ${p1x} ${p1y} A ${r} ${r} 0 0 1 ${p2x} ${p2y} A ${r * 2} ${r * 2} 0 0 0 ${p1x} ${p1y} Z`}
        fill="#1a1520"
      />


      {/* Black border — drawn last */}
      <circle cx={cx} cy={cy} r={r} stroke="black" strokeWidth="3" fill="none" />

    </svg>
  )
}
