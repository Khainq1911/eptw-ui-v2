import { Col, DatePicker, Row, Segmented } from "antd";
import { useMemo, useState } from "react";
import PermitDashboard from "./components/permit-dashboard";
import DeviceDashboard from "./components/device-dashboard";

const SEGMENT_OPTIONS = [
  { label: "Giấy phép", value: "permit" },
  { label: "Thiết bị", value: "device" },
];
export default function DashboardPage() {
  const [type, setType] = useState("permit");

  const mainContent = useMemo(() => {
    switch (type) {
      case "permit":
        return <PermitDashboard />;
      case "device":
        return <DeviceDashboard />;
      default:
        return <PermitDashboard />;
    }
  }, [type]);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Tổng quan hệ thống
        </h1>
        <p className="text-slate-600">
          Theo dõi nhanh tình trạng giấy phép, thiết bị và hoạt động trong ngày
        </p>
      </div>

      <div className="bg-white border-gray-100 shadow-sm rounded p-4 my-6">
        <h2 className="text-lg font-bold mb-4">Tìm kiếm</h2>
        <Row gutter={16}>
          <Col span={8}>
            <Segmented
              options={SEGMENT_OPTIONS}
              className="w-full"
              block
              onChange={(value) => setType(value.toString())}
            />
          </Col>
          <Col span={8}>
            <DatePicker className="w-full" placeholder="Ngày bắt đầu" />
          </Col>
          <Col span={8}>
            <DatePicker className="w-full" placeholder="Ngày kết thúc" />
          </Col>
        </Row>
      </div>
      {mainContent}
    </div>
  );
}
