
import { FilterProductContext } from "../../config/FIlterProduct";
import { useContext } from "react";
export const BannerTitle = () => {
    const {key}=useContext(FilterProductContext)  
  return (
     <div className="w-full text-center flex flex-col gap-3 items-center pt-50 ">
        <h1 className="text-4xl  font-heading">September’s New Essentials</h1>
        <p className="max-w-3xl text-center">
          Aurelia unveils a selection of essential women's creations
          reinterpreting the House's iconic codes. From the timeless Bar jacket
          to J'Adior pumps, emblematic bags such as the Dior Toujours and
          fabulous jewelry including the Aurelia Tribales.
        </p>
        <h2>
          {key===""?null:`search "${key}"`
           }
        </h2>
       
      </div>
  )
}
