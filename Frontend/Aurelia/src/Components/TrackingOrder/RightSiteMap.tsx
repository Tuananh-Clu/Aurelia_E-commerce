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
  id:string | undefined;
};


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


const FitMap: React.FC<{ route: LatLngTuple[] }> = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length) map.fitBounds(route);
  }, [route]);
  return null;
};

const RightSiteMap: React.FC<RightProps> = ({ data,id }: RightProps) => {
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const status = data?.data?.status;

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

  const shop: LatLngTuple | null = data ? [data.lat, data.ion] : null;
  const customer: LatLngTuple | null = data?.data
    ? [data.data.lat, data.data.ion]
    : null;
  const shipper: LatLngTuple = [10.762622, 106.660172];

  useEffect(() => {
    if (!shop || !customer) return;

    const fetchRoute = async () => {
      try {
        const coords = `${shop[1]},${shop[0]};${customer[1]},${customer[0]}`;
        const res = await fetch(
          `https://us1.locationiq.com/v1/directions/driving/${coords}?key=${
            import.meta.env.VITE_LOCATIONIQ_KEY
          }&geometries=geojson`
        );
        const json = await res.json();
        const geo = json.routes?.[0]?.geometry?.coordinates ?? [];
        setRoute(geo.map(([lon, lat]: [number, number]) => [lat, lon]));
      } catch (e) {
        console.error(e);
      }
    };

    fetchRoute();
  }, [id, shop, customer]);

  const icons = [
    <Clock1 />,
    <CheckCircle />,
    <Package />,
    <Truck />,
    <Home />,
  ];


  return (
    <div className="relative w-full">

      <MapContainer
        center={(shop || shipper) as LatLngExpression}
        zoom={14}
        className="w-full h-[70vh] lg:h-[90vh] rounded-2xl shadow-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {shop && <Marker position={shop} icon={shopIcon} />}
        {customer && <Marker position={customer} icon={customerIcon} />}
        <Marker position={shipper} icon={shipperIcon} />

        {route.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#4CAF50",
                weight: 5,
                opacity: 0.85,
              }}
            />
            <FitMap route={route} />
          </>
        )}
      </MapContainer>

      <div className="hidden lg:block absolute top-4 right-4 bg-gray-900/80 text-white rounded-2xl p-4 w-60 z-[999] shadow-xl backdrop-blur">
        <h2 className="text-center font-semibold mb-2">
          Trạng thái đơn hàng
        </h2>

        <div className="flex flex-col items-center py-2">
          {icons.map((icon, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-300
                ${
                  statusIndex === index
                    ? "bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 scale-110"
                    : "bg-gray-700 w-11 h-11 opacity-70"
                }`}
              >
                {icon}
              </div>

              {index < icons.length - 1 && (
                <div
                  className={`w-1 h-[70px] transition-all duration-500 ${
                    statusIndex > index
                      ? "bg-gradient-to-b from-green-400 to-green-600"
                      : "bg-white/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-2 text-sm">{status}</div>
        <div className="text-xs text-center opacity-70 mt-1">
          Cập nhật:{" "}
          {new Date(
            data?.data?.tracking?.updateTime
          ).toLocaleDateString("vi-VN")}
        </div>
      </div>

      <div className="lg:hidden absolute bottom-3 left-3 right-3 z-[999]">
        <div className="bg-gray-900/90 rounded-2xl px-4 py-3 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between">
            {icons.map((icon, index) => (
              <div
                key={index}
                className={`flex flex-col items-center flex-1 transition-all ${
                  index === statusIndex ? "scale-110" : "opacity-50"
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-full ${
                    index === statusIndex
                      ? "bg-green-500 w-10 h-10"
                      : "bg-gray-700 w-8 h-8"
                  }`}
                >
                  {icon}
                </div>

                {index === statusIndex && (
                  <span className="text-[10px] mt-1 font-semibold text-green-400">
                    {status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSiteMap;
