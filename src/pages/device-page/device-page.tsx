import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Table } from "antd";
import { useDevicePageHook } from "./device-page-hooks";
import type { DeviceType } from "@/common/types/device.type";
import AddDeviceModal from "./components/device-modal";
import { useGetDeviceService } from "@/services/deviceService";
import React from "react";
import { AuthCommonService } from "@/common/authentication";

export default function DevicePage() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [filter, setFilter] = React.useState({
    limit: 5,
    page: 1,
  });
  const { data, isLoading, refetch } = useGetDeviceService(filter);
  const {
    deviceCardInfo,
    columns,
    action,
    openAddDeviceModal,
    handleCreateDevice,
    handleUpdateDevice,
    handleCloseAddDeviceModal,
    handleOpenAddDeviceModal,
  } = useDevicePageHook(form, data, refetch);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-0 align-center">
          Trang quản lý thiết bị
        </h1>

        <Button
          disabled={!AuthCommonService.isAdmin()}
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
        <Table<DeviceType>
          loading={isLoading}
          scroll={{ x: "max-content" }}
          title={() => {
            return (
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 ">
                <Form
                  form={searchForm}
                  layout="inline"
                  onValuesChange={(_, allValues) => {
                    setFilter((prev) => ({
                      ...prev,
                      ...allValues,
                    }));
                  }}
                  className="flex-1 w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Form.Item name="query">
                      <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tên hoặc mã thiết bị"
                        variant="filled"
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item name="status">
                      <Select
                        allowClear
                        placeholder="Chọn trạng thái"
                        options={[
                          { value: "active", label: "Hoạt động" },
                          { value: "maintain", label: "Bảo trì" },
                          { value: "delete", label: "Đã xóa" },
                        ]}
                        variant="filled"
                      />
                    </Form.Item>

                    <Form.Item name="isUsed">
                      <Select
                        allowClear
                        placeholder="Chọn tình trạng"
                        options={[
                          { value: true, label: "Đang sử dụng" },
                          { value: false, label: "Chưa sử dụng" },
                        ]}
                        variant="filled"
                      />
                    </Form.Item>
                  </div>
                </Form>

                {/* Export button */}
                <div className="shrink-0">
                  <Button type="primary" icon={<DownloadOutlined />}>
                    Export
                  </Button>
                </div>
              </div>
            );
          }}
          pagination={{
            pageSizeOptions: ["5", "10", "20"],
            pageSize: filter.limit,
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) =>
              setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
          }}
          rowKey={"code"}
          dataSource={data?.devices || []}
          columns={columns}
        />
      </div>
      <AddDeviceModal
        form={form}
        action={action}
        open={openAddDeviceModal}
        onClose={handleCloseAddDeviceModal}
        handleUpdateDevice={handleUpdateDevice}
        handleCreateDevice={handleCreateDevice}
      />
    </div>
  );
}
