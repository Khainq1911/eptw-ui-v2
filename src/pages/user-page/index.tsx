import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useUserPage } from "./service";
import { formatDate } from "@/common/common-services/formatTime";
import UserModal from "./modal";
import { downloadFile } from "@/common/common-services/downloadFile";

export default function UserPage() {
  const {
    roleLoading,
    roleOptions,
    searchForm,
    userData,
    userLoading,
    filter,
    setFilter,
    handleResetFields,
    handleSearch,
    action,
    setAction,
    openModal,
    setOpenModal,
    findUserMutation,
  } = useUserPage();

  const { message } = App.useApp();

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
      align: 'center' as any,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      width: 150,
      render: (_: any, record: any) => record.role?.name,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (text: string) => formatDate(text),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (text: string) => formatDate(text),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      fixed: 'right' as any,
      align: 'center' as any,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={"Xem"}>
            <Button
              onClick={async () => {
                await findUserMutation.mutateAsync(record.id);
                setOpenModal(true), setAction("view");
              }}
              type="primary"
              size="small"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title={"Sửa"}>
            <Button
              onClick={async () => {
                await findUserMutation.mutateAsync(record.id);
                setOpenModal(true), setAction("update");
              }}
              size="small"
              icon={<EditOutlined />}
              style={{
                backgroundColor: "#fa8c16",
                borderColor: "#fa8c16",
                color: "white",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={roleLoading || userLoading}>
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              Quản lý người dùng
            </h1>
            <p className="text-slate-500 font-medium">Quản lý danh sách tài khoản và phân quyền người dùng trong hệ thống</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModal(true);
              setAction("create");
            }}
            className="h-10 sm:h-12 px-6 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95"
          >
            Thêm người dùng mới
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <h2 className="text-base font-bold text-gray-800 tracking-tight">Bộ lọc & Tìm kiếm</h2>
          </div>
          <Form form={searchForm} layout="vertical" onFieldsChange={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tìm kiếm người dùng</span>} 
                name="nameFilter"
                className="!mb-0"
              >
                <Input 
                   prefix={<SearchOutlined className="text-gray-400" />}
                   placeholder="Nhập tên, email hoặc SĐT..." 
                   allowClear 
                   style={{ height: '30px' }}
                />
              </Form.Item>
              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vai trò</span>} 
                name="roleIdFilter"
                className="!mb-0"
              >
                <Select
                  options={roleOptions}
                  showSearch
                  loading={roleLoading}
                  placeholder="Chọn vai trò"
                  allowClear
                  className="w-full"
                  style={{ height: '30px' }}
                  optionFilterProp="label"
                />
              </Form.Item>
            </div>
            
            <div className="flex justify-end items-center gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetFields}
                className="h-8 px-4 rounded-lg font-semibold border-gray-200 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors"
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={async () => await downloadFile("user", message)}
                className="h-8 px-6 bg-emerald-600 hover:bg-emerald-700 border-none rounded-lg font-semibold shadow-sm shadow-emerald-50 flex items-center justify-center transition-all active:scale-95"
              >
                Xuất Excel
              </Button>
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-emerald-600 rounded-full" />
            <h2 className="text-base font-bold text-gray-800 tracking-tight">Danh sách người dùng</h2>
          </div>
          <Table
            rowKey={"id"}
            loading={userLoading}
            columns={columns as any}
            dataSource={userData?.data}
            bordered={false}
            scroll={{ x: 1200 }}
            className="user-table"
            pagination={{
              pageSizeOptions: ["10", "20", "50", "100"],
              pageSize: filter.limit,
              current: filter.page,
              total: userData?.count,
              showSizeChanger: true,
              className: "py-4",
              onChange: (page: number, pageSize: number) =>
                setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
            }}
          />
        </div>
      </div>
      <UserModal
        data={findUserMutation.data}
        action={action}
        openModal={openModal}
        setOpenModal={setOpenModal}
        roleOptions={roleOptions}
      />
    </Spin>
  );
}
