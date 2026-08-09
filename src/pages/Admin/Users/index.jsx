import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, message } from 'antd'
import { listUsers, deleteUser } from '../../../services/userService'
import { pickList } from '../../../utils/pickList'
import { useAuth } from '../../../hooks/useAuth'
import UserFormModal from '../../../components/admin/UserFormModal'
import { AdminPageHeader, StatCards, DataTable, Pill, RowActions } from '../../../components/admin/ui'

// Màn "Quản lý người dùng" — bố cục theo ảnh thiết kế Admin (2026-08-06):
// tiêu đề + ô tìm kiếm + nút "Thêm mới", 3 thẻ số liệu, bảng nền kem.
// Dữ liệu lấy từ API thật GET /api/admin/users (không mock).
const ROLE_LABEL = { Admin: 'Quản trị viên', Customer: 'Khách hàng' }
const STATUS_META = {
  Active: { label: 'Hoạt động', tone: 'green' },
  Inactive: { label: 'Vô hiệu hoá', tone: 'neutral' },
  Banned: { label: 'Đã khoá', tone: 'danger' },
}

function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN')
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listUsers({ search: search || undefined, limit: 100 })
      setUsers(pickList(res?.data, ['users', 'items']))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không tải được danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    // Chờ 350ms sau khi gõ mới gọi API, tránh bắn request mỗi ký tự.
    const t = setTimeout(load, 350)
    return () => clearTimeout(t)
  }, [load])

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => (u.status || 'Active') === 'Active').length,
      admins: users.filter((u) => u.role === 'Admin').length,
    }),
    [users],
  )

  const idOf = (u) => u._id || u.id
  const isSelf = (u) => idOf(u) === (currentUser?._id || currentUser?.id)

  const handleDelete = (u) => {
    Modal.confirm({
      title: 'Xoá tài khoản này?',
      content: u.fullName || u.email,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await deleteUser(idOf(u))
          message.success('Đã xoá tài khoản')
          load()
        } catch (err) {
          message.error(err?.response?.data?.message || 'Xoá tài khoản thất bại')
        }
      },
    })
  }

  const columns = [
    { key: 'name', title: 'Họ tên', render: (u) => <strong style={{ fontWeight: 600 }}>{u.fullName || '—'}</strong> },
    { key: 'email', title: 'Email', muted: true, render: (u) => u.email || '—' },
    { key: 'phone', title: 'Điện thoại', render: (u) => u.phone || '—' },
    {
      key: 'role',
      title: 'Vai trò',
      render: (u) => (
        <Pill tone={u.role === 'Admin' ? 'solid' : 'outline'}>{ROLE_LABEL[u.role] || u.role || '—'}</Pill>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (u) => {
        const st = STATUS_META[u.status] || STATUS_META.Active
        return <Pill tone={st.tone}>{st.label}</Pill>
      },
    },
    { key: 'joined', title: 'Ngày tham gia', muted: true, render: (u) => fmtDate(u.createdAt) },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (u) => (
        <RowActions
          onEdit={() => {
            setEditingUser(u)
            setModalOpen(true)
          }}
          onDelete={() => handleDelete(u)}
          disableDelete={isSelf(u)}
        />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Quản lý người dùng"
        subtitle="Danh sách khách hàng và quản trị viên của cửa hàng."
        search={search}
        onSearchChange={setSearch}
        actionLabel="+ Thêm mới"
        onAction={() => {
          setEditingUser(null)
          setModalOpen(true)
        }}
      />

      <StatCards
        items={[
          { label: 'Tổng người dùng', value: stats.total },
          { label: 'Đang hoạt động', value: stats.active },
          { label: 'Quản trị viên', value: stats.admins },
        ]}
      />

      <DataTable
        columns={columns}
        rows={users}
        rowKey={idOf}
        loading={loading}
        empty="Chưa có người dùng nào."
      />

      <UserFormModal open={modalOpen} onClose={() => setModalOpen(false)} user={editingUser} onSaved={load} />
    </div>
  )
}
