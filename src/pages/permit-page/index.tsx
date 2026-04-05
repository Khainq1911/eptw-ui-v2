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
  DatePicker,
  Form,
  Input,
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
          | "Inprogress"
          | "Completed"
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
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              Quản lý giấy phép
            </h1>
            <p className="text-slate-500 font-medium">Theo dõi và quản lý danh sách giấy phép làm việc trong hệ thống</p>
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
              size="large"
              icon={<PlusOutlined />}
              onClick={handleOpenModalSelect}
              className="h-10 sm:h-12 px-6 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95"
            >
              Tạo giấy phép mới
            </Button>
          </Tooltip>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <h2 className="text-base font-bold text-gray-800 tracking-tight">Bộ lọc & Tìm kiếm</h2>
          </div>

          <Form
            form={searchForm}
            layout="vertical"
            onValuesChange={(_, values) => handleFilter(values)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6">
              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên giấy phép</span>} 
                name="name" 
                className="!mb-0"
              >
                <Input placeholder="Nhập tên giấy phép" allowClear style={{ height: '30px' }} />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loại bản mẫu</span>} 
                name="templateName" 
                className="!mb-0"
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn bản mẫu"
                  style={{ height: '30px' }}
                  options={
                    listTemplates?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngày bắt đầu</span>} 
                name="startTime" 
                className="!mb-0"
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày"
                  style={{ width: "100%", height: '30px' }}
                />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngày kết thúc</span>} 
                name="endTime" 
                className="!mb-0"
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày"
                  style={{ width: "100%", height: '30px' }}
                />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</span>} 
                name="status" 
                className="!mb-0"
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn trạng thái"
                  style={{ height: '30px' }}
                  options={
                    PERMIT_STATUS.map((item) => ({
                      label: item.label,
                      value: item.value,
                    })) || []
                  }
                />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Người tạo</span>} 
                name="createdBy" 
                className="!mb-0"
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn người tạo"
                  style={{ height: '30px' }}
                  options={
                    listUsers?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thiết bị</span>} 
                name="devices" 
                className="!mb-0"
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn thiết bị"
                  style={{ height: '30px' }}
                  options={
                    listDevices?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>

              <Form.Item 
                label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Công việc</span>} 
                name="workActivities" 
                className="!mb-0"
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn công việc"
                  style={{ height: '30px' }}
                  options={
                    listWorkActivities?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </Form.Item>
            </div>
          </Form>

          <div className="flex justify-end items-center gap-3">
            <Button
              onClick={() => {
                handleRefreshSearch();
              }}
              className="h-8 px-4 rounded-lg font-semibold border-gray-200 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors"
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={async () => await downloadFile("permit", message)}
              className="h-8 px-6 bg-emerald-600 hover:bg-emerald-700 border-none rounded-lg font-semibold shadow-sm shadow-emerald-50 flex items-center justify-center transition-all active:scale-95"
            >
              Xuất Excel
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-emerald-600 rounded-full" />
            <h2 className="text-base font-bold text-gray-800 tracking-tight">Danh sách giấy phép</h2>
          </div>
          <Table
            columns={columns}
            bordered={false}
            loading={
              isLoading ||
              deletePermitMutation.isPending ||
              getDetailPermitMutation.isPending
            }
            scroll={{ x: 1400 }}
            className="permit-table"
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
              pageSizeOptions: ["10", "20", "50", "100"],
              pageSize: filter.limit,
              total: listPermits?.count || 0,
              current: filter.page,
              showSizeChanger: true,
              className: "py-4",
              onChange: (page: number, pageSize: number) =>
                setFilter((pre) => ({ ...pre, page, limit: pageSize })),
            }}
          />
        </div>
      </div>

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
