import {
  CalendarOutlined,
  CheckSquareOutlined,
  EditOutlined,
  FileTextOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Collapse } from "antd";

export default function SidebarModal() {
  const Items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2 text-lg font-medium">
          <FileTextOutlined /> Text
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Heading
          </div>
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Paragraph
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2 text-lg font-medium">
          <EditOutlined /> Input
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Single input
          </div>
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Text area
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2 text-lg font-medium">
          <CalendarOutlined /> Date
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Date picker
          </div>
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Range picker
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span className="flex items-center gap-2 text-lg font-medium">
          <CheckSquareOutlined /> Checkbox
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Radio
          </div>
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Checkbox
          </div>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <span className="flex items-center gap-2 text-lg font-medium">
          <TableOutlined /> Table
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
            Table
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-[400px] h-full p-4 bg-white shadow flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Danh sách thẻ</h2>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <Collapse items={Items} className="border rounded-lg" />
      </div>
    </div>
  );
}
