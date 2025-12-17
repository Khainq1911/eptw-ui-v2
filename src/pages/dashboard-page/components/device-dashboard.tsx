import {
  useGetDeviceStatusStats,
  useGetDeviceUsedStats,
  useGetTemplateApprovalTypeStats,
  useGetTemplateTypeStats,
} from "@/services/dashboard.service";
import { Spin } from "antd";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DeviceDashboard() {
  const { data: deviceStatusData, isLoading: isLoadingStatus } =
    useGetDeviceStatusStats();

  const { data: deviceUsedData, isLoading: isLoadingUsed } =
    useGetDeviceUsedStats();

  const {
    data: templateApprovalTypeData,
    isLoading: isLoadingTemplateApprovalType,
  } = useGetTemplateApprovalTypeStats();

  const { data: templateTypeData, isLoading: isLoadingTemplateType } =
    useGetTemplateTypeStats();
  if (
    isLoadingStatus ||
    isLoadingUsed ||
    isLoadingTemplateApprovalType ||
    isLoadingTemplateType
  ) {
    return (
      <div className="flex justify-center items-center h-60">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      <div style={cardStyle}>
        <h2 className="text-lg font-bold mb-4">Trạng thái thiết bị</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deviceStatusData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend formatter={() => "Số lượng"} />
            <Bar dataKey="count">
              {deviceStatusData?.map((_: any, index: number) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 className="text-lg font-bold mb-4">Tình trạng sử dụng thiết bị</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={deviceUsedData}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
              label
            >
              {deviceUsedData?.map((_: any, index: any) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 className="text-lg font-bold mb-4">Loại hình phê duyệt mẫu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={templateApprovalTypeData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend formatter={() => "Số lượng"} />
            <Bar dataKey="count">
              {templateApprovalTypeData?.map((_: any, index: number) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 className="text-lg font-bold mb-4">Loại công việc</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={templateTypeData}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
              label
            >
              {templateTypeData?.map((_: any, index: any) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 8,
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
