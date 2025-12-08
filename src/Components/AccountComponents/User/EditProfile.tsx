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
  ArrowBigLeftDashIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../../contexts/Author";

const InputField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative group">
      <Icon
        size={20}
        className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-600"
      />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/70 text-gray-900 transition-all hover:bg-white"
      />
    </div>
  </div>
);

export default function EditProfile({
  setState,
}: {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { UpdateProfile } = useContext(AuthContext);
  const userString = localStorage.getItem("user");
  const [imageUrl, setImageUrl] = useState<string>("");
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
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 md:py-10 md:px-16 px-8 py-5  md:w-full  w-[400px] ${isEditing ? "h-[150vh]" : "h-[130vh]"} rounded-3xl shadow-xl border border-gray-200`}>
      <div
        onClick={() => setState(false)}
        className="backdrop-blur-md bg-white/10 border border-white/20 w-10 h-10 rounded-2xl 
  flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 hover:scale-105 
  transition-all shadow-lg"
      >
        <ArrowBigLeftDashIcon
          size={34}
          className="text-black drop-shadow-md hover:translate-x-[-4px] transition-transform"
        />
        <div className="w-8 h-[2px] bg-white/50 mt-2 rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="md:text-3xl text-2xl font-extrabold text-gray-900">
              Hồ sơ cá nhân
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý thông tin và cài đặt tài khoản của bạn
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 md:px-5 md:py-2.5 px-3 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
            >
              <Edit2 size={18} />
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="flex md:flex-row flex-col  gap-8">
          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg md:w-2/4 text-center border border-gray-100 "
          >
            <div className="relative  mb-4 flex flex-col items-center justify-center">
              <img
                src={avatar}
                alt="Avatar"
                className="w-36 h-36 rounded-2xl object-cover shadow-lg"
              />
              {isEditing && (
                <span className="flex flex-row items-center   bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="file"
                    multiple={false}
                    accept="image/*"
                    onChange={(e) =>
                      setFiles(e.target.files ? e.target.files[0] : null)
                    }
                  ></input>
                  <Camera size={18} />
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-1">Trạng thái</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Hoạt động
              </span>
            </div>
          </motion.div>

          {/* Form / Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:w-3/4 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
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
                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-none"
                  >
                    <Icon className="text-indigo-600 mt-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-gray-900 font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Cập nhật thông tin
                </h3>
                <div className="space-y-5 mb-8">
                  <InputField
                    icon={User}
                    label="Họ và tên"
                    name="name"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                  <InputField
                    icon={Mail}
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                  <InputField
                    icon={Phone}
                    label="Số điện thoại"
                    name="phone"
                    value={phone}
                    onChange={(e: any) => setPhone(e.target.value)}
                  />
                  <InputField
                    icon={MapPin}
                    label="Địa chỉ"
                    name="address"
                    value={address}
                    onChange={(e: any) => setAddress(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 justify-end border-t pt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-6 py-2.5 rounded-xl font-medium inline-flex items-center gap-2 transition shadow-md ${
                      saved
                        ? "bg-green-600 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check size={18} />
                        Đã lưu
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {!isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-sm text-indigo-900"
          >
            💡 Nhấn nút <strong>Chỉnh sửa</strong> để cập nhật thông tin cá nhân
            của bạn.
          </motion.div>
        )}
      </div>
    </div>
  );
}
