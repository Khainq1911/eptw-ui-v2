import { AuthCommonService } from "@/common/authentication";
import {
  DeleteOutlined,
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
  Table,
  Tag,
  Tooltip,
} from "antd";
import AddTemplateModal from "./components/create-template/create-template-drawer";
import {
  TemplateService,
  useDeleteTemplate,
  useGetListTemplateTypes,
  useGetTemplateById,
  useListTemplates,
} from "./template-services";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "@/common/common-services/formatTime";
import type { AxiosError } from "axios";
import { useCreateTemplate } from "./components/create-template/create-template-service";
import { downloadFile } from "@/common/common-services/downloadFile";

export default function TemplatePage() {
  const { state, dispatch } = useCreateTemplate();
  const { message, notification, modal } = App.useApp();
  const [action, setAction] = useState<{
    create: boolean;
    edit: boolean;
    view?: boolean;
  }>({ create: false, edit: false, view: false });
  const [form] = Form.useForm();
  const { openAddTemplateModal, setOpenAddTemplateModal } = TemplateService();
  const [filter, setFilter] = useState({ limit: 5, page: 1 });
  const { data: templateData, isLoading } = useListTemplates(filter);
  const { data: templateTypeData } = useGetListTemplateTypes();
  const getTemplateByIdMutation = useGetTemplateById();
  const [loading, setLoading] = useState(false);

  const deleteMutation = useDeleteTemplate();
  const debounceUpdateFilter = useMemo(
    () =>
      debounce((values) => {
        setFilter((pre) => ({ ...pre, ...values }));
      }, 300),
    [setFilter]
  );

  const tableDatasource = useMemo(() => {
    if (!templateData) return [];
    return templateData?.data?.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      templateType: item.templateType.name,
      approvalType: item.approvalType.name,
      deletedAt: item.deletedAt,
      createdAt: formatDate(item.createdAt),
      updatedAt: formatDate(item.updatedAt),
    }));
  }, [templateData]);

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, _record: any, index: number) => index + 1,
      width: 80,
    },
    { title: "Tên mẫu", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Loại mẫu",
      dataIndex: "templateType",
      key: "templateType",
      width: 150,
    },
    {
      title: "Loại ký",
      dataIndex: "approvalType",
      key: "signType",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_: any, record: any) =>
        record.deletedAt ? (
          <Tag color="red">Không hoạt động</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 180 },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size={"small"}>
          <Tooltip title={"Xem chi tiết"}>
            <Button
              size="small"
              onClick={async () => {
                setAction({ create: false, edit: false, view: true });
                setOpenAddTemplateModal(true);
                setLoading(true);
                try {
                  const res = await getTemplateByIdMutation.mutateAsync(
                    record.id
                  );
                  dispatch({
                    type: "SET_DATA",
                    payload: {
                      ...res,
                      templateTypeId: res.templateType.id,
                      approvalTypeId: res.approvalType.id,
                    },
                  });
                } catch (error) {
                  console.error(error);
                  notification.error({ message: "Lấy dữ liệu thất bại", description: "Vui lòng thử lại", placement: "topRight", duration: 3 });
                } finally {
                  setLoading(false);
                }
              }}
              icon={<EyeOutlined />}
              type="primary"
            />
          </Tooltip>
          <Tooltip title={"Sửa"}>
            <Button
              size="small"
              onClick={async () => {
                setAction({ create: false, edit: true });
                setOpenAddTemplateModal(true); // mở drawer ngay
                setLoading(true); // bật spinner trong drawer
                try {
                  const res = await getTemplateByIdMutation.mutateAsync(
                    record.id
                  );
                  dispatch({
                    type: "SET_DATA",
                    payload: {
                      ...res,
                      templateTypeId: res.templateType.id,
                      approvalTypeId: res.approvalType.id,
                    },
                  });
                } catch (error) {
                  console.error(error);
                  notification.error({ message: "Lấy dữ liệu thất bại", description: "Vui lòng thử lại", placement: "topRight", duration: 3 });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={record.deletedAt || !AuthCommonService.isAdmin()}
              icon={<EditOutlined />}
              style={
                !(record.deletedAt || !AuthCommonService.isAdmin())
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
              disabled={record.deletedAt || !AuthCommonService.isAdmin()}
              size="small"
              icon={<DeleteOutlined />}
              onClick={() =>
                modal.confirm({
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa không?",
                  okText: "Confirm",
                  cancelText: "Cancel",
                  onOk: async () => {
                    try {
                      await deleteMutation.mutateAsync(record.id);
                      notification.success({ message: "Xóa mẫu thành công", description: "", placement: "topRight", duration: 3 });
                      form.resetFields();
                    } catch (error: unknown) {
                      const axiosError = error as AxiosError<{
                        message?: string;
                      }>;
                      const msg =
                        axiosError.response?.data?.message ||
                        "Đã có lỗi xảy ra";
                      notification.error({ message: "Xóa mẫu thất bại", description: msg, placement: "topRight", duration: 3 });
                    }
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
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Quản lý mẫu giấy phép
          </h1>
          <p className="text-slate-500 font-medium">Thiết kế và quản lý cấu trúc các bản mẫu giấy phép</p>
        </div>
        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setAction({ create: true, edit: false });
            setOpenAddTemplateModal(true);
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="h-10 sm:h-12 px-6 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          Thêm mẫu mới
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Bộ lọc & Tìm kiếm</h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, values) => debounceUpdateFilter(values)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Form.Item 
              name="search" 
              label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tìm kiếm mẫu</span>}
              className="!mb-0"
            >
              <Input
                placeholder="Nhập tên mẫu..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                style={{ height: '30px' }}
              />
            </Form.Item>
            <Form.Item 
              name="templateTypeId" 
              label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục</span>}
              className="!mb-0"
            >
              <Select
                placeholder="Chọn danh mục"
                style={{ height: '30px' }}
                options={templateTypeData?.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
                allowClear
              />
            </Form.Item>
            <Form.Item 
              name="status" 
              label={<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</span>}
              className="!mb-0"
            >
              <Select
                placeholder="Chọn trạng thái"
                style={{ height: '30px' }}
                options={[
                  { label: "Hoạt động", value: "active" },
                  { label: "Không hoạt động", value: "inactive" },
                ]}
                allowClear
              />
            </Form.Item>
          </div>

          <div className="flex justify-end items-center gap-3">
            <Button
              onClick={() => {
                form.resetFields();
                const value = form.getFieldsValue();
                setFilter((pre) => ({ ...pre, ...value }));
              }}
              className="h-8 px-4 rounded-lg font-semibold border-gray-200 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors"
              icon={<ReloadOutlined />}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadFile("template", message)}
              className="h-8 px-6 bg-emerald-600 hover:bg-emerald-700 border-none rounded-lg font-semibold shadow-sm shadow-emerald-50 flex items-center justify-center transition-all active:scale-95"
            >
              Export
            </Button>
          </div>
        </Form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Danh sách mẫu giấy phép</h2>
        </div>
        <Table
          columns={columns}
          rowKey={"id"}
          loading={isLoading}
          dataSource={tableDatasource}
          scroll={{ x: "max-content" }}
          bordered={false}
          className="template-table"
          pagination={{
            pageSizeOptions: ["10", "20", "50", "100"],
            pageSize: filter.limit,
            total: templateData?.count,
            current: filter.page,
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) =>
              setFilter((pre) => ({ ...pre, page, limit: pageSize })),
          }}
        />
      </div>

      {/* Drawer */}
      <AddTemplateModal
        loading={loading}
        setAction={setAction}
        action={action}
        state={state}
        dispatch={dispatch}
        openAddTemplateModal={openAddTemplateModal}
        setOpenAddTemplateModal={setOpenAddTemplateModal}
      />
    </div>
  );
}
