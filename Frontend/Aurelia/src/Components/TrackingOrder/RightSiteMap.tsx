import "leaflet/dist/leaflet.css";
import React, { useEffect,  useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { Icon, LatLngExpression, LatLngTuple } from "leaflet";


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
  }, [id]);




  return (
    <div className="relative w-full z-50">
      <MapContainer
        center={(shop || shipper) as LatLngExpression}
        zoom={4}
        className="w-full h-[100vh]  "
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
                weight: 7,
                opacity: 0.85,
              }}
            />
            <FitMap route={route} />
          </>
        )}
      </MapContainer>    
    </div>
  );
};

export default RightSiteMap;
