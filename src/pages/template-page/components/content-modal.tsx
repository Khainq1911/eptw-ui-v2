import { PlusOutlined } from "@ant-design/icons";
import { Button} from "antd";


export default function ContentModal() {
  return (
    <main className="flex-1 overflow-y-auto p-8 bg-slate-50 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Permit to Work
          </h1>
          <p className="text-slate-600">
            Quản lý và theo dõi các yêu cầu bảo trì an toàn
          </p>
        </div>

        <Button className="w-full" type="primary" icon={<PlusOutlined />}>
           Thêm phần mới
        </Button>
      </div>
    </main>
  );
}
