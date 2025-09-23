import { AuthCommonService } from "@/common/authentication";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, Table } from "antd";

export default function TemplatePage() {
  const [form] = Form.useForm();
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-0 align-center">
            Trang quản lý mẫu giấy phép
          </h1>
          <p>Theo dõi và quản lý danh sách mẫu giấy phép</p>
        </div>
        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          icon={<PlusOutlined />}
        >
          Thêm mẫu
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex justify-between items-center mb-6">
        <Form form={form} layout="inline">
          <Form.Item>
            <Input
              placeholder="Tìm kiếm mẫu"
              variant="filled"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Select />
          </Form.Item>

          <Form.Item>
            <Select />
          </Form.Item>
        </Form>
        <Button type="primary" icon={<DownloadOutlined />}>
          Export
        </Button>
      </div>
      <Table />
    </div>
  );
}
