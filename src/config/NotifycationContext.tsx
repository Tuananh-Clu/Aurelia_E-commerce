import { createContext, useContext, useEffect, useState } from "react";
import { api_Config, UseApiUrl } from "../types/api";
import axios from "axios";
import { LogLevel } from "@microsoft/signalr/dist/esm/ILogger";
import {
  HubConnectionBuilder,
  HubConnectionState,
  HubConnection,
} from "@microsoft/signalr";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { AuthForShopContext } from "./AuthorForShop";

export const NotificationContext = createContext<any | undefined>({
  message: [],
  appointment: [],
  logOut: async () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [message, setMessage] = useState<string[]>([]);
  const [appointment, setAppointment] = useState<string[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const {setIsignned}=useContext(AuthForShopContext)
  useEffect(() => {
    try {
      const shopData = localStorage.getItem("shop");
      const data = shopData ? JSON.parse(shopData) : {};
      setShopId(data?.shopId || null);
      setName(data?.shopName || "");
    } catch (error) {
      console.error("❌ Error reading shop data:", error);
    }
  }, []); 

  const saveToDatabase = async (msg: any, type: string) => {
    if (!shopId) return;
    try {
      await axios.post(UseApiUrl(api_Config.Shop.addNotifycation), {
        id: uuidv4(),
        shopId,
        type: type,
        message: msg.message,
        isCHeck: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error saving notification:", error);
    }
  };

  useEffect(() => {
    if (!shopId) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7143/notifyHub")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    newConnection.on("NotificationOrder", (msg: string) => {
      console.log("📩 Received order:", msg);
      

      setMessage(prevMessage => [...prevMessage, msg]);

      saveToDatabase(msg, "Order").catch(err => 
        console.error("Failed to save notification:", err)
      );
    });

    newConnection.on("AppointmentBooking", (msg: string) => {
      console.log("📩 Received appointment:", msg);
      
      setAppointment(prevAppointment => [...prevAppointment, msg]);
      
      saveToDatabase(msg, "Appointment").catch(err =>
        console.error("Failed to save notification:", err)
      );
    });

    const startConnection = async () => {
      try {
        if (newConnection.state === HubConnectionState.Disconnected) {
          await newConnection.start();
          console.log("✅ SignalR connected");
          await newConnection.invoke("JoinGroupShop", shopId);
          await newConnection.invoke("JoinGroupShopAppointment", shopId);
          console.log(`🟢 Joined group: Shop_${shopId}`);
        }
      } catch (err) {
        console.error("❌ SignalR connect failed:", err);
        setTimeout(startConnection, 3000);
      }
    };

    startConnection();
    setConnection(newConnection);

    return () => {
      newConnection.stop();
      console.log("🔴 SignalR disconnected");
    };
  }, [shopId]); 

  const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${UseApiUrl(api_Config.Shop.GetNotifycation)}?shopId=${shopId}`
        );
        
        const msgs = response.data
          .filter((item: any) => item.type === "Order" && item.isCHeck !== true)
          .map((item: any) => item);
        setMessage(msgs);

        const apps = response.data
          .filter((item: any) => item.type === "Appointment" && item.isCHeck !== true)
          .map((item: any) => item);
        setAppointment(apps);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };
  useEffect(() => {
    if (!shopId) return;
  

    fetchMessages();
  }, [shopId]);

  const logOut = async () => {
    localStorage.removeItem("tokenShop");
    setIsignned(false);
    toast.success("Đăng Xuất Thành Công");
    if (connection && connection.state === HubConnectionState.Connected) {
      try {
        await connection.invoke("LeaveGroupShop", shopId);
        await connection.stop();
        console.log("🔴 Disconnected from SignalR");
      } catch (error) {
        console.error("Error stopping SignalR:", error);
      }
    }
  };
useEffect(() => {
  localStorage.removeItem("tokenShop");
}, [logOut]);
  const handleClickCheck = async (id: string) => {
    try {
      await axios.post(
        UseApiUrl(api_Config.Shop.CheckNotifycation),
        {
          idNotifycation: id,
          shop_ID: shopId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchMessages();
    } catch (error) {
      console.error("❌ Error updating notification:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        message,
        appointment,
        logOut,
        name,
        handleClickCheck,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};