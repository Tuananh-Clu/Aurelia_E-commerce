import * as XLSX from "xlsx";
import { Download } from "lucide-react";
export const Export = ({ Data }: { Data: any }) => {
  console.log(Data);
  if (!Data || Data.length === 0) {
    return <div>No data to export</div>;
  }
  const data = Data.map((item: any) => {
    const size = item?.variants?.map((variant: any) => variant.size) || [];
    const color = item?.variants?.map((variant: any) => variant.color) || [];
    return {
      "Id San Pham": item.productId,
      "Ten San Pham": item.name,
      "So Luong Ban": item.sold,
      Brand: item.brand,
      Size: size.join(", "),
      Color: color.join(", "),
    };
  });
  const exportData = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ExportedData.xlsx");
  };
  return (
    <button
      onClick={exportData}
      className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium flex items-center gap-2 shadow-sm"
    >
      <Download className="w-5 h-5" />
      Export
    </button>
  );
};
