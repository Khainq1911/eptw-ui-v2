import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetListDeviceLocation } from "@/services/device.service";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Fix icon leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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

export default function MapPage() {
  const { data: LocationData, isLoading } = useGetListDeviceLocation();

  if (isLoading) return <div>Loading map...</div>;

  const devicesWithLocation =
    LocationData?.filter((d: DeviceLocation) => d.location) ?? [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2">
            Bản đồ thiết bị
          </h1>
          <p>Theo dõi vị trí và trạng thái thiết bị trên bản đồ</p>
        </div>
      </div>
      <MapContainer
        zoom={16}
        style={{ height: "70vh", width: "100%" }}
        center={[21.00434, 105.84702]}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds devices={devicesWithLocation} />

        {devicesWithLocation.map((device: DeviceLocation) => (
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
    </div>
  );
}
