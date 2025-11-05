import { AuthCommonService } from "@/common/authentication";
import { formatDate } from "@/common/common-services/formatTime";
import { useNotification } from "@/common/hooks/useNotification";
import { useShowConfirm } from "@/common/hooks/useShowConfirm";
import type { DeviceActionType, DeviceType } from "@/common/types/device.type";
import { deviceService } from "@/services/device.service";

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Space,
  Tag,
  Tooltip,
  type FormInstance,
  type TableProps,
} from "antd";
import React from "react";


export const useDevicePageHook = (
  form: FormInstance,
  // eslint-disable-next-line
  data: any,
  // eslint-disable-next-line
  refetch: any
) => {
  const notify = useNotification();

  const [action, setAction] = React.useState<DeviceActionType>({
    isEdit: false,
    isView: false,
    isCreate: false,
  });

  const [openAddDeviceModal, setOpenAddDeviceModal] =
    React.useState<boolean>(false);

  const confirm = useShowConfirm();
  const handleOpenAddDeviceModal = () => {
    setOpenAddDeviceModal(true);
    setAction({ isEdit: false, isView: false, isCreate: true });
  };

  const handleCloseAddDeviceModal = () => {
    setOpenAddDeviceModal(false);
    setAction({ isEdit: false, isView: false, isCreate: false });
  };

  const handleGetDeviceById = async (
    id: string,
    form: FormInstance<DeviceType>,
    key: string
  ) => {
    try {
      const res = await deviceService.getDeviceById(id);
      await form.setFieldsValue(res);
      setAction({
        isEdit: key === "edit",
        isView: key === "view",
        isCreate: false,
      });
      setOpenAddDeviceModal(true);
      return res;
      //eslint-disable-next-line
    } catch (err: any) {
      console.log(err);
    }
  };


  const handleCreateDevice = async (form: FormInstance<DeviceType>) => {
    try {
      await form.validateFields();
      const payload = await form.getFieldsValue();
      await deviceService.createDevice(payload);
      handleCloseAddDeviceModal();
      notify(
        "success",
        "Thêm thiết bị thành công",
        "Thiết bị đã được thêm vào hệ thống"
      );
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi tạo thiết bị:", error);
    }
  };

  const handleUpdateDevice = async (
    id: string,
    form: FormInstance<DeviceType>
  ) => {
    try {
      await form.validateFields();
      const payload = await form.getFieldsValue();
      await deviceService.updateDevice(id, {
        status: payload.status,
        name: payload.name,
        code: payload.code,
        description: payload.description,
      });
      handleCloseAddDeviceModal();
      notify(
        "success",
        "Cập nhật thiết bị thành công",
        "Thiết bị đã được cập nhật vào hệ thống"
      );
      form.resetFields();
      await refetch();

    } catch (error) {
      console.error("Lỗi khi tạo thiết bị:", error);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await deviceService.deleteDevice(id);
      notify(
        "success",
        "Xóa thiết bị thành công",
        "Thiết bị đã được xóa khỏi hệ thống"
      );
      await refetch();

    } catch (error) {
      console.error("Lỗi khi xóa thiết bị:", error);
    }
  };

  const deviceCardInfo = React.useMemo(
    () => [
      {
        title: "Tổng thiết bị",
        subTitle: "Tất cả",
        quantity: data?.countAll,
        color: "#4CAF50",
      },
      {
        title: "Thiết bị hoạt động",
        subTitle: "Trạng thái: Hoạt động",
        quantity: data?.countActiveDevice,
        color: "#2196F3",
      },
      {
        title: "Thiết bị ngừng",
        subTitle: "Trạng thái: Bảo trì",
        quantity: data?.countInactiveDevice,
        color: "#F44336",
      },
      {
        title: "Tình trạng sử dụng",
        subTitle: "Trạng thái: Đang được sử dụng",
        quantity: data?.countIsUsedDevice,
        color: "#FF9800",
      },
    ],
    [data]
  );

  const columns: TableProps<DeviceType>["columns"] = React.useMemo(() => {
    return [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        width: 80,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      { title: "Tên thiết bị", dataIndex: "name", key: "name", width: 180 },
      {
        title: "Mã thiết bị",
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (_, record) => record.id + " - " + record.code,
      },

      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status: string) => {
          const colorMap: Record<string, string> = {
            active: "green",
            maintain: "orange",
            delete: "red",
          };

          const labelMap: Record<string, string> = {
            active: "Hoạt động",
            maintain: "Bảo trì",
            delete: "Đã Xóa",

          };
          return (
            <Tag color={colorMap[status] || "gray"}>{labelMap[status]}</Tag>
          );
        },
      },
      {
        title: "Ngày tạo",
        width: 200,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Ngày cập nhật",
        width: 200,
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Tình trạng sử dụng",
        width: 200,
        dataIndex: "isUsed",
        key: "isUsed",
        render: (_, record) =>
          record.isUsed ? "Đang trong sử dụng" : "Đang không sử dụng",
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
                  onClick={() => handleGetDeviceById(record.id, form, "view")}
                />
              </Tooltip>

              <Tooltip title={"Sửa"}>
                <Button
                  onClick={() => handleGetDeviceById(record.id, form, "edit")}
                  size="small"
                  disabled={
                    record.status === "delete" ||
                    record.isUsed ||
                    !AuthCommonService.isAdmin()
                  }
                  icon={<EditOutlined />}
                  style={
                    !(
                      record.status === "delete" ||
                      record.isUsed ||
                      !AuthCommonService.isAdmin()
                    )
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
                  disabled={
                    record.status === "delete" ||
                    record.isUsed ||
                    !AuthCommonService.isAdmin()
                  }
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    confirm(
                      "Xác nhận xóa",
                      "Bạn có chắc chắn muốn xóa không?",
                      () => handleDeleteDevice(record.id)
                    )
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
    deviceCardInfo,
    columns,
    openAddDeviceModal,
    setAction,
    handleCreateDevice,
    handleUpdateDevice,
    handleOpenAddDeviceModal,
    handleCloseAddDeviceModal,
  };
};
