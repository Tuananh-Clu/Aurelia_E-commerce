import { useContext } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import ProductCard from "./ProductCard";

export const DiscountProducts = () => {
  const { dataProduct } = useContext(FilterProductContext);
  const productSale = dataProduct?.filter((p) => p.discountValue > 0);

  return (
    <main className="flex-grow pt-32 pb-24 overflow-hidden">
      <section className="relative mb-48">
        <h1 className="relative z-10 text-3xl font-serif italic text-slate-800 mb-12 flex items-center w-full text-center justify-center">
          Sản phẩm giảm giá
        </h1>

        <div className="relative z-10 max-w-[1600px] mx-auto px-8 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-8">
            {productSale?.slice(0, 4).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                className={idx % 2 !== 0 ? "mt-12 lg:mt-24" : ""}
                isSale={true}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-8 mt-24 lg:mt-[-4rem]">
            {productSale?.slice(4,8).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx + 4}
                className={idx % 2 !== 0 ? "mt-12 lg:mt-24" : ""}
                isSale={true}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
