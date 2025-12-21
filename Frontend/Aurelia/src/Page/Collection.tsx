import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../contexts/SeasonContext";
import { LoadingOverlay } from "../Components/LoadingOverlay";
import { LazyImage } from "../Components/SEO/LazyImage";

export const Collection = () => {
  const { id } = useParams();
  const { seasonCollections, fetchData } = useContext(CollectionContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  const navigate=useNavigate()
  if (!seasonCollections) return <p>Collection không tồn tại</p>;
  const collection=seasonCollections.map((item:any)=>item.season)[0];
  const products=seasonCollections.map((item:any)=>item.products).flat();

  return (
    <>
      <Navbar />
      {isLoading !== false && <LoadingOverlay isLoading={true} message="Đang Tải" />}
      <section
        className="relative w-full h-[80vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${collection?.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-serif uppercase tracking-widest">
            {collection?.name}
          </h1>
          <p className="italic mt-4 text-lg">{collection?.slogan}</p>
          <p className="mt-4 max-w-2xl mx-auto text-gray-200">
            {collection?.description}
          </p>
        </div>
      </section>

      <section className="px-10 py-20 bg-white">
        <h2 className="text-4xl font-serif font-light text-center mb-16 tracking-wider uppercase">
          Bộ Sưu Tập
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {products?.map((product:any) => (
            <div
            onClick={()=>navigate(`/Fashion/Products/${product?.id}`)}
              key={product?.id}
              className="flex flex-col items-center text-center group"
            >

              <div className="overflow-hidden w-full">
                <LazyImage src={product?.thumbnail} alt={product?.name} className="w-full h-[420px] object-cover transform transition-transform duration-700 group-hover:scale-110" />
              </div>


              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-serif font-light tracking-wide uppercase">
                  {product?.name}
                </h3>
                <p className="text-gray-500 text-sm tracking-widest">
                  {product?.type}
                </p>
                <p className="text-lg font-light">${product?.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};
