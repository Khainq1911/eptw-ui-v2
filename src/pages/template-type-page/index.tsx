// src/pages/TemplateTypePage.tsx
import { App, Button, Space, Table, Tooltip, message } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateType,
  deleteTemplateType,
  getTemplateTypesWithFilter,
  updateTemplateType,
} from "@/services/template-type.service";
import type { TemplateType } from "./index.dto";
import TemplateTypeFormModal from "./modal";
import { formatDate } from "@/common/common-services/formatTime";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { Form, Input } from "antd";

export default function TemplateTypePage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateType | null>(null);
  const [action, setAction] = useState<"create" | "update" | "view" | null>(
    null
  );
  const [searchForm] = Form.useForm();
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    query: ""
  });

  const { modal } = App.useApp();

  const { data: templateTypeData, isLoading } = useQuery({
    queryKey: ["template-types", filter],
    queryFn: () => getTemplateTypesWithFilter(filter),
  });

  const createMutation = useMutation({
    mutationFn: createTemplateType,
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({
        queryKey: ["template-types"],
        exact: false,
      });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateTemplateType(id, data),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({
        queryKey: ["template-types"],
        exact: false,
      });
      setOpen(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplateType,
    onSuccess: () => {
      message.success("Xóa thành công");
      queryClient.invalidateQueries({
        queryKey: ["template-types"],
        exact: false,
      });
    },
  });

  const columns = [
    { title: "STT", dataIndex: "index", width: 80, align: 'center' as any, render: (_:any, __:any, index: number) => index + 1 },
    { title: "Tên loại", dataIndex: "name", width: 250 },
    { title: "Mô tả", dataIndex: "description", ellipsis: true },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 180,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: 180,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Hành động",
      width: 150,
      fixed: 'right' as any,
      align: 'center' as any,
      render: (_: any, record: any) => (
        <Space size={"small"}>
          <Tooltip title={"Xem"}>
            <Button
              type="primary"
              disabled={record.deletedAt}
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setOpen(true);
                setAction("view");
                setEditing(record);
              }}
            />
          </Tooltip>
          <Tooltip title={"Sửa"}>
            <Button
              size="small"
              disabled={record.deletedAt}
              icon={<EditOutlined />}
              style={
                !record.deletedAt
                  ? {
                      backgroundColor: "#fa8c16",
                      borderColor: "#fa8c16",
                      color: "white",
                    }
                  : {}
              }
              onClick={() => {
                setOpen(true);
                setAction("update");
                setEditing(record);
              }}
            />
          </Tooltip>
          <Tooltip title={"Xóa"}>
            <Button
              danger
              type="primary"
              disabled={record.deletedAt}
              size="small"
              icon={<DeleteOutlined />}
              onClick={() =>
                modal.confirm({
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa loại mẫu này?",
                  async onOk() {
                    await deleteMutation.mutateAsync(record.id);
                  },
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Quản lý loại mẫu
          </h1>
          <p className="text-slate-500 font-medium">Phân loại và cấu hình các nhóm bản mẫu giấy phép</p>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true), setAction("create");
          }}
          className="h-10 sm:h-12 px-6 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          Thêm loại mẫu mới
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Bộ lọc & Tìm kiếm</h2>
        </div>
        <Form
          form={searchForm}
          layout="vertical"
          onValuesChange={(_, values) => {
            setFilter(prev => ({ ...prev, ...values, page: 1 }));
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Form.Item 
              label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tìm kiếm loại mẫu</span>} 
              name="query" 
              className="!mb-0"
            >
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Nhập tên hoặc mô tả..."
                className="rounded-lg flex items-center"
                style={{ height: '30px' }}
                allowClear
              />
            </Form.Item>
          </div>
          <div className="flex justify-end items-center gap-3">
             <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  searchForm.resetFields();
                  setFilter({ limit: 10, page: 1, query: "" });
                }}
                className="h-8 px-4 rounded-lg font-semibold border-gray-200 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors"
              >
                Làm mới
              </Button>
          </div>
        </Form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Danh sách loại mẫu</h2>
        </div>
        <Table
          rowKey="id"
          columns={columns as any}
          dataSource={templateTypeData?.data || []}
          loading={isLoading}
          bordered={false}
          scroll={{ x: 1000 }}
          className="template-type-table"
          pagination={{
            pageSizeOptions: ["10", "20", "50", "100"],
            pageSize: filter.limit,
            current: filter.page,
            total: templateTypeData?.count || 0,
            showSizeChanger: true,
            className: "py-4",
            onChange: (page: number, pageSize: number) =>
              setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
          }}
        />
      </div>

      <TemplateTypeFormModal
        open={open}
        action={action}
        initialData={editing}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={(values) => {
          if (editing) {
            updateMutation.mutate({ id: editing.id, data: values });
          } else {
            createMutation.mutate(values);
          }
        }}
      />
    </div>
  );
}
