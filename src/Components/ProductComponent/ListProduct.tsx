import { useContext } from "react";
import { FilterProductContext } from "../../config/FIlterProduct";
import { motion } from "framer-motion";
import {  useNavigate } from "react-router-dom";

export const ListProduct = () => {

  const {key,dataProduct}=useContext(FilterProductContext)
  const filter=dataProduct.filter(a=>a.type===key);
  const dataResult=key===""?dataProduct:filter;
  const navigate=useNavigate();
  return (
    <>
     <h1 className="mt-3 text-gray-500 font-extralight text-center">{dataResult.length} items</h1>
      <motion.div
       className="grid grid-cols-4 justify-center items-center w-full gap-15 px-5  py-10">
        {dataResult?.map((item) => {
          return (
            <div onClick={()=>navigate(`/Fashion/Products/${item.id}`)} className="flex flex-col items-center">
              <img className="w-96 h-120 object-cover" src={item.thumbnail} alt="" />
              <div className="text-center w-full">
                <h1 className="text-2xl font-heading  mt-3">{item.name}</h1>
                <h1>{item.price.toLocaleString("vi-Vn")} VND</h1>
              </div>
            </div>
          );
        })}
      </motion.div>
    </>
   
  )
}
