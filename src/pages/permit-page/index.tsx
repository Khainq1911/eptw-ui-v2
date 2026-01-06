import { AuthCommonService } from "@/common/authentication";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import SelectTemplateModal from "./components/select-template-modal";
import { useGetTemplateDdl, usePermitHooks } from "./services";
import CreatePermitDrawer from "./components/create-permit-drawer";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "@/common/common-services/formatTime";
import { useNavigate } from "react-router-dom";
import { downloadFile } from "@/common/common-services/downloadFile";

export default function PermitPage() {
  const {
    state,
    PERMIT_STATUS,
    modalForm,
    openModalSelect,
    openCreatePermit,
    listPermits,
    listTemplates,
    listUsers,
    listWorkActivities,
    listDevices,
    handleFilter,
    filter,
    setFilter,
    statusColor,
    isLoading,
    searchForm,
    handleRefreshSearch,
    dispatch,
    handleOpenCreatePermit,
    handleCloseCreatePermit,
    handleCloseModalSelect,
    handleOpenModalSelect,
    deletePermitMutation,
    getDetailPermitMutation,
  } = usePermitHooks();
  const { data: templateDdl, isLoading: isLoadingTemplate } =
    useGetTemplateDdl();
  const { modal, message } = App.useApp();
  const navigate = useNavigate();

  const columns: ColumnsType = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
      align: "center",
    },
    {
      title: "Tên giấy phép",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Tên bản mẫu",
      dataIndex: "templateName",
      key: "templateName",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Thiết bị",
      dataIndex: "devices",
      key: "devices",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Công việc",
      dataIndex: "workActivities",
      key: "workActivities",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={formatDate(text)}>
          <span>{formatDate(text)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={formatDate(text)}>
          <span>{formatDate(text)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      ellipsis: true,
      fixed: "right",
      render: (
        text:
          | "Pending"
          | "Approved"
          | "Rejected"
          | "Expired"
          | "Cancelled"
          | "Closed"
      ) => {
        const status = PERMIT_STATUS.find((x) => x.value === text);
        return (
          <Tooltip title={status?.label}>
            <Tag color={statusColor[text]}>{status?.label}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_: any, record: any) => (
        <Space size={"small"}>
          <Tooltip title={"Xem"}>
            <Button
              type="primary"
              disabled={record.deletedAt}
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/permit/view/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={"Sửa"}>
            <Button
              size="small"
              disabled={record.deletedAt || !record.canEdit}
              icon={<EditOutlined />}
              onClick={() => navigate(`/permit/update/${record.id}`)}
              style={
                !record.deletedAt && record.canEdit
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
              type="primary"
              disabled={!record.canDelete}
              size="small"
              icon={<DeleteOutlined />}
              onClick={() =>
                modal.confirm({
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa giấy phép này?",
                  async onOk() {
                    await deletePermitMutation.mutateAsync(record.id);
                    console.log("Đã xóa");
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
    <Spin spinning={isLoadingTemplate}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2">
            Trang quản lý giấy phép
          </h1>
          <p>Theo dõi và quản lý danh sách giấy phép</p>
        </div>

        <Tooltip
          title={
            AuthCommonService.isAdmin()
              ? "Tạo giấy phép mới"
              : "Chỉ quản trị viên mới có thể tạo giấy phép"
          }
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenModalSelect}
          >
            Tạo giấy phép
          </Button>
        </Tooltip>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <Form
          form={searchForm}
          layout="vertical"
          onValuesChange={(_, values) => handleFilter(values)}
        >
          <Row gutter={16}>
            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Tên giấy phép:" name="name">
                <Input placeholder="Nhập tên giấy phép" allowClear />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Loại bản mẫu:" name="templateName">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Nhập loại bản mẫu"
                  options={
                    listTemplates?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Ngày bắt đầu:" name="startTime">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày bắt đầu"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Ngày kết thúc:" name="endTime">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Trạng thái:" name="status">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Nhập trạng thái"
                  options={
                    PERMIT_STATUS.map((item) => ({
                      label: item.label,
                      value: item.value,
                    })) || []
                  }
                />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Người tạo:" name="createdBy">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Nhập người tạo"
                  options={
                    listUsers?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Thiết bị:" name="devices">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Nhập thiết bị"
                  options={
                    listDevices?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} lg={6}>
              <Form.Item label="Công việc:" name="workActivities">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Nhập công việc"
                  options={
                    listWorkActivities?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Space className="w-full flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              handleRefreshSearch();
            }}
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
            onClick={async () => await downloadFile("permit", message)}
          >
            Export
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        bordered
        loading={
          isLoading ||
          deletePermitMutation.isPending ||
          getDetailPermitMutation.isPending
        }
        scroll={{ x: "max-content" }}
        dataSource={
          listPermits?.res?.map((item: any) => ({
            ...item,
            createdAt: formatDate(item.createdAt),
            startDate: formatDate(item.startDate),
            endDate: formatDate(item.endDate),
          })) || []
        }
        rowKey="id"
        pagination={{
          pageSizeOptions: ["1", "5", "10", "20", "50", "100"],
          pageSize: filter.limit,
          total: listPermits?.count || 10,
          current: filter.page,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) =>
            setFilter((pre) => ({ ...pre, page, limit: pageSize })),
        }}
      />

      <SelectTemplateModal
        dispatch={dispatch}
        modalForm={modalForm}
        templateDdl={templateDdl}
        openModalSelect={openModalSelect}
        handleCloseModalSelect={handleCloseModalSelect}
        handleOpenCreatePermit={handleOpenCreatePermit}
      />

      <CreatePermitDrawer
        state={state}
        dispatch={dispatch}
        openCreatePermit={openCreatePermit}
        handleCloseCreatePermit={handleCloseCreatePermit}
      />
    </Spin>
  );
}
