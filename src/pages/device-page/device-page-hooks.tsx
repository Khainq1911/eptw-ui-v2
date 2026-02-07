import { AuthCommonService } from "@/common/authentication";
import { formatDate } from "@/common/common-services/formatTime";
import type { DeviceActionType, DeviceType } from "@/common/types/device.type";
import { deviceService } from "@/services/device.service";

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
import { AxiosError } from "axios";

export const useDevicePageHook = (
  form: FormInstance,
  // eslint-disable-next-line
  data: any,
  // eslint-disable-next-line
  refetch: any,
) => {
  const { notification, modal } = App.useApp();

  const [action, setAction] = React.useState<DeviceActionType>({
    isEdit: false,
    isView: false,
    isCreate: false,
  });

  const [openAddDeviceModal, setOpenAddDeviceModal] =
    React.useState<boolean>(false);

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
    key: string,
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
      notification.success({
        message: "Thêm thiết bị thành công",
        description: "Thiết bị đã được thêm vào hệ thống",
        placement: "topRight",
        duration: 3,
      });
      form.resetFields();
      await refetch();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;
      const msg = axiosError.response?.data?.message || "Đã có lỗi xảy ra";
      console.log(axiosError);
      notification.error({
        message: "Thêm thiết bị thất bại",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
      console.error("Lỗi khi tạo thiết bị:", error);
    }
  };

  const handleUpdateDevice = async (
    id: string,
    form: FormInstance<DeviceType>,
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
      notification.success({
        message: "Cập nhật thiết bị thành công",
        description: "Thiết bị đã được cập nhật vào hệ thống",
        placement: "topRight",
        duration: 3,
      });
      form.resetFields();
      await refetch();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;
      const msg = axiosError.response?.data?.message || "Đã có lỗi xảy ra";
      console.log(axiosError);
      notification.error({
        message: "Cập nhật thiết bị thất bại",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await deviceService.deleteDevice(id);
      notification.success({
        message: "Xóa thiết bị thành công",
        description: "Thiết bị đã được xóa khỏi hệ thống",
        placement: "topRight",
        duration: 3,
      });
      await refetch();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;
      const msg = axiosError.response?.data?.message || "Đã có lỗi xảy ra";
      console.log(axiosError);
      notification.error({
        message: "Xóa thiết bị thất bại",
        description: msg,
        placement: "topRight",
        duration: 3,
      });
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
        subTitle: "Trạng thái: Không hoạt động",
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
    [data],
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
            inactive: "red",
            deleted: "red",
          };

          const labelMap: Record<string, string> = {
            active: "Hoạt động",
            inactive: "Không hoạt động",
            deleted: "Đã Xóa",
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
                    record.status === "deleted" ||
                    record.isUsed ||
                    !AuthCommonService.isAdmin()
                  }
                  icon={<EditOutlined />}
                  style={
                    !(
                      record.status === "deleted" ||
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
                    record.status === "deleted" ||
                    record.isUsed ||
                    !AuthCommonService.isAdmin()
                  }
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    modal.confirm({
                      title: "Xác nhận xóa",
                      content: "Bạn có chắc chắn muốn xóa không?",
                      okText: "Confirm",
                      cancelText: "Cancel",
                      onOk: () => handleDeleteDevice(record.id),
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
