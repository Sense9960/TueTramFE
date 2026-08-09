import { theme as antdBaseTheme } from 'antd'

// Design tokens extracted từ file mockup gốc "Tue Tram - Standalone.html"
// (đọc trực tiếp CSS variables --color-*/--space-*/--radius-* trong file đó
// ngày 2026-08-05 — KHÔNG suy đoán). Feed vào AntD ConfigProvider để mọi
// component (button, card, input, menu...) ăn theo cùng bảng màu thay vì
// mỗi chỗ tự set màu riêng.
//
// QUAN TRỌNG: trang KHÁCH HÀNG (mọi route trong MainLayout — Home, Products,
// Cart, Blog, Checkout...) là DARK THEME, nền mặc định = `textDark2`
// (= --color-neutral-900, #2e2b25), chữ mặc định = `bgCreamAlt`
// (= --color-neutral-100, #f9f4ed) — không phải nền sáng như bản cũ trước
// đây. Khu vực /admin/* (AdminLayout, ngoài MainLayout) KHÔNG đổi, vẫn giữ
// theme sáng gốc vì mockup này chỉ vẽ trang khách hàng, không có màn Admin.
// Xem `antdTheme` (sáng, root) vs `storefrontTheme` (tối, chỉ bọc trong
// MainLayout.jsx) bên dưới, và `Header.jsx`/`Home/index.jsx` (dựng lại đúng
// theo mockup, có comment trích dẫn màu gốc ở từng chỗ).

export const colors = {
  // --color-bg / --color-surface / --color-text (nền + chữ mặc định của
  // TOÀN BỘ trang trong mockup, không phải riêng 1 section)
  bgCream: '#faf9f5', // (không có trong mockup — giữ lại vì vài chỗ cũ đang dùng làm nền phụ sáng)
  bgCreamAlt: '#f9f4ed', // --color-neutral-100 — chữ chính trên nền tối
  bgWarm: '#fff2eb', // --color-accent-100
  textDark: '#201e1d', // --color-text (chữ trên nền sáng, vd trong card/surface sáng)
  textDark2: '#2e2b25', // --color-neutral-900 — NỀN CHÍNH của toàn site (header, body, footer)
  brandOrange: '#c67139', // --color-accent
  brandOrangeDark: '#8c491a', // --color-accent-700
  brandOrangeDeep: '#643312', // --color-accent-800
  brandOrangeMid: '#b2622d', // --color-accent-600
  brandOrangeLight: '#d67f48', // --color-accent-500
  accentPeach: '#f6a06b', // --color-accent-400
  accentPeachLight: '#ffc6a5', // --color-accent-300 — màu logo/tag/hover chữ trên nền tối
  accentPeachPale: '#ffe1d0', // --color-accent-200
  green: '#56633f', // --color-accent-2-700
  greenLight: '#728157', // --color-accent-2-600
  greenPale: '#aebf92', // --color-accent-2-400
  greenMist: '#e1eecc', // --color-accent-2-200
  neutralTan: '#c0b6a5', // --color-neutral-400 — đoạn văn/paragraph trên nền tối
  neutralTanLight: '#dcd3c4', // --color-neutral-300 — link nav mặc định trên nền tối
  neutralTanPale: '#ebddc5', // --color-surface — pill/badge nền sáng nổi trên nền tối
  // Bổ sung ngày 2026-08-05 — phần neutral/accent-2 còn thiếu so với mockup:
  neutral800: '#474238', // --color-neutral-800 — border header, nền badge tag, nền card feature
  neutral700: '#645c50', // --color-neutral-700 — hover nền tối
  neutral600: '#82796a', // --color-neutral-600 — border nút outline trên nền tối
  neutral500: '#a19786', // --color-neutral-500 — chữ phụ rất mờ (vd subtitle logo)
  accent2_300: '#ccdbb2', // --color-accent-2-300 — icon feature card
  accent2_800: '#3d472b', // --color-accent-2-800 — nền vòng tròn icon feature card
  // Bổ sung ngày 2026-08-06 (carousel sản phẩm + khu vực Admin):
  neutral200: '#eee7db', // --color-neutral-200
  accent2_100: '#f0fae1', // --color-accent-2-100 — nền tag danh mục trên thẻ sản phẩm
  accentPeachSoft: '#ffe1d0', // --color-accent-200 (alias rõ nghĩa của accentPeachPale)
  accent900: '#402310', // --color-accent-900
  accent2_700: '#56633f', // --color-accent-2-700
}

