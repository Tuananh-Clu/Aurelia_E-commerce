import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { AdminContext } from "../../../../config/AdminContext";
import { AddBanner } from "./AddBanner";
import { LayoutPreview } from "./LayoutPreview";
import { ImagePlus, Edit2, Type, Palette } from "lucide-react";

export const BannerSetting = () => {
  const [selected, setSelected] = useState(0);
  const [statusState, setStatusState] = useState<"Main" | "Story">("Main");
  const { MainBanner, StoryBanner } = useContext(AdminContext);
  const [localMainBanner, setLocalMainBanner] = useState(MainBanner);
  const [localStoryBanner, setLocalStoryBanner] = useState(StoryBanner);
  const [file, setFile] = useState<File | null>(null);
  const { handleClick } = useContext(AdminContext);
  const [popupAddBanner, setPopupAddBanner] = useState(false);
  const ListStyle =
    statusState === "Main" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D"];
  const handleChangeLayout = (field: string, layout: string|boolean) => {
    statusState === "Main"
      ? setLocalMainBanner((prevBanners: any) =>
          prevBanners.map((banner: any, index: number) =>
            index === selected ? { ...banner, [field]: layout } : banner
          )
        )
      : setLocalStoryBanner((prevBanners: any) =>
          prevBanners.map((banner: any, index: number) =>
            index === selected ? { ...banner, [field]: layout } : banner
          )
        );
  };
  const SaveChangeValue = (statusState: string, data: any) => {
    handleClick(statusState, data);
  };
  const [bannerState, setBannerState] = useState<any>();
  const uploadImage = async (file: File[]) => {
    try {
      const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
      const formData = new FormData();
      file.forEach((f) => {
        formData.append("image", f);
      });

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.data.image.url;
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };
  useEffect(() => {
    if (file) {
      uploadImage([file]).then((url) => {
        if (url) {
          statusState === "Main"
            ? setLocalMainBanner((prevBanners: any) =>
                prevBanners.map((banner: any, index: number) =>
                  index === selected ? { ...banner, linkUrl: url } : banner
                )
              )
            : setLocalStoryBanner((prevBanners: any) =>
                prevBanners.map((banner: any, index: number) =>
                  index === selected ? { ...banner, linkUrl: url } : banner
                )
              );
        }
      });
    }
  }, [file]);

  const banners = statusState === "Main" ? localMainBanner : localStoryBanner;
  const current = banners[selected];

  if (!current)
    return (
      <div className="text-center py-20 text-gray-500">
        Không có banner nào.
      </div>
    );

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-screen">
      {/* Header */}
      {popupAddBanner && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50
        w-full h-full"
        >
          <AddBanner
            SetBanner={setBannerState}
            setPopupAddBanner={setPopupAddBanner}
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Quản lý Banner ({statusState})
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setStatusState("Main")}
            className={`px-4 py-2 rounded-xl font-medium shadow transition ${
              statusState === "Main"
                ? "bg-blue-500 text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Main Banner
          </button>
          <button
            onClick={() => setStatusState("Story")}
            className={`px-4 py-2 rounded-xl font-medium shadow transition ${
              statusState === "Story"
                ? "bg-pink-500 text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Story Banner
          </button>
          <button
            onClick={() => setPopupAddBanner(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow hover:opacity-90"
          >
            <Plus size={18} /> Thêm Banner
          </button>
        </div>
      </div>
      <div className="w-full flex flex-row gap-8 ">
        <div className="w-[70%] max-h-[800px]  gap-7  pr-4 flex flex-col">
          <LayoutPreview
            current={current}
            setFile={setFile}
            selected={selected}
            statusState={statusState}
            setLocalMainBanner={setLocalMainBanner}
            setLocalStoryBanner={setLocalStoryBanner}
            banners={banners}
            setSelected={setSelected}
          />
          <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Danh sách Banner
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {banners?.map((b: any, i: any) => (
            <motion.div
              key={b.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelected(i)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-md min-w-[220px] transition ${
                i === selected
                  ? "ring-2 ring-blue-400"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={b.linkUrl}
                alt={b.mainTitle}
                className="w-full h-28 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-sm px-3 py-1 truncate">
                {b.mainTitle}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl space-y-6 w-[30%] h-fit sticky top-8">
          <h3 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa Banner
          </h3>

          {/* Ảnh */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Ảnh chính
            </label>
            <div className="border-dashed border-2 border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 cursor-pointer bg-white/50 transition">
              <ImagePlus className="mx-auto text-gray-400 mb-2" size={28} />
              <p className="text-sm text-gray-500">Kéo thả hoặc chọn ảnh mới</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="absolute inset-0 w-full h-30 mt-25 rounded-2xl  cursor-pointer opacity-0 "
              />
            </div>
          </div>
          <div>
            <label></label>
            {ListStyle.map((styleItem: any, index: number) => (
              <button
                onClick={() => handleChangeLayout("layout", styleItem)}
                key={index}
                className="mr-2 mb-2 px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100 transition"
              >
                Layout {styleItem}
              </button>
            ))}
          </div>
          {/* Tiêu đề */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Type size={16} /> Tiêu đề chính
            </label>
            <input
              onChange={(e) => handleChangeLayout("mainTitle", e.target.value)}
              type="text"
              value={current?.mainTitle}
              className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Edit2 size={16} /> Tiêu đề phụ 1
            </label>
            <input
              onChange={(e) => handleChangeLayout("h1", e.target.value)}
              type="text"
              value={current?.h1 || ""}
              className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
            />
          </div>
          {statusState === "Story" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Edit2 size={16} /> Tiêu đề phụ 2
              </label>
              <input
                onChange={(e) => handleChangeLayout("h2", e.target.value)}
                type="text"
                value={current?.h2 || ""}
                className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
              />
            </div>
          )}
          {statusState === "Main" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Edit2 size={16} /> Chữ Trên Nút
              </label>
              <input
                onChange={(e) =>
                  handleChangeLayout("textInButton", e.target.value)
                }
                type="text"
                value={current?.textInButton || ""}
                className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
              />
            </div>
          )}
          {/* Slogan / Thông điệp */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Edit2 size={16} /> Slogan / Thông điệp
            </label>
            <textarea
              onChange={(e) => handleChangeLayout("paragraph", e.target.value)}
              value={current?.paragraph || ""}
              className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 h-24 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition resize-none"
            />
          </div>

          {/* Màu chữ */}
          <div className="flex flex-row gap-5 items-center justify-around">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Palette size={16} /> Màu chữ tiêu đề chính
              </label>
              <input
                onChange={(e) =>
                  handleChangeLayout("colorMainTitle", e.target.value)
                }
                type="color"
                value={current?.colorMainTitle}
                className="w-16 h-8 rounded-lg border border-gray-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Palette size={16} /> Màu chữ phụ
              </label>
              <input
                onChange={(e) =>
                  handleChangeLayout("colorText", e.target.value)
                }
                type="color"
                value={current?.colorText}
                className="w-16 h-8 rounded-lg border border-gray-200 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="flex flex-col items-center gap-2 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <h1>Trạng Thái:</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium`}>
                  {current?.active ? (
                    <span className="bg-green-100 text-green-800">Hoạt động</span>
                  ) : (
                    <span className="bg-red-100 text-red-800">Ngừng hoạt động</span>
                  )}
                </span>

              </div>
              <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}

                onClick={() => handleChangeLayout("active", !current?.active)}
                className={`ml-2 px-2 py-1 rounded text-sm font-medium cursor-pointer ${
                  current?.active
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {current?.active ? "Ngừng hoạt động" : "Kích hoạt"}
              </motion.button>
            </label>
          </div>
          <button
            onClick={() => SaveChangeValue(statusState, current)}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
      
    </div>
  );
};
