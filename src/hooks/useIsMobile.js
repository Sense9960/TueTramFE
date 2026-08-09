import { Grid } from 'antd'

const { useBreakpoint } = Grid

// Wraps antd's responsive breakpoint hook so the whole app agrees on a
// single "mobile" cutoff (matches the dedicated mobile mockup).
// antd's `md` breakpoint is 768px, matching MOBILE_BREAKPOINT in constants/theme.js.
export default function useIsMobile() {
  const screens = useBreakpoint()
  return !screens.md
}
