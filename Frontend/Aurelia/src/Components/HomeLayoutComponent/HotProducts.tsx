import { useContext, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import ProductCard from "./ProductCard";

export const HotProducts = () => {
  const { dataProduct } = useContext(FilterProductContext);

  const hotItems = useMemo<Product[]>(() => {
    return [...(dataProduct || [])]
      .sort(
        (a, b) =>
          (b.sold ?? 0) - (a.sold ?? 0) || (b.rating ?? 0) - (a.rating ?? 0),
      )
      .slice(0, 8);
  }, [dataProduct]);

  return (
    <section className="relative mt-32 mb-24">
              <h1 className="relative z-10 text-3xl font-serif italic text-slate-800 mb-12 flex items-center w-full text-center justify-center">
          Sản phẩm Hot
        </h1>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-8">
          {hotItems.slice(0, 4).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              className={idx % 2 !== 0 ? "mt-12 lg:mt-24" : ""}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-8 mt-24 lg:mt-[-4rem]">
          {hotItems.slice(4,8).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx + 4}
              className={idx % 2 !== 0 ? "mt-12 lg:mt-24" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
