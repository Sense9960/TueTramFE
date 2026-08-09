import { Component } from 'react'

// Lưới an toàn cho toàn app.
//
// Lý do có file này (2026-08-07): React 18 khi một component ném lỗi lúc render
// sẽ GỠ BỎ toàn bộ cây — màn hình còn trơ lại nền tối, không một chữ nào, và
// tab Network trông vẫn bình thường nên rất khó đoán nguyên nhân (chủ dự án
// gặp đúng cảnh này khi chuyển sang chế độ mobile). Có ErrorBoundary thì thay
// vì trắng/đen trơn, màn hình hiện thẳng thông báo lỗi + nút tải lại.
//
// Ở bản dev còn in luôn thông điệp lỗi ra màn hình cho dễ sửa; bản build thật
// chỉ hiện lời xin lỗi chung chung, không lộ chi tiết kỹ thuật cho khách.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Vẫn log ra console để F12 xem được stack đầy đủ.
    console.error('[Tuệ Trầm] Lỗi giao diện:', error, info?.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          padding: '32px 20px',
          textAlign: 'center',
          background: '#2e2b25',
          color: '#f9f4ed',
          fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600 }}>Trang gặp sự cố khi hiển thị</div>
        <p style={{ margin: 0, maxWidth: 420, fontSize: 14, lineHeight: 1.7, color: '#c9c1b4' }}>
          Xin lỗi bạn, có lỗi xảy ra khi tải trang này. Vui lòng thử tải lại.
        </p>

        {import.meta.env.DEV && (
          <pre
            style={{
              maxWidth: 560,
              width: '100%',
              overflow: 'auto',
              textAlign: 'left',
              fontSize: 12,
              lineHeight: 1.6,
              padding: 14,
              borderRadius: 12,
              background: '#403c33',
              color: '#ffc6a5',
            }}
          >
            {String(error?.stack || error?.message || error)}
          </pre>
        )}

        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: 4,
            padding: '11px 22px',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            background: '#c67139',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Tải lại trang
        </button>
      </div>
    )
  }
}