// Baloo 2 (heading) + Be Vietnam Pro (body): font gốc trong thiết kế là
// Caprasimo/Figtree nhưng 2 font đó KHÔNG có bộ subset "vietnamese" trên
// Google Fonts (chỉ latin + latin-ext) — chữ có dấu (ệ, ầ, ộ,...) sẽ vỡ/lệch
// font vì trình duyệt phải fallback sang font hệ thống cho riêng các ký tự
// đó. Đã đổi sang cặp font có subset vietnamese đầy đủ, đúng theo cách file
// mockup gốc "Tue Tram - Standalone.html" tự sửa (giữ nguyên vai trò
// display/body, chỉ đổi font thật). Nhớ đổi link Google Fonts tương ứng
// trong index.html nếu đổi lại font ở đây.
export const fontFamily = {
  display: "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif",
  body: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  // --font-heading-weight trong mockup (bản đã sửa lỗi dấu) = 600, áp dụng
  // cho h1-h6 và mọi chỗ dùng var(--font-heading) (nút bấm, logo,...).
  headingWeight: 600,
}

// Passed to root <ConfigProvider theme={antdTheme}> trong main.jsx — theme
// SÁNG mặc định, dùng cho khu vực /admin/* (AdminLayout tự hardcode nền
// trắng ở vài chỗ — Header/Content/Sider theme="light" — nên phải giữ theme
// gốc sáng ở đây, KHÔNG bật darkAlgorithm, nếu không chữ sẽ bị chữ sáng trên
// nền trắng = mất chữ trong toàn bộ Admin). Trang khách hàng (MainLayout) tự
// bọc thêm 1 lớp <ConfigProvider theme={storefrontTheme}> riêng bên dưới để
// đổi sang dark theme đúng mockup mà không ảnh hưởng Admin — xem
// MainLayout.jsx và storefrontTheme bên dưới.
export const antdTheme = {
  token: {
    colorPrimary: colors.brandOrange,
    colorLink: colors.brandOrangeDark,
    colorText: colors.textDark2,
    colorBgLayout: colors.bgCream,
    colorBgContainer: '#ffffff',
    fontFamily: fontFamily.body,
    borderRadius: 10,
  },
  components: {
    Button: {
      colorPrimary: colors.brandOrange,
      algorithm: true,
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: colors.bgCream,
      footerBg: colors.textDark2,
    },
    Menu: {
      itemSelectedColor: colors.brandOrangeDark,
    },
  },
}

// Theme TỐI riêng cho trang khách hàng (MainLayout: Header/Home/Products/
// Cart/Blog/Checkout...) — khớp đúng file mockup gốc "Tue Tram - Standalone.html"
// (nền toàn site = --color-neutral-900, xem colors.textDark2 ở trên). Dùng
// `theme.darkAlgorithm` của antd để mọi component antd trong khu vực này
// (Modal của AuthModal, Drawer của Header, Input, Select, Table...) tự đổi
// sang biến thể tối hợp lý thay vì phải tự tay chỉnh từng token.
export const storefrontTheme = {
  algorithm: antdBaseTheme.darkAlgorithm,
  token: {
    colorPrimary: colors.brandOrange,
    colorLink: colors.accentPeachLight,
    colorText: colors.bgCreamAlt,
    colorBgLayout: colors.textDark2,
    colorBgContainer: colors.neutral800,
    colorBorder: colors.neutral800,
    fontFamily: fontFamily.body,
    // --radius-md của mockup = 16px (bản cũ để 10px nên các ô/nút trông
    // vuông và cứng hơn thiết kế). Đổi ngày 2026-08-06 theo yêu cầu
    // "làm mấy cái ô đó mềm mại xíu".
    borderRadius: 16,
  },
  components: {
    Button: {
      colorPrimary: colors.brandOrange,
      algorithm: true,
      // Nút bo tròn hẳn (dạng viên thuốc) đúng như ảnh chủ dự án gửi kèm
      // yêu cầu "mềm mại xíu" — mềm hơn mức --radius-md của mockup.
      borderRadius: 999,
      borderRadiusLG: 999,
      borderRadiusSM: 999,
    },
    Layout: {
      headerBg: colors.textDark2,
      bodyBg: colors.textDark2,
      footerBg: colors.textDark2,
    },
    Menu: {
      itemSelectedColor: colors.accentPeachLight,
    },
  },
}

// Mobile breakpoint mirrors the dedicated "Tue Tram Mobile" mockup: below
// this width the app switches header/nav to the compact mobile layout
// (hamburger-free header + fixed bottom tab bar) instead of the desktop nav.
export const MOBILE_BREAKPOINT = 768
