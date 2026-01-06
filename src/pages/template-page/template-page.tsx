import { AuthCommonService } from "@/common/authentication";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
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
import { useShowConfirm } from "@/common/hooks/useShowConfirm";
import { useNotification } from "@/common/hooks/useNotification";
import type { AxiosError } from "axios";
import { useCreateTemplate } from "./components/create-template/create-template-service";
import { downloadFile } from "@/common/common-services/downloadFile";

export default function TemplatePage() {
  const { state, dispatch } = useCreateTemplate();
  const confirm = useShowConfirm();
  const notify = useNotification();
  const { message } = App.useApp();
  const [action, setAction] = useState({ create: false, edit: false });
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
                  notify("error", "Lấy dữ liệu thất bại", "Vui lòng thử lại");
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
                confirm(
                  "Xác nhận xóa",
                  "Bạn có chắc chắn muốn xóa không?",
                  async () => {
                    try {
                      await deleteMutation.mutateAsync(record.id);
                      notify("success", "Xóa mẫu thành công", "");
                      form.resetFields();
                    } catch (error: unknown) {
                      const axiosError = error as AxiosError<{
                        message?: string;
                      }>;
                      const msg =
                        axiosError.response?.data?.message ||
                        "Đã có lỗi xảy ra";
                      notify("error", "Xóa mẫu thất bại", msg);
                    }
                  }
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2 align-center">
            Trang quản lý mẫu giấy phép
          </h1>
          <p>Theo dõi và quản lý danh sách mẫu giấy phép</p>
        </div>
        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setAction({ create: true, edit: false });
            setOpenAddTemplateModal(true); // mở drawer ngay
            setLoading(true); // bật spinner
            setTimeout(() => setLoading(false), 200); // mô phỏng delay cho UX mượt
          }}
        >
          Thêm mẫu
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200  mb-6">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, values) => debounceUpdateFilter(values)}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="search" label="Tìm kiếm mẫu">
                <Input
                  placeholder="Nhập từ khóa..."
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="templateTypeId" label="Danh mục">
                <Select
                  placeholder="Chọn danh mục"
                  options={templateTypeData?.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="status" label="Trạng thái">
                <Select
                  placeholder="Chọn trạng thái"
                  options={[
                    { label: "Hoạt động", value: "active" },
                    { label: "Không hoạt động", value: "inactive" },
                  ]}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space className="flex justify-end w-full ">
          <Button
            onClick={() => {
              form.resetFields();
              const value = form.getFieldsValue();
              setFilter((pre) => ({ ...pre, ...value }));
            }}
            type="primary"
            icon={<ReloadOutlined />}
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
            onClick={() => downloadFile("template", message)}
          >
            Export
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        rowKey={"id"}
        loading={isLoading}
        dataSource={tableDatasource}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSizeOptions: ["1", "5", "10", "20", "50", "100"],
          pageSize: filter.limit,
          total: templateData?.count,
          current: filter.page,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) =>
            setFilter((pre) => ({ ...pre, page, limit: pageSize })),
        }}
      />

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
