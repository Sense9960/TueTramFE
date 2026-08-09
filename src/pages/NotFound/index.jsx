import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Result
        status="404"
        title="404"
        subTitle="Không tìm thấy trang bạn yêu cầu."
        extra={
          <Link to="/">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  )
}
