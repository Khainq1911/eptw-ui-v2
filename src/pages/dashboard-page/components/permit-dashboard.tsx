import {
  useGetPermitStatusStats,
  useGetPermitTemplateStats,
  useGetPermitTypeStats,
} from "@/services/dashboard.service";
import { Col, Row, Empty } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
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
      <div className="space-y-8 animate-pulse">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <div className="bg-gray-100/50 rounded-xl h-[300px] border border-gray-100 flex flex-col p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={16}>
             <div className="bg-gray-100/50 rounded-xl h-[300px] border border-gray-100 flex flex-col p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
              <div className="flex-1 flex flex-col gap-4 justify-end">
                <div className="flex gap-2 items-end h-32">
                   {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 100}%` }}></div>
                   ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="bg-gray-100/50 rounded-xl h-[350px] border border-gray-100 flex flex-col p-6">
           <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
           <div className="flex-1 flex flex-col gap-4 justify-end">
              <div className="flex gap-2 items-end h-40">
                 {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 100}%` }}></div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <div className="bg-white shadow-sm rounded-xl p-6 h-full border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Theo mẫu giấy phép</h2>
            {templateChartData.length === 0 ? (
              <Empty />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={templateChartData}
                      dataKey="count"
                      nameKey="name"
                      isAnimationActive
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {templateChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Col>
        
        <Col xs={24} lg={16}>
          <div className="bg-white shadow-sm rounded-xl p-6 h-full border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Theo người dùng</h2>
            {roleChartData.length === 0 ? (
              <Empty />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" align="right" iconType="circle" />
                    <Bar dataKey="count" name="Số lượng" radius={[4, 4, 0, 0]}>
                      {roleChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Theo trạng thái</h2>
            {statusChartData.length === 0 ? (
              <Empty />
            ) : (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" align="right" />
                    <Bar dataKey="count" name="Số lượng" radius={[4, 4, 0, 0]}>
                      {statusChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
