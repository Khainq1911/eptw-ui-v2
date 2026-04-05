import {
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { App, Button, Card, Form, Input, Select, Table } from "antd";
import { useDevicePageHook } from "./device-page-hooks";
import type { DeviceType } from "@/common/types/device.type";
import AddDeviceModal from "./components/device-modal";
import { useGetDeviceService } from "@/services/device.service";
import React from "react";
import { AuthCommonService } from "@/common/authentication";
import { downloadFile } from "@/common/common-services/downloadFile";

export default function DevicePage() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [searchForm] = Form.useForm();
  
  // State for immediate form values (for controlled inputs if needed, though searchForm is usually enough)
  // State for debounced filters to trigger API
  const [filter, setFilter] = React.useState({
    limit: 10,
    page: 1,
    query: "",
    status: undefined,
    isUsed: undefined
  });

  // Track the actual query in a separate state for immediate UI feedback if needed, 
  // but here we rely on Form.Item and debounce the 'filter' update.
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setFilter(prev => ({ ...prev, query: searchValue, page: 1 }));
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchValue]);

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

  // Memoized Skeleton to avoid re-creation
  const cardSkeletons = React.useMemo(() => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="!w-full border-gray-100 shadow-sm rounded-xl">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </Card>
      ))}
    </div>
  ), []);

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Quản lý thiết bị
          </h1>
          <p className="text-slate-500 font-medium">Theo dõi và quản lý danh sách thiết bị trong hệ thống</p>
        </div>

        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleOpenAddDeviceModal}
          className="h-12 px-6 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          Thêm thiết bị mới
        </Button>
      </div>

      {isLoading ? cardSkeletons : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {deviceCardInfo.map((item) => (
            <Card
              key={`${item.title}-${item.subTitle}`}
              className="!w-full border-none shadow-sm rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
              bodyStyle={{ padding: '24px' }}
              style={{
                background: `linear-gradient(135deg, white 0%, white 100%)`,
                position: 'relative'
              }}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-1">{item.title}</h2>
                  <h3
                    className="text-3xl font-bold mb-1"
                    style={{ color: item.color }}
                  >
                    {item.quantity || 0}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium whitespace-nowrap">{item.subTitle}</p>
                </div>
                <div 
                  className="p-3 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400"
                  style={{ color: item.color, backgroundColor: `${item.color}10` }}
                >
                  <SearchOutlined className="text-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Bộ lọc & Tìm kiếm</h2>
        </div>

        <Form
          form={searchForm}
          layout="vertical"
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.query !== undefined) {
                setSearchValue(changedValues.query);
            } else {
              setFilter((prev) => ({
                ...prev,
                ...allValues,
                query: searchValue,
                page: 1,
              }));
            }
          }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Form.Item label={<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tìm kiếm</span>} name="query" className="!mb-0">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Tên hoặc mã thiết bị"
                className="rounded-lg flex items-center"
                allowClear
                style={{ height: '30px' }}
              />
            </Form.Item>

            <Form.Item label={<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái hoạt động</span>} name="status" className="!mb-0">
              <Select
                allowClear
                placeholder="Tất cả trạng thái"
                className="rounded-lg w-full"
                style={{ height: '30px' }}
                options={[
                  { value: "active", label: "Hoạt động" },
                  { value: "inactive", label: "Bảo trì / Ngừng" },
                ]}
              />
            </Form.Item>

            <Form.Item label={<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tình trạng sử dụng</span>} name="isUsed" className="!mb-0">
              <Select
                allowClear
                placeholder="Tất cả tình trạng"
                className="rounded-lg w-full"
                style={{ height: '30px' }}
                options={[
                  { value: true, label: "Đang được sử dụng" },
                  { value: false, label: "Đang rảnh (Chưa dùng)" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end items-center gap-3">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                searchForm.resetFields();
                setSearchValue("");
                setFilter({ limit: 10, page: 1, query: "", status: undefined, isUsed: undefined });
              }}
              className="h-10 px-4 rounded-lg font-semibold border-gray-200 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors"
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={async () => {
                await downloadFile("device", message);
              }}
              className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 border-none rounded-lg font-semibold shadow-sm shadow-emerald-50 flex items-center justify-center transition-all active:scale-95"
            >
              Xuất Excel
            </Button>
          </div>
        </Form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 border-gray-100 overflow-hidden">
        <div className="pb-4">
            <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-600 rounded-full" />
                <h2 className="text-base font-bold text-gray-800 tracking-tight">Danh sách thiết bị</h2>
            </div>
        </div>
        <Table<DeviceType>
          loading={isLoading}
          scroll={{ x: 1000 }}
          className="device-table"
          pagination={{
            pageSizeOptions: ["10", "20", "50", "100"],
            pageSize: filter.limit,
            current: filter.page,
            total: data?.countAll,
            showSizeChanger: true,
            className: "px-6 py-4",
            onChange: (page: number, pageSize: number) =>
              setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
          }}
          rowKey={"id"}
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
