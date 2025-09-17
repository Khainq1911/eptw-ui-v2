import { PlusOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useDevicePageHook } from "./device-page-hooks";
import StandardTable from "@/components/standardTable";
import type { DeviceType } from "@/common/types/device.type";
import AddDeviceModal from "./components/device-modal";

export default function DevicePage() {
  const {
    deviceCardInfo,
    deviceTableData,
    columns,
    form,
    openAddDeviceModal,
    handleCreateDevice,
    handleCloseAddDeviceModal,
    handleOpenAddDeviceModal,
  } = useDevicePageHook();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 ">
          Trang quản lý thiết bị
        </h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddDeviceModal}
        >
          Thêm thiết bị
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {deviceCardInfo.map((item) => {
          return (
            <Card
              key={`${item.title}-${item.subTitle}`}
              style={{
                borderLeft: `5px solid ${item.color}`,
              }}
              className="!w-full"
            >
              <h2 className="text-lg font-bold mb-2">{item.title}</h2>
              <h3
                className={`text-3xl font-bold mb-1`}
                style={{ color: item.color }}
              >
                {item.quantity}
              </h3>
              <p className="text-sm text-gray-500">{item.subTitle}</p>
            </Card>
          );
        })}
      </div>
      <div>
        <StandardTable<DeviceType>
          title={() => "Danh sách thiết bị"}
          rowKey={"code"}
          dataSource={deviceTableData}
          columns={columns}
        />
      </div>
      <AddDeviceModal
        open={openAddDeviceModal}
        form={form}
        onClose={handleCloseAddDeviceModal}
        handleCreateDevice={handleCreateDevice}
      />
    </div>
  );
}
