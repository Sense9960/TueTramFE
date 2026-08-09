import { colors } from '../../constants/theme'

// 3 mục tin cậy dưới hero — dựng lại 1:1 theo mockup gốc
// "Tue Tram - Standalone.html" (icon SVG path + màu đọc trực tiếp từ file
// ngày 2026-08-05, không suy đoán). Icon stroke = --color-accent-2-400
// (colors.greenPale), chữ = --color-neutral-300 (colors.neutralTanLight) —
// nằm trực tiếp trên nền tối của hero, KHÔNG phải dạng thẻ nền như bản cũ.
const BADGES = [
  {
    title: '100% trầm tự nhiên',
    paths: [
      'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
      'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
    ],
  },
  {
    title: 'Đốt sạch, không hoá chất',
    paths: [
      'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
    ],
  },
  {
    title: 'Gắn với thiện nguyện',
    paths: [
      'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    ],
  },
]

export default function TrustBadges() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 17, color: colors.neutralTanLight, fontSize: 13 }}>
      {BADGES.map((b) => (
        <span key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.greenPale}
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {b.paths.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
          {b.title}
        </span>
      ))}
    </div>
  )
}
