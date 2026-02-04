import React, { useContext } from 'react';
import type { Cart } from '../../types/type';
import { CartContext } from '../../contexts/CartContext';

interface CartItemRowProps {
  item: Cart;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item}) => {
  const { CartDataAdd, setCartDataAdd,formatPrice } = useContext(CartContext);
   for(let i=0;i<CartDataAdd.length;i++){
     for(let j=i+1;j<CartDataAdd.length;j++){
       if(CartDataAdd[i].itemid===CartDataAdd[j].itemid){
         CartDataAdd.splice(j,1);
         CartDataAdd[i].quantity+=1;
         j--;
       }
     }
   }

     
  const updateQty = (id: string, newQty: number) => {
    setCartDataAdd((prev) =>
      prev.map((i) =>
        i.itemid === id ? { ...i, quantity: Math.max(newQty, 1) } : i
      )
    );
    localStorage.setItem("cartItems", JSON.stringify(CartDataAdd));
  };

  const removeItem = (id: string) => {
    setCartDataAdd((prev) => prev.filter((i) => i.itemid !== id));
    localStorage.removeItem("cartItems");
    setCartDataAdd(CartDataAdd.filter((i) => i.itemid !== id));
    localStorage.setItem("cartItems", JSON.stringify(CartDataAdd.filter((i) => i.itemid !== id)));
  };
  return (
    <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-silver dark:border-neutral-800 last:border-0 animate-fadeIn">
      <div className="w-full md:w-48 aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        <img 
          src={item.thumnail} 
          alt={item.name} 
          className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" 
        />
      </div>
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="serif-title text-2xl tracking-wide">{item.name}</h3>
            <span className="text-sm font-light tracking-widest">{formatPrice?.(item.price) ?? item.price}</span>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-6">
            {item.color} / {item.size}
          </p>
          <div className="flex items-center gap-8 text-[11px] uppercase tracking-widest font-light">
            <div className="flex items-center border border-silver dark:border-neutral-800 px-3 py-1 select-none">
              <button 
                onClick={() => updateQty(item.itemid, item.quantity - 1)}
                className="hover:text-neutral-400 w-6 text-center disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                －
              </button>
              <span className="px-6 min-w-[3rem] text-center">{item.quantity.toString().padStart(2, '0')}</span>
              <button 
                onClick={() => updateQty(item.itemid, item.quantity + 1)}
                className="hover:text-neutral-400 w-6 text-center"
              >
                ＋
              </button>
            </div>
            <button 
              onClick={() => removeItem(item.itemid)}
              className="underline underline-offset-4 decoration-silver hover:decoration-black dark:hover:decoration-white transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="mt-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            Expected Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>
    </div>
  );
};