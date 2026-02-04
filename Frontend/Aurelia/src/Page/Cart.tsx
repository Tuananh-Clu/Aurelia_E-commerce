import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { CartItemRow } from "../Components/CartComponents/CartItemRow";
import { CartSummary } from "../Components/CartComponents/CartSummary";

export const Cart = () => {
  const { CartDataAdd, setCartDataAdd } = useContext(CartContext);
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-7">
            <h2 className="serif-title text-4xl mb-12 tracking-wide font-light border-b border-silver dark:border-neutral-800 pb-6 transition-colors duration-300">
              Your Selections
            </h2>

            <div className="space-y-12">
              {CartDataAdd.length > 0 ? (
                CartDataAdd.map((item) => (
                  <CartItemRow
                    key={item.itemid}
                    item={item}
                  />
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-neutral-500 font-light text-lg">
                    Your cart is currently empty.
                  </p>
                  <button
                    onClick={() => setCartDataAdd([])}
                    className="mt-4 text-xs uppercase tracking-widest border-b border-black dark:border-white pb-1"
                  >
                    Reload Catalog
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <CartSummary tax={0}  />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
