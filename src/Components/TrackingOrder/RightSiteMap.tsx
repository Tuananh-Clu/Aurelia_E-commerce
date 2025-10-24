import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { CheckCircle, Clock1, Home, Package, Truck } from "lucide-react";

export type RightProps = {
  data: any;
};

const shopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const FitMap: React.FC<{ route: [number, number][] }> = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route, map]);
  return null;
};
const shipperIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});
let indexs = 0;
const stateMentStatus = (status: string) => {
  switch (status) {
    case "Chờ Xác Nhận":
      return (indexs = 0);
    case "Xác Nhận":
      return (indexs = 1);
    case "Đóng Gói":
      return (indexs = 2);
    case "Đang giao":
      return (indexs = 3);
    case "Đã Giao":
      return (indexs = 4);
    default:
      return (indexs = 0);
  }
};

const shipperPosition: [number, number] = [10.762622, 106.660172];
export const RightSiteMap: React.FC<RightProps> = ({ data }) => {
  const apiKey = "pk.fd3f99a25f3d03893a6936b3b255288c";
  const [route, setRoute] = useState<[number, number][]>([]);

  const shop: [number, number] | null = data ? [data.lat, data.ion] : null;
  const customer: [number, number] | null = data?.data
    ? [data.data.lat, data.data.ion]
    : null;
  console.log(data);
  useEffect(() => {
    if (!shop || !customer) return;

    const fetchRoute = async () => {
      try {
        const coords = `${shop[1]},${shop[0]};${customer[1]},${customer[0]}`;
        const res = await fetch(
          `https://us1.locationiq.com/v1/directions/driving/${coords}?key=${apiKey}&geometries=geojson`
        );
        const json = await res.json();
        if (json?.routes?.[0]?.geometry?.coordinates) {
          const routeCoords = json.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          );
          setRoute(routeCoords);
        }
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [shop, customer]);

  const center: [number, number] = shop || [0, 0];
  useEffect(() => {
    stateMentStatus(data?.data.status);
  }, [data?.data.status]);
  return (
    <div className="relative w-full ">
      <div className="">
        <MapContainer
          center={center}
          zoom={14}
          style={{
            height: "90vh",
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {shop && (
            <Marker position={shop} icon={shopIcon}>
              <Popup>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  🏬 {data.shopName}
                </div>
              </Popup>
            </Marker>
          )}
          {shipperPosition && (
            <Marker position={shipperPosition} icon={shipperIcon}>
              <Popup>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  🚚 {data?.data?.name}
                </div>
              </Popup>
            </Marker>
          )}
          {customer && (
            <Marker position={customer} icon={customerIcon}>
              <Popup>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  👤 {data.data.name}
                </div>
              </Popup>
            </Marker>
          )}

          {route.length > 0 && (
            <>
              <Polyline
                positions={route}
                color="#4CAF50"
                weight={5}
                opacity={0.8}
              />
              <FitMap route={route} />
            </>
          )}
        </MapContainer>
      </div>
      <div className="absolute top-4 right-4 bg-gray-700/70 text-white rounded-lg p-4 w-56 flex flex-col items-center  z-[1000] shadow-lg">
        <h2 className="font-semibold mb-2">Trạng thái đơn hàng</h2>
        <div className="flex flex-col  items-center">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col items-center">
               <div
                key={index}
                className={`flex items-center justify-center rounded-full transition-all duration-300 shadow-md cursor-pointer ${
                  indexs === index
                    ? "bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 scale-110 shadow-green-500/40"
                    : "bg-gray-700 hover:bg-gray-600 w-10 h-10 opacity-80"
                }`}
              >
                {index === 0 && <span><Clock1/></span>}
                {index === 1 && <span><CheckCircle/></span>}
                {index === 2 && <span><Package/></span>}
                {index === 3 && <span><Truck/></span>}
                {index === 4 && <span><Home/></span>}
                
              </div>
              {index < 4 && (
                <div
                  className={`w-1 h-[70px] ${
                    indexs > index
                      ? "bg-gradient-to-b from-green-400 to-green-600"
                      : "bg-white opacity-60"
                  } transition-all duration-300`}
                ></div>
              )}
              </div> 
            ))}
        </div>

        <div>{data?.data.status}</div>
        <h1 className=" text-xs text-center">Được Cập Nhật Lần Cuối { new Date(data?.data.tracking.updateTime).toLocaleDateString()}</h1>
    </div>
    </div>
  );
}
