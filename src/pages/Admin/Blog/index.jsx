import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, message } from 'antd'
import { adminListPosts, deletePost } from '../../../services/blogService'
import { pickList } from '../../../utils/pickList'
import BlogFormModal from '../../../components/admin/BlogFormModal'
import { AdminPageHeader, StatCards, DataTable, Pill, RowActions } from '../../../components/admin/ui'

// Màn "Quản lý bài đăng" — theo ảnh thiết kế Admin (2026-08-06).
// Dữ liệu thật từ GET /api/blog (Admin thấy cả bài Draft khi có token).
const idOf = (p) => p._id || p.id

function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN')
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // Không truyền status -> API mặc định chỉ trả bài Published; Admin cần
      // thấy cả Draft nên không lọc, dựa vào BE trả đủ khi có token Admin.
      const res = await adminListPosts({ limit: 100 })
      setPosts(pickList(res?.data, ['posts', 'items']))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không tải được danh sách bài viết')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // API blog không có tham số `search` (xem api-docs) nên lọc tại FE.
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => (p.title || '').toLowerCase().includes(q))
  }, [posts, search])

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.status === 'Published').length,
      draft: posts.filter((p) => p.status !== 'Published').length,
    }),
    [posts],
  )

  const handleDelete = (post) => {
    Modal.confirm({
      title: 'Xoá bài viết này?',
      content: post.title,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await deletePost(idOf(post))
          message.success('Đã xoá bài viết')
          load()
        } catch (err) {
          message.error(err?.response?.data?.message || 'Xoá bài viết thất bại')
        }
      },
    })
  }

  const columns = [
    { key: 'title', title: 'Tiêu đề', wrap: true, render: (p) => <strong style={{ fontWeight: 600 }}>{p.title || '—'}</strong> },
    {
      key: 'cat',
      title: 'Chuyên mục',
      render: (p) => <Pill tone="green">{p.category?.name || p.category || 'Chưa phân loại'}</Pill>,
    },
    { key: 'author', title: 'Tác giả', muted: true, render: (p) => p.author?.fullName || p.author || 'Admin' },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (p) =>
        p.status === 'Published' ? <Pill tone="green">Đã đăng</Pill> : <Pill tone="neutral">Bản nháp</Pill>,
    },
    { key: 'date', title: 'Ngày đăng', muted: true, render: (p) => fmtDate(p.publishedAt || p.createdAt) },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (p) => (
        <RowActions
          onEdit={() => {
            setEditingPost(p)
            setModalOpen(true)
          }}
          onDelete={() => handleDelete(p)}
        />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Quản lý bài đăng"
        subtitle="Nội dung blog và bài viết giới thiệu trầm hương."
        search={search}
        onSearchChange={setSearch}
        actionLabel="+ Thêm mới"
        onAction={() => {
          setEditingPost(null)
          setModalOpen(true)
        }}
      />

      <StatCards
        items={[
          { label: 'Tổng bài đăng', value: stats.total },
          { label: 'Đã đăng', value: stats.published },
          { label: 'Bản nháp', value: stats.draft },
        ]}
      />

      <DataTable columns={columns} rows={visible} rowKey={idOf} loading={loading} empty="Chưa có bài viết nào." />

      <BlogFormModal open={modalOpen} onClose={() => setModalOpen(false)} post={editingPost} onSaved={load} />
    </div>
  )
}
