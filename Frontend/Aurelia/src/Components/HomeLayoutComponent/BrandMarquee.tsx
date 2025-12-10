import { motion } from "framer-motion";

export const BrandMarquee = () => {
  const brands = [
    "Aurelia",
    "Pristine",
    "Valente",
    "Monarque",
    "Étoile",
    "Opaline",
    "Seraphine",
    "Maison",
    "Gucci",
    "Chanel",
    "Louis Vuitton",
    "Dior",
    "Prada",
    "Hermès",
    "Versace",
    "Balenciaga",
  ];

  const items = [...brands, ...brands];
  return (
    <section className="w-full bg-white py-8 border-y   border-gray-100">
      <div className="max-w-7xl mx-auto  px-6 overflow-hidden">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          initial={{ x: 0 }}
          animate={{ x: [0, -600] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {items.map((b, i) => (
            <div
              key={i}
              className="text-sm md:text-xl tracking-widest uppercase text-gray-500 opacity-70 hover:opacity-100 transition"
            >
              {b}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
