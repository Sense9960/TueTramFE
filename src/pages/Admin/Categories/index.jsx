import { useCallback, useEffect, useState } from 'react'
import { Table, Button, Space, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getCategories, deleteCategory } from '../../../services/categoryService'
import { pickList } from '../../../utils/pickList'
import CategoryFormModal from '../../../components/admin/CategoryFormModal'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      setCategories(pickList(res?.data, ['categories', 'items']))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không tải được danh sách danh mục')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      message.success('Đã xoá danh mục')
      load()
    } catch (err) {
      // API trả 409 nếu danh mục còn sản phẩm — hiển thị message gốc từ backend
      message.error(err?.response?.data?.message || 'Xoá danh mục thất bại')
    }
  }

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'name' },
    { title: 'Mô tả', dataIndex: 'description', ellipsis: true },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditingCategory(record)
              setModalOpen(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá danh mục này?"
            description="Sẽ báo lỗi nếu vẫn còn sản phẩm thuộc danh mục."
            onConfirm={() => handleDelete(record._id || record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button size="small" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Danh mục</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null)
            setModalOpen(true)
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table
        rowKey={(r) => r._id || r.id}
        columns={columns}
        dataSource={categories}
        loading={loading}
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
      />

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editingCategory}
        onSaved={load}
      />
    </div>
  )
}
