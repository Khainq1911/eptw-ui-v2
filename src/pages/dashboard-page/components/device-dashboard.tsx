import {
  useGetDeviceStatusStats,
  useGetDeviceUsedStats,
  useGetTemplateApprovalTypeStats,
  useGetTemplateTypeStats,
} from "@/services/dashboard.service";
import { Row, Col } from "antd";

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
  CartesianGrid,
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
      <div className="space-y-6 animate-pulse">
        <Row gutter={[24, 24]}>
          {[...Array(4)].map((_, i) => (
            <Col key={i} xs={24} lg={12}>
              <div className="bg-gray-100/50 rounded-xl p-6 border border-gray-100 h-[400px]">
                <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                <div className="flex-1 flex flex-col gap-4 justify-end h-64 border-l-2 border-b-2 border-gray-200">
                  <div className="flex gap-2 items-end h-full px-4">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className="flex-1 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          ) )}
        </Row>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 min-h-[400px]">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Trạng thái thiết bị</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="count" name="Số lượng" radius={[4, 4, 0, 0]}>
                  {deviceStatusData?.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 min-h-[400px]">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Tình trạng sử dụng thiết bị</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceUsedData}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={100}
                  label
                  cx="50%"
                  cy="50%"
                >
                  {deviceUsedData?.map((_: any, index: any) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 min-h-[400px]">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Loại hình phê duyệt mẫu</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateApprovalTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="count" name="Số lượng" radius={[4, 4, 0, 0]}>
                  {templateApprovalTypeData?.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 min-h-[400px]">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Loại công việc</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={templateTypeData}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={100}
                  label
                  cx="50%"
                  cy="50%"
                >
                  {templateTypeData?.map((_: any, index: any) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}

