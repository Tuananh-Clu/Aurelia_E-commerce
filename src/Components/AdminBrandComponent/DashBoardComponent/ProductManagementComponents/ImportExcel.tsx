import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  Loader2,
  Info,
  XCircle,
} from "lucide-react";
import type { Product } from "../../../../types/type";
import { api_Config, UseApiUrl } from "../../../../types/api";
import toast from "react-hot-toast";



const ImportExcel = ({setOpenImportModal}:{setOpenImportModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [datas, setDatas] = useState<any[]>([]);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);
    setSuccess(false);
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<any>(sheet);
      setPreviewData(jsonData.slice(0, 5));
            jsonData.forEach(element => {
        setDatas(prevData => [...prevData, {
            id: element.id,
            name: element.name,
            type: element.type,
            subcategory: element.subcategory,
            brand: element.brand,
            origin: element.origin,
            price: element.price,
            description: element.description,
            rating: element.rating,
            stock: element.stock,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
            thumbnail: element.thumbnail,
            images:  JSON.parse(element.images.replace(/'/g, '"')),
            material: element.material,
            variants:  JSON.parse(element.variants.replace(/'/g, '"')),
            sold: element.sold,
            discountValue: element.discountValue,
            discountType: element.discountType,
            season: element.season
        }]);
             
      });
    }
  };
  const handleFileUpload = async () => {
    if (!file) return alert("Vui lòng chọn tệp Excel!");

    setIsLoading(true);
    try {
      await axios.post(UseApiUrl(api_Config.Product.PostProduct), datas, { headers: { 'Content-Type': 'application/json' } });
       console.log("Dữ liệu import:", datas);
      toast.success("Import sản phẩm thành công!");
      setSuccess(true);
    } catch (error) {
      console.error("Lỗi import:", error);
      toast.error("Import thất bại, kiểm tra lại file Excel!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50/60 to-purple-100/40 backdrop-blur-lg border border-white/30 w-full max-w-4xl mx-auto mt-10">
        <XCircle className="absolute top-4 right-4 w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => setOpenImportModal(false)} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-300/20 via-purple-300/20 to-pink-300/20 blur-2xl rounded-3xl"></div>

      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
        Nhập sản phẩm từ Excel
      </h2>

      {/* --- Hướng dẫn --- */}
      <div className="p-4 mb-6 rounded-xl bg-white/60 border border-blue-200 shadow-inner">
        <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
          <Info className="w-5 h-5" />
          <span>Hướng dẫn nhập file Excel:</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          🧾 File Excel cần có <b>tên cột trùng với thuộc tính của Product</b> như:
        </p>
        <pre className="bg-white/70 p-3 rounded-md text-xs text-gray-800 overflow-x-auto mt-2">
{`id | name | type | subcategory | brand | origin | price | description | rating | stock | createdAt | updatedAt | thumbnail | images | material | variants | sold | discountValue | discountType`}
        </pre>
        <p className="text-sm text-gray-600 mt-2">
          📦 <b>Lưu ý:</b> 
          - <code>images</code> có thể nhập nhiều URL, ngăn cách bởi dấu phẩy (,).  
          - <code>variants</code> có thể để trống hoặc chứa JSON string.  
          - <code>price</code>, <code>stock</code>, <code>sold</code>, <code>rating</code>, <code>discountValue</code> là số.
        </p>
      </div>

      {/* --- Upload --- */}
      <div
        className={`w-full p-6 border-2 border-dashed rounded-xl text-center transition-all ${
          selectedFile
            ? "border-green-400 bg-green-50/40"
            : "border-blue-300 hover:border-blue-400 bg-white/50"
        }`}
      >
        <label
          htmlFor="fileInput"
          className="cursor-pointer flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600 transition-all"
        >
          <FileSpreadsheet className="w-12 h-12 text-blue-500" />
          <span className="font-medium">
            {selectedFile ? selectedFile.name : "Chọn tệp Excel (.xlsx, .xls)"}
          </span>
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* --- Preview --- */}
      {previewData.length > 0 && (
        <div className="mt-6 bg-white/60 border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className="p-2 text-left font-semibold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i} className="even:bg-white odd:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="p-2 text-gray-700 truncate max-w-[150px]">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 italic text-center py-2">
            (Hiển thị trước 5 dòng đầu tiên)
          </p>
        </div>
      )}

      {/* --- Button --- */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleFileUpload}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg
          ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 hover:scale-105"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang import...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Tải lên & Import
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="flex justify-center items-center gap-2 mt-3 text-green-600 font-medium">
          <CheckCircle className="w-5 h-5" />
          Import thành công!
        </div>
      )}
    </div>
  );
};

export default ImportExcel;
