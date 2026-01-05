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
} from "@ant-design/icons";

export default function TemplateTypePage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateType | null>(null);
  const [action, setAction] = useState<"create" | "update" | "view" | null>(
    null
  );
  const [filter, setFilter] = useState({
    limit: 5,
    page: 1,
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
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Tên", dataIndex: "name" },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Hành động",
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
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2 align-center">
            Trang quản lý loại mẫu giấy phép
          </h1>
          <p>Theo dõi và quản lý loại mẫu giấy phép</p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true), setAction("create");
          }}
        >
          Thêm Template Type
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={templateTypeData || []}
        loading={isLoading}
        bordered
        scroll={{ x: "max-content" }}
        pagination={{
          pageSizeOptions: ["1", "5", "10", "20"],
          pageSize: filter.limit,
          current: filter.page,
          total: templateTypeData?.count || 0,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) =>
            setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
        }}
      />

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
    </>
  );
}
