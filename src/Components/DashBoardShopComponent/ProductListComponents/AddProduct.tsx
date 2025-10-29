import React, {  useContext, useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Product } from "../../../types/type";
import { v4 as uuid } from "uuid";
import { DashBoardShopCOntext } from "../../../config/DashBoardShopContext";


export const AddProduct = ({
  onClose,
  title,
  dataEdit,
  ProductId,
  sold
}: {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  dataEdit: Product[];
  ProductId: string;
  sold: number;
}) => {
  const dataFilter = dataEdit.filter((item) => item.id === ProductId);
  const dataEditProduct = dataFilter.length > 0 ? dataFilter[0] : null;
  const [sizes, setSizes] = useState<string[]>(dataEditProduct ? dataEditProduct.variants.flatMap(v => v.sizes.map(s => s.size)) : []);
  const [colors, setColors] = useState<string[]>(dataEditProduct ? dataEditProduct.variants.map(v => v.color) : []);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [ImageUrl,setImageUrl] = useState<string[]>(files.length===0 && dataEditProduct ? dataEditProduct.images : []);
  const { updateProduct,editProduct,taskFetchSanPham } = useContext(DashBoardShopCOntext);
  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };
  const uploadImage = async(file: File[]) => {
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
    console.log("ImgBB upload result:", data); 

    if (!data.success) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.data.image.url; 
  } catch (err) {
    console.error("Upload error:", err);
    return "";
  }
  }
useEffect(()=>{
  files.forEach(element => {
    uploadImage([element]).then((url) => {
      setImageUrl(prev=>[url,...prev]);
      console.log(dataEditProduct?.sold);
      
    });
  });
},[files])

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput)) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeSize = (value: string) => {
    setSizes(sizes.filter((s) => s !== value));
  };

  const removeColor = (value: string) => {
    setColors(colors.filter((c) => c !== value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  const [tenSanPham, setTenSanPham] = useState(dataEditProduct ? dataEditProduct.name : "");
  const [moTa, setMoTa] = useState(dataEditProduct ? dataEditProduct.description : "");
  const [thuongHieu, setThuongHieu] = useState( dataEditProduct ? dataEditProduct.brand : "");
  const [loaiSanPham, setLoaiSanPham] = useState(dataEditProduct ? dataEditProduct.type : "");
  const [theLoai, setTheLoai] = useState(dataEditProduct ? dataEditProduct.subcategory : "");
  const [xuatXu, setXuatXu] = useState(dataEditProduct ? dataEditProduct.origin : "");
  const [giaSanPham, setGiaSanPham] = useState(dataEditProduct ? dataEditProduct.price.toString() : "");
  const [khoHang, setKhoHang] = useState(dataEditProduct ? dataEditProduct.stock.toString() : "");
  const data:Product = {
    id: title === "Thêm Sản Phẩm Mới" ? uuid() : dataEditProduct ? dataEditProduct.id : "", 
    name: tenSanPham,
    description: moTa,
    brand: thuongHieu,
    type: loaiSanPham,
    subcategory: theLoai,
    origin: xuatXu,
    price: parseFloat(giaSanPham),
    stock: parseInt(khoHang),
    sold: sold ,
    images: ImageUrl,
    thumbnail: ImageUrl[0],
    rating: dataEditProduct ? dataEditProduct.rating : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    material: "",
    variants: [
      { color: colors[0] || "Default", sizes: sizes.map(size => ({ size, quantity: 0 })) }
    ],
    discountType: dataEditProduct ? dataEditProduct.discountType : "",
    discountValue: dataEditProduct ? dataEditProduct.discountValue : 0,
    season:""
  }

  const handleClickUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data && title === "Thêm Sản Phẩm Mới") {
      await updateProduct(data);
      onClose(false);
    }
    if (dataEditProduct && title === "Sửa Sản Phẩm") {
      await editProduct(data);
      onClose(false);
    }
  };
  useEffect(() => {
    taskFetchSanPham();
  }, [handleClickUpdateStatus]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black">
      <div className="relative w-5/6 lg:w-3/4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 p-6 backdrop-blur-md border border-white/30">
        <X
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-gray-800 hover:text-red-600 cursor-pointer transition"
        />

        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          🛍️ {title}
        </h1>

        <div className="bg-white/90 shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
          {/* FORM CHÍNH */}
          <form className="flex-1 p-6 border-r border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Tên Sản Phẩm", id: "name", value: tenSanPham },
                { label: "Thương Hiệu", id: "brand" , value: thuongHieu},
                { label: "Loại Sản Phẩm", id: "type", value: loaiSanPham },
                { label: "Thể Loại", id: "subcategory" , value: theLoai},
                { label: "Xuất Xứ", id: "origin" , value: xuatXu},
                { label: "Giá Sản Phẩm (₫)", id: "price", value: giaSanPham },
              ].map((item) => (
                <div key={item.id}>
                  <label
                    htmlFor={item.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {item.label}
                  </label>
                  <input
                  onChange={(e) => {
                    const value = e.target.value;
                    switch (item.label) {
                      case "Tên Sản Phẩm":
                        setTenSanPham(value);
                        break;
                      case "Thương Hiệu":
                        setThuongHieu(value);
                        break;
                      case "Loại Sản Phẩm":
                        setLoaiSanPham(value);
                        break;
                      case "Thể Loại":
                        setTheLoai(value);
                        break;
                      case "Xuất Xứ":
                        setXuatXu(value);
                        break;
                      case "Giá Sản Phẩm (₫)":
                        setGiaSanPham(value);
                        break;
                      default:
                        break;
                    }
                  }}
                    id={item.id}
                    value={title === "Sửa Sản Phẩm" && dataEditProduct ? item.value : undefined}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:border-amber-400"
                    placeholder={item.label}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mô Tả Sản Phẩm
              </label>
              <textarea
                onChange={(e) => setMoTa(e.target.value)}
                id="description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:border-amber-400"
                placeholder="Nhập mô tả sản phẩm..."
              ></textarea>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleClickUpdateStatus}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md"
              >
                {title === "Sửa Sản Phẩm" ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm"}
              </button>
            </div>
          </form>

          {/* BÊN PHẢI: STOCK, ẢNH, SIZE & COLOR */}
          <div className="w-full md:w-1/3 p-6 bg-gray-50">
            {/* STOCK */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Kho Hàng
              </h2>
              <input
              onChange={(e) => setKhoHang(e.target.value)}
                type="number"
                placeholder="Số lượng trong kho"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:border-amber-400"
              />
            </div>

            {/* ẢNH */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Ảnh Sản Phẩm
              </h2>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:border-amber-400"
              />
              {files.length===0 && ImageUrl.length===0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Chọn ảnh sản phẩm (có thể chọn nhiều ảnh)
                </p>
              )}
              {(files.length > 0 || ImageUrl.length > 0) && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {files.length===0?ImageUrl:files.map((f:any, i) => (
                    <div
                      key={i}
                      className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <img
                        src={files.length===0?f:f instanceof File ? URL.createObjectURL(f) : f}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-white/70 text-red-600 hover:text-red-800 rounded-full p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SIZE */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Size</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  placeholder="Nhập size (VD: M, L, XL)"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {item}
                    <button
                      onClick={() => removeSize(item)}
                      className="text-blue-600 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Màu</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  placeholder="Nhập màu (VD: Đỏ, Đen...)"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full"
                  >
                    {item}
                    <button
                      onClick={() => removeColor(item)}
                      className="text-pink-600 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
