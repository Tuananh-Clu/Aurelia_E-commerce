import { CartItemRow } from "./CartItem";
import { CartSummary } from "./CartSumary";
import { Navbar } from "@/Features/Home/components/Navbar";
import { Footer } from "@/Features/Home/components/Footer";
import { useCart } from "../hook/useCart";

export const Cart = () => {
  const { CartDataAdd, setCartDataAdd, subtotal, updateQty, removeItem } = useCart();

  for (let i = 0; i < CartDataAdd.length; i++) {
    for (let j = i + 1; j < CartDataAdd.length; j++) {
      if (CartDataAdd[i].itemid === CartDataAdd[j].itemid) {
        CartDataAdd.splice(j, 1);
        CartDataAdd[i].quantity += 1;
        j--;
      }
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 flex-grow w-full h-screen mb-30">
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
                    onUpdateQuantity={updateQty}
                    onRemove={removeItem}
                  />
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-neutral-500 font-light text-lg">
                    Your cart is currently empty.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <CartSummary subtotal={subtotal} tax={0} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
