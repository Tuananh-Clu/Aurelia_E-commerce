import { Search, ToolCase, X } from "lucide-react";
import { useContext, useState } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { DanhMuc } from "../HomeLayoutComponent/DanhMucSanPham";
import { useNavigate } from "react-router-dom";

export const FilterType = () => {
  const { key, setKey } = useContext(FilterProductContext);
  const [popUpSearch, setPopUpSearch] = useState(false);
  const navigate = useNavigate();
  const handleClick = (item: string) => {
    navigate("/Fashion/Products");
    setKey(item);
    setPopUpSearch(false)
  };
  return (
    <>
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 
                   border border-gray-200 rounded-full cursor-pointer 
                   bg-gray-100/80 hover:bg-gray-200 shadow-lg 
                   backdrop-blur-xl transition"
        onClick={() => key && setPopUpSearch(true)}
      >
        {key === "" ? (
          <div className="flex items-center gap-2 font-body text-gray-800">
            <ToolCase size={20} />
            <span onClick={()=>setPopUpSearch(true)}>Filter & Sort</span>
          </div>
        ) : (
          <div className="flex items-center w-50 flex-row justify-between gap-3 font-body text-gray-700">
            <span className="font-semibold">{key}</span>
            <span className="text-sm underline">Xem</span>
          </div>
        )}
      </div>
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl 
                    bg-white/90 backdrop-blur-lg shadow-2xl rounded-t-2xl 
                    border border-gray-200 transition-transform duration-500 
                    z-[100] ${
                      popUpSearch ? "translate-y-0" : "translate-y-full"
                    }`}
      >
        <div className="grid grid-cols-2">
          <div>
            <img
              className="object-cover h-[560px] w-full rounded-l-2xl"
              src="https://i.pinimg.com/1200x/b2/c2/10/b2c21065b22e80fb10ef36bdddf994df.jpg"
              alt="Danh mục"
            />
          </div>

          <div className="p-10 flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-3xl font-serif text-gray-900">{key}</h1>
              <div className="flex items-center gap-3">
                <Search onClick={()=>navigate("/search")} className="text-gray-500 cursor-pointer" />
                <X
                  className="cursor-pointer hover:text-red-500 transition"
                  onClick={() => setPopUpSearch(false)}
                />
              </div>
            </div>

            {/* Category List */}
            <ul className="mt-8 space-y-4">
              {DanhMuc.map((item, i) => (
                <li
                  onClick={() => handleClick(item.type)}
                  key={i}
                  className="font-semibold font-sans text-gray-700 
                             cursor-pointer hover:text-black hover:underline transition"
                >
                  {item.type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
