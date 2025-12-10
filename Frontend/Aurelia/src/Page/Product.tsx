
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { BannerTitle } from "../Components/ProductComponent/BannerTitle";
import { FilterType } from "../Components/ProductComponent/FilterType";
import { ListProduct } from "../Components/ProductComponent/ListProduct";



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
