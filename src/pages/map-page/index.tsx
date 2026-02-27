import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  useGetListDeviceLocation,
  useGetListNotification,
} from "@/services/device.service";
import React, { useEffect, useMemo, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
// Fix icon leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { socket } from "@/configs/socket";
import { App, Badge, Card, Empty, Pagination, Spin, Tabs, Tag } from "antd";
import {
  EnvironmentOutlined,
  BellOutlined,
  AlertOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface DeviceLocation {
  id: number;
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
  } | null;
}

interface NotificationItem {
  id: number;
  deviceId: number;
  type: string;
  message: string;
  detail: any;
  timestamp: string;
  createdAt: string;
}

function FitBounds({ devices }: { devices: DeviceLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (!devices.length) return;

    const bounds = L.latLngBounds(
      devices.map((d) => [d.location!.lat, d.location!.lng])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [devices, map]);

  return null;
}

// ─── Map Tab Content ───────────────────────────────────────────────
function MapTabContent({
  devices,
  isLoading,
}: {
  devices: DeviceLocation[];
  isLoading: boolean;
}) {
  if (isLoading) return <div>Loading map...</div>;

  return (
    <MapContainer
      zoom={10}
      style={{ height: "70vh", width: "100%" }}
      center={[21.00434, 105.84702]}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds devices={devices} />

      {devices.map((device: DeviceLocation) => (
        <Marker
          key={device.id}
          position={[device.location!.lat, device.location!.lng]}
        >
          <Popup>
            <b>{device.name}</b>
            <br />
            Mã: {device.code}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// ─── Notification Tab Content ──────────────────────────────────────
function NotificationTabContent({
  socketNotifications,
}: {
  socketNotifications: NotificationItem[];
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetListNotification({
    limit: pageSize,
    page,
  });

  // On page 1: prepend socket notifications, deduplicate, slice to keep pageSize
  // On other pages: just show API data
  const items: NotificationItem[] = useMemo(() => {
    const apiItems: NotificationItem[] = data || [];
    if (page === 1 && socketNotifications.length > 0) {
      const socketIds = new Set(socketNotifications.map((n) => n.id));
      const filteredApi = apiItems.filter((n) => !socketIds.has(n.id));
      return [...socketNotifications, ...filteredApi].slice(0, pageSize);
    }
    return apiItems;
  }, [data, socketNotifications, page, pageSize]);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getTypeConfig = (type: string) => {
    if (type === "location") {
      return {
        color: "#1677ff",
        bg: "#e6f4ff",
        border: "#91caff",
        icon: <EnvironmentOutlined style={{ fontSize: 22, color: "#1677ff" }} />,
        label: "Vị trí",
        tagColor: "blue",
      };
    }
    if (type === "warning") {
      return {
        color: "#ff4d4f",
        bg: "#fff2f0",
        border: "#ffccc7",
        icon: <WarningOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />,
        label: "Cảnh báo",
        tagColor: "red",
      };
    }
    return {
      color: "#fa8c16",
      bg: "#fff7e6",
      border: "#ffd591",
      icon: <AlertOutlined style={{ fontSize: 22, color: "#fa8c16" }} />,
      label: "Thông báo",
      tagColor: "orange",
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const renderDetailValue = (key: string, value: any) => {
    if (key === "severity") {
      return <Tag color={getSeverityColor(value)}>{String(value).toUpperCase()}</Tag>;
    }
    return <span>{String(value)}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!items.length) {
    return <Empty description="Chưa có thông báo nào" />;
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const config = getTypeConfig(item.type);
          return (
            <Card
              key={item.id}
              size="small"
              style={{
                borderLeft: `4px solid ${config.color}`,
                background: config.bg,
                borderColor: config.border,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              hoverable
              styles={{ body: { padding: "12px 16px" } }}
              onClick={() =>
                setExpandedId((prev) => (prev === item.id ? null : item.id))
              }
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#fff",
                    border: `1px solid ${config.border}`,
                    flexShrink: 0,
                  }}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag color={config.tagColor}>{config.label}</Tag>
                    <span
                      className="flex items-center gap-1"
                      style={{ fontSize: 12, color: "#8c8c8c" }}
                    >
                      <MobileOutlined /> Device #{item.deviceId}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#262626",
                    }}
                  >
                    {item.message}
                  </p>
                  <span
                    className="flex items-center gap-1 mt-1"
                    style={{ fontSize: 12, color: "#8c8c8c" }}
                  >
                    <ClockCircleOutlined />
                    {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </span>

                  {expandedId === item.id && item.detail && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: "8px 12px",
                        background: "#fff",
                        borderRadius: 6,
                        fontSize: 13,
                        color: "#595959",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <b>Chi tiết:</b>
                      {item.type === "location" && item.detail?.lat ? (
                        <div style={{ marginTop: 8 }}>
                          <div
                            style={{
                              display: "flex",
                              gap: 16,
                              marginBottom: 8,
                              fontSize: 13,
                            }}
                          >
                            <span>📍 Lat: <code>{item.detail.lat}</code></span>
                            <span>📍 Lng: <code>{item.detail.lng}</code></span>
                          </div>
                          <div
                            style={{
                              borderRadius: 8,
                              overflow: "hidden",
                              border: "1px solid #d9d9d9",
                            }}
                          >
                            <MapContainer
                              key={`notify-map-${item.id}-${item.detail.lat}-${item.detail.lng}`}
                              center={[item.detail.lat, item.detail.lng]}
                              zoom={15}
                              style={{ height: 200, width: "100%" }}
                              scrollWheelZoom={false}
                              dragging={false}
                              zoomControl={false}
                              attributionControl={false}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker
                                position={[item.detail.lat, item.detail.lng]}
                              >
                                <Popup>
                                  <b>Device #{item.deviceId}</b>
                                  <br />
                                  Lat: {item.detail.lat}, Lng: {item.detail.lng}
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                        </div>
                      ) : typeof item.detail === "object" && item.detail !== null ? (
                        <div
                          style={{
                            marginTop: 8,
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            gap: "6px 12px",
                            alignItems: "center",
                          }}
                        >
                          {Object.entries(item.detail).map(([key, value]) => (
                            <React.Fragment key={key}>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: "#595959",
                                  textTransform: "capitalize",
                                }}
                              >
                                {key}:
                              </span>
                              <span style={{ color: "#262626" }}>
                                {renderDetailValue(key, value)}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <pre
                          style={{
                            margin: "4px 0 0",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            fontSize: 12,
                          }}
                        >
                          {JSON.stringify(item.detail, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data?.total || 0}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function MapPage() {
  const { notification: notify } = App.useApp();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [devices, setDevices] = useState<DeviceLocation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const { data: LocationData, isLoading } = useGetListDeviceLocation();

  // Sync react-query data into local state
  useEffect(() => {
    if (LocationData) {
      setDevices(LocationData.filter((d: DeviceLocation) => d.location));
    }
  }, [LocationData]);

  useEffect(() => {
    function onConnect() {
      console.log("Connected to server", isConnected);
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Disconnected from server", isConnected);
      setIsConnected(false);
    }

    function onNotification(data: any) {
      console.log(data.type);
      console.log("From server:", data);

      if (data.type === "location") {
        console.log("Device not in list -> add new entry");
        const { deviceId, message: msg, detail } = data;

        console.log("Device exists -> update its location");
        setDevices((prev) => {
          const existingIndex = prev.findIndex((d) => d.id === deviceId);
          if (existingIndex !== -1) {
            // Device exists -> update its location
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              location: { lat: detail?.lat, lng: detail?.lng },
            };
            return updated;
          } else {
            // Device not in list -> add new entry
            const newDevice: DeviceLocation = {
              id: deviceId,
              name: msg || `Device ${deviceId}`,
              code: `DEV-${deviceId}`,
              location: { lat: detail?.lat, lng: detail?.lng },
            };
            return [...prev, newDevice];
          }
        });
      }
      // Always add to notifications list (all types)
      setNotifications((prev) => [data, ...prev]);
      // Show toast notification
      notify.info({
        message: data.type === "location" ? "Cập nhật vị trí" : "Thông báo mới",
        description: data.message,
        placement: "topRight",
        duration: 3,
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification", onNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("notification", onNotification);
    };
  }, []);

  const tabItems = [
    {
      key: "map",
      label: (
        <span>
          <EnvironmentOutlined /> Bản đồ
        </span>
      ),
      children: <MapTabContent devices={devices} isLoading={isLoading} />,
    },
    {
      key: "notifications",
      label: (
        <span>
          <BellOutlined /> Thông báo
          {notifications.length > 0 && (
            <Badge
              count={notifications.length}
              size="small"
              style={{ marginLeft: 6 }}
            />
          )}
        </span>
      ),
      children: <NotificationTabContent socketNotifications={notifications} />,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2">
            Bản đồ & Thông báo
          </h1>
          <p>Theo dõi vị trí thiết bị và nhận thông báo</p>
        </div>
      </div>
      <Tabs defaultActiveKey="map" items={tabItems} />
    </div>
  );
}
