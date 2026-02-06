
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full pt-10 pb-20 lg:pt-16 lg:pb-32 fade-in-up">
      <div className="relative group cursor-pointer overflow-hidden rounded-sm">
        <div 
          className="aspect-[16/9] lg:aspect-[21/9] w-full bg-cover bg-center bg-no-repeat transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2100')" }}
        />
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/20" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
          <span className="text-xs lg:text-sm font-sans font-medium uppercase tracking-[0.25em] mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
            Campaign
          </span>
          <h1 className="text-4xl lg:text-7xl font-bold tracking-tight italic drop-shadow-sm">
            The 2024 Resort Collection
          </h1>
          <p className="mt-4 text-base lg:text-lg font-light tracking-wide font-sans opacity-90">
            Ethereal Bloom
          </p>
          <button className="mt-8 px-8 py-3 border border-white/40 text-white text-xs uppercase tracking-[0.2em] font-sans hover:bg-white hover:text-aurelia-black transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 delay-100">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
