import { PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Table } from "antd";
import { useWorkActivityPageHook } from "./work-activity-page-hooks";
import type { WorkActivityType } from "@/common/types/work-activity.type";
import WorkActivityModal from "./components/work-activity-modal";
import { useGetWorkActivityList } from "@/services/work-activity.service";
import React from "react";
import { AuthCommonService } from "@/common/authentication";

const CATEGORY_OPTIONS = [
  { value: "construction", label: "Xây dựng" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "inspection", label: "Kiểm tra" },
  { value: "electrical", label: "Điện" },
  { value: "mechanical", label: "Cơ khí" },
  { value: "chemical", label: "Hóa chất" },
  { value: "other", label: "Khác" },
];

const RISK_LEVEL_OPTIONS = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

export default function WorkActivityPage() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [filter, setFilter] = React.useState({
    limit: 10,
    page: 1,
  });
  const { data, isLoading } = useGetWorkActivityList(filter);
  const {
    columns,
    action,
    openModal,
    handleCreate,
    handleUpdate,
    handleCloseModal,
    handleOpenCreateModal,
  } = useWorkActivityPageHook(form);

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Hoạt động công việc
          </h1>
          <p className="text-slate-500 font-medium">
            Thiết lập và quản lý các loại hình công việc trong hệ thống
          </p>
        </div>

        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
          className="h-10 sm:h-12 px-6 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          Thêm hoạt động mới
        </Button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Bộ lọc & Tìm kiếm</h2>
        </div>
        <Form
          form={searchForm}
          layout="vertical"
          onValuesChange={(_, allValues) => {
            setFilter((prev) => ({
              ...prev,
              ...allValues,
              page: 1,
            }));
          }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên hoạt động</span>} 
                name="name" 
                className="!mb-0"
            >
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Tìm kiếm theo tên..."
                style={{ height: '30px' }}
                allowClear
              />
            </Form.Item>

            <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục</span>} 
                name="category" 
                className="!mb-0"
            >
              <Select
                allowClear
                placeholder="Chọn danh mục"
                options={CATEGORY_OPTIONS}
                style={{ height: '30px' }}
              />
            </Form.Item>

            <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mức độ rủi ro</span>} 
                name="riskLevel" 
                className="!mb-0"
            >
              <Select
                allowClear
                placeholder="Chọn mức độ"
                options={RISK_LEVEL_OPTIONS}
                style={{ height: '30px' }}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end items-center gap-3">
             <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  searchForm.resetFields();
                  setFilter({ limit: 10, page: 1 });
                }}
                className="h-8 px-4 rounded-lg font-semibold border-gray-200 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors"
              >
                Làm mới
              </Button>
          </div>
        </Form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Danh sách hoạt động</h2>
        </div>
        <Table<WorkActivityType>
            loading={isLoading}
            scroll={{ x: 1200 }}
            bordered={false}
            rowKey="id"
            className="work-activity-table"
            dataSource={data?.items || []}
            columns={columns as any}
            pagination={{
                pageSizeOptions: ["10", "20", "50", "100"],
                pageSize: filter.limit,
                current: filter.page,
                total: data?.total,
                showSizeChanger: true,
                className: "py-4",
                onChange: (page: number, pageSize: number) =>
                    setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
            }}
        />
      </div>

      {/* Modal */}
      <WorkActivityModal
        form={form}
        action={action}
        open={openModal}
        onClose={handleCloseModal}
        handleUpdate={handleUpdate}
        handleCreate={handleCreate}
      />
    </div>
  );
}
