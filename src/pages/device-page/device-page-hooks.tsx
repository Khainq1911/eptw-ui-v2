import { formatDate } from "@/common/common-services/formatTime";
import type { AddDeviceFormType, DeviceType } from "@/common/types/device.type";
import { deviceService } from "@/services/deviceService";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Tag, type TableProps } from "antd";
import React from "react";

export const useDevicePageHook = () => {
  const [openAddDeviceModal, setOpenAddDeviceModal] =
    React.useState<boolean>(false);
  const [totalDevices, setTotalDevices] = React.useState<number>(0);
  const [deviceTableData, setDeviceTableData] = React.useState<DeviceType[]>(
    []
  );

   const [formAddDevice, setFormAddDevice] = React.useState<
      AddDeviceFormType | undefined
    >(undefined);

  const handleOpenAddDeviceModal = () => {
    setOpenAddDeviceModal(true);
  };

  const handleCloseAddDeviceModal = () => {
    setOpenAddDeviceModal(false);
  };

  const handleListDevices = React.useCallback(async () => {
    try {
      const res = await deviceService.getDevices();
      setDeviceTableData(res.devices ?? []);
      setTotalDevices(res.count ?? 0);
    } catch (error) {
      console.error("Lỗi khi load danh sách thiết bị:", error);
    }
  }, []);

  React.useEffect(() => {
    handleListDevices();
  }, [handleListDevices]);

  const deviceCardInfo = React.useMemo(
    () => [
      {
        title: "Tổng thiết bị",
        subTitle: "Tất cả",
        quantity: totalDevices,
        color: "#4CAF50",
      },
      {
        title: "Thiết bị hoạt động",
        subTitle: "Trạng thái: Active",
        quantity: deviceTableData.filter((d) => d.status === "active").length,
        color: "#2196F3",
      },
      {
        title: "Thiết bị ngừng",
        subTitle: "Trạng thái: Inactive",
        quantity: deviceTableData.filter((d) => d.status === "inactive").length,
        color: "#F44336",
      },
    ],
    [deviceTableData, totalDevices]
  );

  const DropdownMenu = React.useMemo(() => {
    return [
      { key: "view", label: "Xem" },
      { key: "edit", label: "Chỉnh sửa" },
      { key: "delete", label: "Xóa" },
    ];
  }, []);

  const columns: TableProps<DeviceType>["columns"] = React.useMemo(() => {
    return [
      { title: "Mã số", dataIndex: "id", key: "id", width: 80 },
      { title: "Tên thiết bị", dataIndex: "name", key: "name", width: 180 },
      { title: "Mã thiết bị", dataIndex: "code", key: "code", width: 150 },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status: string) => {
          const colorMap: Record<string, string> = {
            Available: "green",
            Inactive: "red",
            Maintenance: "orange",
          };
          return <Tag color={colorMap[status] || "gray"}>{status}</Tag>;
        },
      },
      {
        title: "Ngày tạo",
        width: 200,
        dataIndex: "created_at",
        key: "created_at",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Ngày cập nhật",
        width: 200,
        dataIndex: "updated_at",
        key: "updated_at",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Hành động",
        key: "action",
        width: 150,
        align: "center",
        render: () => {
          return (
            <Dropdown menu={{ items: DropdownMenu }} trigger={["click"]}>
              <MoreOutlined />
            </Dropdown>
          );
        },
      },
    ];
  }, []);

  return {
    deviceCardInfo,
    columns,
    deviceTableData,
    openAddDeviceModal,
    formAddDevice, 
    setFormAddDevice,
    handleOpenAddDeviceModal,
    handleCloseAddDeviceModal,
    handleListDevices,
  };
};
