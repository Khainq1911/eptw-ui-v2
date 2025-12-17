import {
  useGetPermitStatusStats,
  useGetPermitTemplateStats,
  useGetPermitTypeStats,
} from "@/services/dashboard.service";
import { Col, Row, Spin, Empty } from "antd";
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

type ChartItem = {
  name: string;
  count: number;
  color?: string;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#D65DB1",
  "#4D96FF",
];

const mapWithColor = (data?: ChartItem[]): ChartItem[] => {
  return (data || []).map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));
};

export default function PermitDashboard({ filterDate }: any) {
  const { data: permitTemplateData, isLoading: isLoadingTemplate } =
    useGetPermitTemplateStats(filterDate);

  const { data: permitStatusData, isLoading: isLoadingStatus } =
    useGetPermitStatusStats(filterDate);

  const { data: permitRoleData, isLoading: isLoadingRole } =
    useGetPermitTypeStats(filterDate);

  const templateChartData = mapWithColor(permitTemplateData);
  const statusChartData = mapWithColor(permitStatusData);
  const roleChartData = mapWithColor(permitRoleData);

  if (isLoadingTemplate || isLoadingStatus || isLoadingRole) {
    return (
      <div className="flex justify-center items-center h-60">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Row justify="space-between">
        <Col span={8} className="bg-white shadow-sm rounded !p-4">
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo mẫu giấy phép</h2>

          {templateChartData.length === 0 ? (
            <Empty />
          ) : (
            <PieChart width={250} height={250} style={{ margin: "0 auto" }}>
              <Pie
                data={templateChartData}
                dataKey="count"
                nameKey="name"
                isAnimationActive
              >
                {templateChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </Col>
        <Col span={15} className="bg-white shadow-sm rounded !p-4">
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo người dùng</h2>

          {roleChartData.length === 0 ? (
            <Empty />
          ) : (
            <BarChart
              width={600}
              height={250}
              data={roleChartData}
              style={{ margin: "0 auto" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend formatter={() => "Số lượng"} />
              <Bar dataKey="count">
                {roleChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </Col>
      </Row>

      <Row>
        <Col span={24} className="bg-white shadow-sm rounded !p-4">
          <h2 className="text-lg font-bold mb-4">Biểu đồ theo trạng thái</h2>

          {statusChartData.length === 0 ? (
            <Empty />
          ) : (
            <BarChart
              width={800}
              height={250}
              data={statusChartData}
              style={{ margin: "0 auto" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend formatter={() => "Số lượng"} />
              <Bar dataKey="count">
                {statusChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </Col>
      </Row>
    </div>
  );
}
