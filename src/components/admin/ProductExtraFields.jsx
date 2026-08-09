import { Form, Input, InputNumber, Switch, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

// Các trường sản phẩm THEO SWAGGER CẬP NHẬT 2026-08-07, dùng chung cho cả
// modal "Thêm sản phẩm" (ProductFormModal) lẫn drawer "Sửa sản phẩm"
// (ProductEditDrawer) để hai nơi không lệch nhau:
//
//   priceOnRequest (bool) — bật = "bán theo yêu cầu": ô Giá bị ẩn và KHÔNG
//     gửi `price` lên API (xem cleanProductPayload trong productService),
//     trang khách hiển thị chữ "Liên hệ" thay cho số tiền.
//   specs      [{ label, value }] — đổ vào tab "Thông số" ở trang chi tiết.
//   usageSteps [string]           — đổ vào tab "Cách dùng", theo đúng thứ tự.

/** Ô giá + công tắc "giá liên hệ". Giá chỉ bắt buộc khi KHÔNG bật công tắc. */
export function PriceFields() {
  const priceOnRequest = Form.useWatch('priceOnRequest')

  return (
    <>
      <Form.Item
        name="priceOnRequest"
        label="Giá liên hệ"
        valuePropName="checked"
        initialValue={false}
        extra="Bật khi sản phẩm bán theo yêu cầu — trang khách sẽ hiện chữ “Liên hệ” thay cho giá."
      >
        <Switch />
      </Form.Item>

      {!priceOnRequest && (
        <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={1000}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/,/g, '')}
          />
        </Form.Item>
      )}
    </>
  )
}

/** Bảng thông số kỹ thuật — tab "Thông số" ở trang chi tiết sản phẩm. */
export function SpecsField() {
  return (
    <Form.Item label="Thông số (tab “Thông số” ở trang chi tiết)">
      <Form.List name="specs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...rest }) => (
              <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item {...rest} name={[name, 'label']} noStyle>
                  <Input placeholder="Xuất xứ" style={{ width: 150 }} />
                </Form.Item>
                <Form.Item {...rest} name={[name, 'value']} noStyle>
                  <Input placeholder="Đà Lạt" style={{ width: 190 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Thêm dòng thông số
            </Button>
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}

/** Danh sách bước sử dụng — tab "Cách dùng", hiển thị đúng thứ tự nhập. */
export function UsageStepsField() {
  return (
    <Form.Item label="Cách dùng (tab “Cách dùng” ở trang chi tiết)">
      <Form.List name="usageSteps">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...rest }) => (
              <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                <span style={{ color: '#999', minWidth: 18 }}>{name + 1}.</span>
                <Form.Item {...rest} name={name} noStyle>
                  <Input placeholder="Đốt than hoạt tính đến khi phủ tro trắng" style={{ width: 320 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Thêm bước
            </Button>
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}
