import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { Icon, LatLngExpression, LatLngTuple } from "leaflet";
import { CheckCircle, Clock1, Home, Package, Truck } from "lucide-react";

export type RightProps = {
  data: any;
};

// ICONS -----------------------------------------------------
const shopIcon: Icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const shipperIcon: Icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const customerIcon: Icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Fit map to route -------------------------------------------
const FitMap: React.FC<{ route: [number, number][] }> = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) map.fitBounds(route);
  }, [route]);
  return null;
};

// Main Component ---------------------------------------------
export const RightSiteMap: React.FC<RightProps> = ({ data }) => {
  const apiKey = "pk.fd3f99a25f3d03893a6936b3b255288c";
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const status = data?.data?.status;

  // Convert status → index
  const statusIndex = useMemo(() => {
    const table: Record<string, number> = {
      "Chờ Xác Nhận": 0,
      "Xác Nhận": 1,
      "Đóng Gói": 2,
      "Đang giao": 3,
      "Đã Giao": 4,
    };
    return table[status] ?? 0;
  }, [status]);

  const shop = data ? [data.lat, data.ion] as LatLngTuple : null;
  const customer = data?.data 
    ? [data.data.lat, data.data.ion] as LatLngTuple 
    : null;
  const shipperPosition: LatLngTuple = [10.762622, 106.660172];

  // Fetch route -------------------------------------------------
  useEffect(() => {
    if (!shop || !customer) return;

    const fetchRoute = async () => {
      try {
        const coords = `${shop[1]},${shop[0]};${customer[1]},${customer[0]}`;
        const res = await fetch(
          `https://us1.locationiq.com/v1/directions/driving/${coords}?key=${apiKey}&geometries=geojson`
        );
        const json = await res.json();

        const geo = json.routes?.[0]?.geometry?.coordinates ?? [];
        setRoute(geo.map(([lon, lat]: [number, number]) => [lat, lon]));
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoute();
  }, [shop, customer]);

  const icons = [<Clock1 />, <CheckCircle />, <Package />, <Truck />, <Home />];

  return (
    <div className="relative w-full">
      {/* MAP AREA */}
      <MapContainer
        center={(shop || [10.762622, 106.660172]) as LatLngExpression}
        zoom={14}
        style={{
          height: "90vh",
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {shop && <Marker position={shop} icon={shopIcon} />}
        {customer && <Marker position={customer}  icon={customerIcon} />}
        {shipperPosition && <Marker position={shipperPosition} icon={shipperIcon} />}

        {route.length > 0 && (
          <>
            <Polyline positions={route} pathOptions={{ color: "#4CAF50", weight: 5, opacity: 0.8 }} />
            <FitMap route={route} />
          </>
        )}
      </MapContainer>

      {/* TRACKING STATUS CARD */}
      <div className="absolute top-4 right-4 bg-gray-800/80 text-white rounded-2xl p-4 w-60 z-[999] shadow-xl backdrop-blur">
        <h2 className="text-center font-semibold mb-2">Trạng thái đơn hàng</h2>

        <div className="flex flex-col items-center py-2">
          {icons.map((icon, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Status Icon */}
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-300 
                ${
                  statusIndex === index
                    ? "bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 scale-110 shadow-green-500/40"
                    : "bg-gray-700 w-11 h-11 opacity-70"
                }`}
              >
                {icon}
              </div>

              {/* Line between icons */}
              {index < icons.length - 1 && (
                <div
                  className={`w-1 h-[70px] transition-all duration-500 ${
                    statusIndex > index
                      ? "bg-gradient-to-b from-green-400 to-green-600"
                      : "bg-white/40"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Text status */}
        <div className="text-center mt-2 text-sm opacity-90">
          {status}
        </div>

        <div className="text-xs text-center opacity-70 mt-1">
          Cập nhật lần cuối:{" "}
          {new Date(data?.data?.tracking?.updateTime).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
