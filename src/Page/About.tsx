import { Navbar } from "../Components/HomeComponent/Navbar";
import { Footer } from "../Components/HomeComponent/Footer";
import { motion } from "framer-motion";

export const About = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">
        <section className="relative h-[50vh] flex items-center justify-center text-white" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-black/40" />
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-4xl md:text-5xl font-semibold">Về Aurelia</motion.h1>
        </section>

        <section className="px-6 md:px-10 py-14 max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-gray-700 text-lg leading-8">
            Chúng tôi theo đuổi sự tinh tế trong từng đường nét, tôn vinh vẻ đẹp vượt thời gian
            với chất liệu cao cấp và thiết kế tối giản.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Năm thành lập', value: '2024' },
              { label: 'BST đã ra mắt', value: '12+' },
              { label: 'Khách hàng hài lòng', value: '10k+' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl font-semibold">{s.value}</div>
                <div className="text-gray-600 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};


