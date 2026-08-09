import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  css: {
    // Không sinh sourcemap CSS ở bản dev nữa (2026-08-07) — cho đồng bộ với
    // bản build; dev vẫn debug được bình thường qua React DevTools.
    devSourcemap: false,
  },
  esbuild: {
    // Bỏ mọi console.* và debugger khi build production: tránh lộ log nội bộ
    // (URL API, dữ liệu đơn hàng...) trong tab Console của khách. Bản dev
    // KHÔNG bị ảnh hưởng — `npm run dev` vẫn log bình thường.
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    outDir: 'dist',
    // TẮT SOURCEMAP (yêu cầu chủ dự án 2026-08-07): không sinh file .js.map,
    // nên khi người khác mở F12 > Sources chỉ thấy bundle đã nén/rối tên biến,
    // KHÔNG dựng ngược lại được cây thư mục src/ với tên file, comment tiếng
    // Việt như bản gốc.
    //
    // Nói cho đúng: đây KHÔNG phải mã hoá. Mọi web frontend đều phải gửi
    // JavaScript xuống trình duyệt nên code vẫn đọc/gỡ rối được nếu ai đó
    // quyết tâm. Sourcemap chỉ là thứ khiến việc đó dễ như đọc source gốc.
    // Muốn thật sự giấu logic thì phải đưa phần đó về backend.
    sourcemap: false,
    minify: 'esbuild',
  },
})
