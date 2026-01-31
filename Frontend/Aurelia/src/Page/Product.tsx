
import { Footer } from "@/Features/Home/components/Footer";
import { Navbar } from "@/Features/Home/components/Navbar";
import { BannerTitle } from "@/Features/Product/components/BannerTitle";
import { FilterType } from "@/Features/Product/components/FilterType";
import { ListProduct } from "@/Features/Product/components/ListProduct";



export const Product = () => {

  return (
    <>
      <Navbar />
      <FilterType/>
      <BannerTitle />
      <ListProduct />
      <Footer/>
    </>
  );
};
