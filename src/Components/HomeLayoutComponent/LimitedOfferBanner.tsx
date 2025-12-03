import { useEffect, useState } from "react";

const getRemaining = (end: number) => {
  const diff = Math.max(0, end - Date.now());
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { h, m, s };
};

export const LimitedOfferBanner = () => {
  const endAt = Date.now() + 1000 * 60 * 60 * 24;
  const [t, setT] = useState(getRemaining(endAt));
  useEffect(() => {
    const id = setInterval(() => setT(getRemaining(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt]);
  return (
    <section className="py-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-heading font-semibold">Ưu đãi giới hạn</h3>
          <p className="text-gray-300 text-sm">Giảm đến 35% cho BST Thu - Đông</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-2 rounded-lg bg-white/10 border border-white/20">{String(t.h).padStart(2, "0")}h</span>
          <span className="px-3 py-2 rounded-lg bg-white/10 border border-white/20">{String(t.m).padStart(2, "0")}m</span>
          <span className="px-3 py-2 rounded-lg bg-white/10 border border-white/20">{String(t.s).padStart(2, "0")}s</span>
        </div>
        <button className="rounded-xl px-5 py-3 bg-white text-gray-900 font-semibold hover:bg-amber-100">Mua ngay</button>
      </div>
    </section>
  );
};


