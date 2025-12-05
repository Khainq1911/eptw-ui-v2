import { Col, Row } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Page A", uv: 590 },
  { name: "Page B", uv: 590 },
  { name: "Page C", uv: 868 },
];
const statusData = [
  { name: "Mới tạo", "số lượng": 12, color: "#0088FE" },
  { name: "Đang xử lý", "số lượng": 25, color: "#00C49F" },
  { name: "Hoàn thành", "số lượng": 50, color: "#FFBB28" },
  { name: "Từ chối", "số lượng": 5, color: "#FF8042" },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const userData = [
  { name: "Admin", "số lượng": 5, color: "#8884d8" },
  { name: "Manager", "số lượng": 10, color: "#82ca9d" },
  { name: "User", "số lượng": 50, color: "#ffc658" },
];

const actionData = [
  { name: "Tạo mới", value: 400 },
  { name: "Cập nhật", value: 300 },
  { name: "Xóa", value: 300 },
  { name: "Xem", value: 200 },
];

export default function PermitDashboard() {
  return (
    <div className="space-y-8">
      <Row className="flex justify-between">
        <Col
          span={8}
          className="bg-white border-gray-100 shadow-sm rounded !p-4"
        >
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo mấu giấy phép</h2>
          <PieChart width={250} height={250} style={{ margin: "0 auto" }}>
            <Pie data={data} dataKey="uv" isAnimationActive>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip defaultIndex={2} />
            <Legend />
          </PieChart>
        </Col>

        <Col
          span={15}
          className="border border-gray-100 shadow-sm rounded bg-white !p-4"
        >
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo trạng thái</h2>
          <BarChart
            width={500}
            height={250}
            data={statusData}
            style={{ margin: "0 auto" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="số lượng" fill="#8884d8">
              {statusData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </Col>
      </Row>
      <Row className="flex justify-between">
        <Col
          span={15}
          className="bg-white border-gray-100 shadow-sm rounded !p-4"
        >
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo người dùng</h2>
          <BarChart
            width={500}
            height={250}
            data={userData}
            style={{ margin: "0 auto" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="số lượng">
              {userData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </Col>
        <Col
          span={8}
          className="bg-white border-gray-100 shadow-sm rounded !p-4"
        >
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo hành động</h2>
          <PieChart width={250} height={250} style={{ margin: "0 auto" }}>
            <Pie data={actionData} dataKey="value" isAnimationActive>
              {actionData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Col>
      </Row>
    </div>
  );
}
