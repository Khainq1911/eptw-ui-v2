import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useUserPage } from "./service";
import { formatDate } from "@/common/common-services/formatTime";
import UserModal from "./modal";
import { downloadFile } from "@/common/common-services/downloadFile";

const { Text } = Typography;

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
      width: 60,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 180 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 260,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 220 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 260,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 220 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      width: 180,
      render: (_: any, record: any) => (
        <Tooltip title={record.role?.name}>
          <Text ellipsis style={{ maxWidth: 160 }}>
            {record.role?.name}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record: any) => (
        <Tooltip title={formatDate(record.createdAt)}>
          <Text ellipsis style={{ maxWidth: 160 }}>
            {formatDate(record.createdAt)}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_: any, record: any) => (
        <Tooltip title={formatDate(record.createdAt)}>
          <Text ellipsis style={{ maxWidth: 160 }}>
            {formatDate(record.createdAt)}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title={"Xem"}>
            <Button
              onClick={async () => {
                await findUserMutation.mutateAsync(record.id);
                setOpenModal(true), setAction("view");
              }}
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
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
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="mb-2 md:mb-0">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2">
            Trang quản lý người dùng
          </h2>
          <p>Trang dành cho quản trị viên để quản lý người dùng</p>
        </div>
        <Button
          type="primary"
          onClick={() => {
            setOpenModal(true);
            setAction("create");
          }}
        >
          Thêm người dùng mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <Form form={searchForm} onFieldsChange={handleSearch}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="nameFilter">
                <Input placeholder="Tìm kiếm người dùng" allowClear></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="roleIdFilter">
                <Select
                  options={roleOptions}
                  showSearch
                  loading={roleLoading}
                  placeholder="Chọn vai trò"
                  allowClear
                  className="w-full"
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space className="float-right">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleResetFields}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  style={{
                    backgroundColor: "#218A55",
                    color: "white",
                    borderColor: "#218A55",
                  }}
                  onClick={async () => await downloadFile("user", message)}
                >
                  Xuất Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      <Table
        rowKey={"id"}
        loading={userLoading}
        columns={columns}
        dataSource={userData?.data}
        bordered
        scroll={{ x: "max-content" }}
        pagination={{
          pageSizeOptions: ["5", "10", "20"],
          pageSize: filter.limit,
          current: filter.page,
          total: userData?.count,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) =>
            setFilter((pre) => ({ ...pre, page: page, limit: pageSize })),
        }}
      />
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
