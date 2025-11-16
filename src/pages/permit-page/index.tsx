import { AuthCommonService } from "@/common/authentication";
import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import SelectTemplateModal from "./components/select-template-modal";
import { usePermitHooks } from "./services";
import CreatePermitDrawer from "./components/create-permit-drawer";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "@/common/common-services/formatTime";

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
    statusColor,
    isLoading,
    searchForm,
    handleRefreshSearch,
    dispatch,
    handleOpenCreatePermit,
    handleCloseCreatePermit,
    handleCloseModalSelect,
    handleOpenModalSelect,
  } = usePermitHooks();

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
      render: (
        text:
          | "pending"
          | "approved"
          | "rejected"
          | "expired"
          | "canceled"
          | "closed"
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
      render: (_: any, __: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa giấy phép">
            <Button icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
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
            disabled={!AuthCommonService.isAdmin()}
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
              console.log(modalForm);
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
          >
            Export
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        bordered
        loading={isLoading}
        scroll={{ x: "max-content" }}
        dataSource={
          listPermits?.map((item: any) => ({
            ...item,
            createdAt: formatDate(item.createdAt),
            startDate: formatDate(item.startDate),
            endDate: formatDate(item.endDate),
          })) || []
        }
        rowKey="id"
      />

      <SelectTemplateModal
        dispatch={dispatch}
        modalForm={modalForm}
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
    </div>
  );
}
