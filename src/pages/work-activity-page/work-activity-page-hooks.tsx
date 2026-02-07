import { AuthCommonService } from "@/common/authentication";
import { formatDate } from "@/common/common-services/formatTime";
import type {
  WorkActivityType,
  WorkActivityActionType,
} from "@/common/types/work-activity.type";
import {
  useCreateWorkActivity,
  useDeleteWorkActivity,
  useUpdateWorkActivity,
  workActivityService,
} from "@/services/work-activity.service";

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Space,
  Tag,
  Tooltip,
  type FormInstance,
  type TableProps,
} from "antd";
import React from "react";

export const useWorkActivityPageHook = (form: FormInstance) => {
  const { modal } = App.useApp();

  // Mutations (notifications are handled in service)
  const createMutation = useCreateWorkActivity();
  const updateMutation = useUpdateWorkActivity();
  const deleteMutation = useDeleteWorkActivity();

  const [action, setAction] = React.useState<WorkActivityActionType>({
    isEdit: false,
    isView: false,
    isCreate: false,
  });

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const handleOpenCreateModal = () => {
    setOpenModal(true);
    setAction({ isEdit: false, isView: false, isCreate: true });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAction({ isEdit: false, isView: false, isCreate: false });
    form.resetFields();
  };

  const handleGetById = async (
    id: number,
    form: FormInstance<WorkActivityType>,
    key: string
  ) => {
    try {
      const res = await workActivityService.getWorkActivityById(id);
      await form.setFieldsValue(res);
      setAction({
        isEdit: key === "edit",
        isView: key === "view",
        isCreate: false,
      });
      setOpenModal(true);
      return res;
      //eslint-disable-next-line
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleCreate = async (form: FormInstance<WorkActivityType>) => {
    try {
      await form.validateFields();
      const payload = form.getFieldsValue();
      await createMutation.mutateAsync(payload);
      handleCloseModal();
      form.resetFields();
    } catch (error: unknown) {
      console.error("Lỗi khi tạo hoạt động:", error);
    }
  };

  const handleUpdate = async (
    id: number,
    form: FormInstance<WorkActivityType>
  ) => {
    try {
      await form.validateFields();
      const payload = form.getFieldsValue();
      await updateMutation.mutateAsync({
        id,
        data: {
          name: payload.name,
          description: payload.description,
          category: payload.category,
          riskLevel: payload.riskLevel,
        },
      });
      handleCloseModal();
      form.resetFields();
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật hoạt động:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error: unknown) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  const riskLevelColorMap: Record<string, string> = {
    low: "green",
    medium: "orange",
    high: "red",
  };

  const riskLevelLabelMap: Record<string, string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
  };

  const columns: TableProps<WorkActivityType>["columns"] = React.useMemo(() => {
    return [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        width: 80,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Tên hoạt động",
        dataIndex: "name",
        key: "name",
        width: 200,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        width: 250,
        ellipsis: true,
      },
      {
        title: "Danh mục",
        dataIndex: "category",
        key: "category",
        width: 150,
      },
      {
        title: "Mức độ rủi ro",
        dataIndex: "riskLevel",
        key: "riskLevel",
        width: 150,
        render: (riskLevel: string) => {
          if (!riskLevel) return "-";
          return (
            <Tag color={riskLevelColorMap[riskLevel] || "gray"}>
              {riskLevelLabelMap[riskLevel] || riskLevel}
            </Tag>
          );
        },
      },
      {
        title: "Ngày tạo",
        width: 180,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Ngày cập nhật",
        width: 180,
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Hành động",
        key: "action",
        width: 150,
        align: "center",
        fixed: "right",
        render: (_, record) => {
          return (
            <Space size="small">
              <Tooltip title={"Xem"}>
                <Button
                  type="primary"
                  size="small"
                  icon={<EyeOutlined />}
                  style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                  onClick={() => handleGetById(record.id, form, "view")}
                />
              </Tooltip>

              <Tooltip title={"Sửa"}>
                <Button
                  onClick={() => handleGetById(record.id, form, "edit")}
                  size="small"
                  disabled={!AuthCommonService.isAdmin()}
                  icon={<EditOutlined />}
                  style={
                    AuthCommonService.isAdmin()
                      ? {
                          backgroundColor: "#fa8c16",
                          borderColor: "#fa8c16",
                          color: "white",
                        }
                      : {}
                  }
                />
              </Tooltip>

              <Tooltip title={"Xóa"}>
                <Button
                  danger
                  disabled={!AuthCommonService.isAdmin()}
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    modal.confirm({
                      title: "Xác nhận xóa",
                      content: "Bạn có chắc chắn muốn xóa hoạt động này không?",
                      okText: "Xác nhận",
                      cancelText: "Hủy",
                      onOk: () => handleDelete(record.id),
                    })
                  }
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ];
  }, []);

  return {
    action,
    columns,
    openModal,
    setAction,
    handleCreate,
    handleUpdate,
    handleOpenCreateModal,
    handleCloseModal,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
