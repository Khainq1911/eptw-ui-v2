---
trigger: manual
---

---
description: Chuẩn layout trang danh sách (2 phần: tìm kiếm + bảng) và chức năng thêm/sửa/xóa
globs: "**/pages/**/*.tsx"
alwaysApply: false
---

# Trang danh sách – Layout và CRUD

## 1. Layout chia 2 phần

Mọi trang quản lý danh sách (list/table) phải có **hai phần rõ ràng**:

### Phần 1: Thông tin tìm kiếm (Search / Filter)

- Đặt trong một khối riêng (ví dụ `Card` hoặc `div` có `className` như `bg-white rounded-lg shadow-sm p-6 border mb-6`).
- Dùng **Form** (Ant Design) với các `Form.Item` cho từng tiêu chí tìm kiếm (Input, Select, DatePicker, ...).
- Bố cục: `Row` + `Col` (hoặc grid) để căn chỉnh. Có nút **Tìm kiếm / Làm mới** và tùy nghi **Xuất Excel**.
- Gắn form với state filter (page, limit, các field search) và gọi API khi submit/change.

```tsx
// Ví dụ cấu trúc phần tìm kiếm
<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
  <Form form={searchForm} onFinish={handleSearch}>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="keyword">
          <Input placeholder="Tìm kiếm..." allowClear />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="status">
          <Select placeholder="Trạng thái" allowClear options={...} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
          <Button onClick={handleResetFields}>Làm mới</Button>
        </Space>
      </Col>
    </Row>
  </Form>
</div>
```

### Phần 2: Bảng chứa dữ liệu (Data Table)

- Đặt **ngay dưới** phần tìm kiếm, không lồng trong form tìm kiếm.
- Dùng **Table** (Ant Design) với: `columns`, `dataSource`, `rowKey`, `loading`, `pagination` (page, pageSize, total, onChange).
- **Cột "Hành động"** của bảng bắt buộc gồm: **Thêm** (nút ở đầu trang), **Xem**, **Sửa**, **Xóa** (nút trên từng dòng). Xem chi tiết ở mục 2 bên dưới.
- Bật `scroll={{ x: "max-content" }}` khi cột nhiều. Có thể dùng `bordered`.

```tsx
<Table
  rowKey="id"
  loading={isLoading}
  columns={columns}
  dataSource={data?.data}
  bordered
  scroll={{ x: "max-content" }}
  pagination={{
    current: filter.page,
    pageSize: filter.limit,
    total: data?.count,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20"],
    onChange: (page, pageSize) => setFilter((prev) => ({ ...prev, page, limit: pageSize })),
  }}
/>
```

---

## 2. Chức năng Thêm – Xem – Sửa – Xóa (CRUD)

Cột hành động của Table gồm đủ **Thêm**, **Xem**, **Sửa**, **Xóa**:

### Thêm (Create)

- Có **một nút chính** (ví dụ "Thêm mới", "Thêm ...") ở đầu trang hoặc cạnh tiêu đề (cùng hàng với title).
- Click mở **Modal** hoặc **Drawer** chứa form tạo mới. Dùng chung component modal/drawer cho Thêm, Xem, Sửa; phân biệt bằng prop `action`: `"create"` | `"update"` | `"view"`.

### Xem (View)

- Trong **cột "Hành động"**: có nút **Xem** (icon `EyeOutlined`). Click mở cùng Modal/Drawer với dữ liệu bản ghi và `action="view"`.
- **Khi `action === "view"`**: tất cả input trong Modal/Drawer phải **disabled** (chỉ đọc). Ẩn hoặc disable nút submit/lưu; chỉ hiển thị nút Đóng.

```tsx
// Trong Modal/Drawer: disable inputs khi view
const isView = action === "view";
<Form.Item name="name">
  <Input disabled={isView} />
</Form.Item>
<Select disabled={isView} ... />
// Footer: chỉ hiện nút Đóng khi view, ẩn nút Lưu/Thêm
```

### Sửa (Update)

- Trong **cột "Hành động"** của Table: có nút **Sửa** (icon `EditOutlined`). Click vào sẽ mở cùng Modal/Drawer với dữ liệu bản ghi đã chọn và `action="update"`.
- Load chi tiết bản ghi (theo id) trước khi mở modal nếu cần (ví dụ `findById` rồi set vào modal).

### Xóa (Delete)

- Trong **cột "Hành động"**: có nút **Xóa** (icon `DeleteOutlined`). Click vào hiển thị **Confirm** (Ant Design `Modal.confirm` hoặc `App.useApp().modal.confirm`) hỏi trước khi gọi API xóa. Sau khi xóa thành công: `message.success` và refetch danh sách (hoặc cập nhật state).

```tsx
// Cột hành động: Xem, Sửa, Xóa (mỗi dòng). Thêm = nút ở đầu trang.
{
  title: "Hành động",
  key: "action",
  width: 140,
  fixed: "right",
  render: (_: any, record: any) => (
    <Space>
      <Tooltip title="Xem">
        <Button size="small" icon={<EyeOutlined />} onClick={() => handleOpenView(record)} />
      </Tooltip>
      <Tooltip title="Sửa">
        <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
      </Tooltip>
      <Tooltip title="Xóa">
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
      </Tooltip>
    </Space>
  ),
}
```

---

## Tóm tắt

| Yêu cầu | Cách làm |
|--------|----------|
| Layout 2 phần | (1) Khối Form tìm kiếm phía trên, (2) Table phía dưới |
| Action của table | Gồm **Thêm** (nút đầu trang), **Xem**, **Sửa**, **Xóa** (trên từng dòng) |
| Prop `action` | `"create"` \| `"update"` \| `"view"` — khi **view** thì disable toàn bộ input trong Modal/Drawer |
| Thêm | Nút "Thêm" → mở Modal/Drawer, action = create |
| Xem | Nút Xem → mở Modal/Drawer với dữ liệu dòng đó, action = view, **các input disabled** |
| Sửa | Nút Sửa → mở Modal/Drawer với dữ liệu dòng đó, action = update |
| Xóa | Nút Xóa → confirm → gọi API xóa → message + refetch |
