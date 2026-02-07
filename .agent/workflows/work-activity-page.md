# Hướng dẫn trang Work Activity

## Tổng quan

Trang **Work Activity** (Hoạt động công việc) dùng để quản lý danh sách các hoạt động công việc trong hệ thống.

**URL**: `/work-activity`

---

## Cấu trúc files

```
src/
├── common/types/
│   └── work-activity.type.ts      # TypeScript interfaces
├── services/
│   └── work-activity.service.ts   # API service & React Query hooks
├── pages/work-activity-page/
│   ├── work-activity-page.tsx     # Trang chính
│   ├── work-activity-page-hooks.tsx   # Custom hooks
│   └── components/
│       └── work-activity-modal.tsx    # Modal CRUD
├── configs/
│   ├── routes.ts                  # Route config
│   └── menu.tsx                   # Menu sidebar
└── router.tsx                     # Router registration
```

---

## Chức năng

| Chức năng | Mô tả |
|-----------|-------|
| **Tìm kiếm** | Theo tên, danh mục, mức độ rủi ro |
| **Thêm** | Nút "Thêm hoạt động" → Modal form |
| **Xem** | Nút 👁 → Modal với inputs disabled |
| **Sửa** | Nút ✏️ → Modal với dữ liệu được load |
| **Xóa** | Nút 🗑 → Confirm dialog → Xóa |

---

## API Endpoints cần implement (Backend)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/work-activity/list` | Lấy danh sách (có filter, pagination) |
| `POST` | `/work-activity/create` | Tạo mới |
| `GET` | `/work-activity/:id` | Lấy chi tiết theo ID |
| `POST` | `/work-activity/update/:id` | Cập nhật |
| `DELETE` | `/work-activity/:id` | Xóa |

### Request body cho `POST /work-activity/list`:

```json
{
  "query": "string",      // Tìm theo tên
  "category": "string",   // Lọc theo danh mục
  "riskLevel": "string",  // Lọc theo mức độ rủi ro
  "page": 1,
  "limit": 10
}
```

### Response format:

```json
{
  "data": [...],
  "count": 100
}
```

---

## Các giá trị mặc định

### Danh mục (category):
- `construction` - Xây dựng
- `maintenance` - Bảo trì
- `inspection` - Kiểm tra
- `electrical` - Điện
- `mechanical` - Cơ khí
- `chemical` - Hóa chất
- `other` - Khác

### Mức độ rủi ro (riskLevel):
- `low` - Thấp (màu xanh)
- `medium` - Trung bình (màu cam)
- `high` - Cao (màu đỏ)
