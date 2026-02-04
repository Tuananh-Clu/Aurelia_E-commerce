import { useContext, useEffect, useState } from "react";
import {
  Camera,
  Save,
  Mail,
  Phone,
  User,
  MapPin,
  Check,
  Edit2,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../contexts/Author";
import { InputField } from "./RightSideComponent.tsx/InputField";


export default function AccountSettings() {
  const { UpdateProfile} = useContext(AuthContext);
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : {};
  const [user, setUser] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.soDt || "",
    address: userData.diaChi || "",
    avatar: userData.avatar || "https://via.placeholder.com/150",
  });

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [avatar, setAvatar] = useState(user.avatar);
  const [files, setFiles] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const updatedImage = async () => {
    const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
    const formData = new FormData();
    formData.append("image", files as Blob);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
      setImageUrl(response.data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  useEffect(() => {
    if (files) {
      updatedImage();
    }
  }, [files]);

  useEffect(() => {
    if (imageUrl) {
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
      setAvatar(imageUrl);
    }
  }, [imageUrl]);

  const handleSave = () => {
    UpdateProfile(name, email, phone, address, avatar);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsEditing(false);
  };
 return (
  <div className="min-h-screen bg-gray-50 px-6 py-8">
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <Edit2 size={16} />
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT – Avatar */}
        <div className="border border-gray-200 bg-white p-6 space-y-6">
          <div className="flex flex-col items-center">
            <img
              src={avatar}
              className="w-32 h-32 object-cover border border-gray-300"
            />
            {isEditing && (
              <label className="mt-4 flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                <Camera size={16} />
                Thay ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setFiles(e.target.files ? e.target.files[0] : null)
                  }
                />
              </label>
            )}
          </div>

          <div className="text-center">
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          <div className="border-t pt-4 text-center">
            <span className="text-xs text-gray-500">Trạng thái</span>
            <div className="mt-1 text-sm font-medium text-green-600">
              ● Hoạt động
            </div>
          </div>
        </div>

        {/* RIGHT – Info */}
        <div className="md:col-span-2 border border-gray-200 bg-white p-8">

          {!isEditing ? (
            <div className="space-y-6">
              {[
                { icon: User, label: "Họ và tên", value: name },
                { icon: Mail, label: "Email", value: email },
                { icon: Phone, label: "Số điện thoại", value: phone },
                { icon: MapPin, label: "Địa chỉ", value: address },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 border-b pb-4 last:border-none"
                >
                  <Icon size={18} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs uppercase text-gray-500">{label}</p>
                    <p className="text-gray-900">{value || "--"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <InputField icon={User} label="Họ và tên" value={name} onChange={(e:any)=>setName(e.target.value)} />
              <InputField icon={Mail} label="Email" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
              <InputField icon={Phone} label="Số điện thoại" value={phone} onChange={(e:any)=>setPhone(e.target.value)} />
              <InputField icon={MapPin} label="Địa chỉ" value={address} onChange={(e:any)=>setAddress(e.target.value)} />

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                >
                  {saved ? <Check size={16} /> : <Save size={16} />}
                  {saved ? "Đã lưu" : "Lưu"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

}
