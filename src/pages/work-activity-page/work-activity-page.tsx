import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Quản lý hoạt động công việc
          </h1>
          <p className="text-gray-500">
            Theo dõi và quản lý danh sách các hoạt động công việc
          </p>
        </div>

        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
        >
          Thêm hoạt động
        </Button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Thông tin tìm kiếm
        </h2>
        <Form
          form={searchForm}
          layout="inline"
          onValuesChange={(_, allValues) => {
            setFilter((prev) => ({
              ...prev,
              ...allValues,
              page: 1,
            }));
          }}
          className="w-full"
        >
          {/* Filter inputs row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
            <Form.Item label={<span className="font-semibold">Tên hoạt động</span>} name="name" className="mb-0">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm theo tên"
                variant="filled"
                allowClear
              />
            </Form.Item>

            <Form.Item label={<span className="font-semibold">Danh mục</span>} name="category" className="mb-0">
              <Select
                allowClear
                placeholder="Chọn danh mục"
                options={CATEGORY_OPTIONS}
                variant="filled"
              />
            </Form.Item>

            <Form.Item label={<span className="font-semibold">Mức độ rủi ro</span>} name="riskLevel" className="mb-0">
              <Select
                allowClear
                placeholder="Chọn mức độ rủi ro"
                options={RISK_LEVEL_OPTIONS}
                variant="filled"
              />
            </Form.Item>
          </div>

          {/* Buttons row - aligned right */}
          <div className="flex justify-end gap-2 w-full">
            <Button
              onClick={() => {
                searchForm.resetFields();
                setFilter({ limit: 10, page: 1 });
              }}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
            >
              Tìm kiếm
            </Button>
          </div>
        </Form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Danh sách dữ liệu
          </h2>
        <Table<WorkActivityType>
            loading={isLoading}
            scroll={{ x: "max-content" }}
            bordered
            rowKey="id"
            dataSource={data?.items || []}
            columns={columns}
            pagination={{
                pageSizeOptions: ["5", "10", "20"],
            pageSize: filter.limit,
            current: filter.page,
            total: data?.count,
            showSizeChanger: true,
            showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
            onChange: (page: number, pageSize: number) =>
                setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
        }}
        />
        </div>
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
