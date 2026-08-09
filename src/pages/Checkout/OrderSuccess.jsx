import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'

export default function OrderSuccess() {
  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Result
        status="success"
        title="Đã nhận đơn của bạn"
        subTitle={`Tuệ Trầm sẽ gọi từ số ${import.meta.env.VITE_STORE_HOTLINE} để xác nhận. Tri ân bạn đã ủng hộ phòng thuốc từ thiện.`}
        extra={
          <Link to="/">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  )
}
