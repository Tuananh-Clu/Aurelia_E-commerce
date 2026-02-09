import { ArrowBigLeft } from "lucide-react";

export const LayoutPreview = ({ current, statusState }: any) => {
  return (
    <div className="relative w-full  overflow-hidden">
      {statusState === "Main" ? (
        current.layout === "A" ? (
          <HeroA data={current} />
        ) : current.layout === "B" ? (
          <HeroB data={current} />
        ) : current.layout === "C" ? (
          <HeroC data={current} />
        ) : current.layout === "D" ? (
          <HeroD data={current} />
        ) : null
      ) : statusState === "Story" ? (
        current.layout === "A" ? (
          <StoryA data={current} />
        ) : current.layout === "B" ? (
          <StoryB data={current} />
        ) : current.layout === "C" ? (
          <StoryC data={current} />
        ) : null
      ) : null}
    </div>
  );
};

export const HeroA = ({ data }: { data: any }) => {
  return (
    <section className="relative w-full flex flex-col lg:flex-row min-h-screen pt-10">
      <div className="flex-grow lg:w-[60%] flex flex-col justify-between p-8 md:p-16 lg:p-24 bg-white dark:bg-background-dark z-10">
        <div className="max-w-md mt-16 md:mt-24">
          <p
            className="text-[10px] tracking-widest-plus uppercase mb-8 animate-pulse"
            style={{ color: data.colorText }}
          >
            {data.h1}
          </p>
          <h2
            className="text-2xl md:text-3xl z-40 leading-relaxed font-light"
            style={{ color: data.colorText }}
          >
            {data.pagaraph}
          </h2>
        </div>

        <div className="mt-12 mb-8">
          <a
            href="#"
            className="group inline-flex items-center gap-6 py-4 relative"
          >
            <span
              className="text-[10px] tracking-ultra-wide uppercase font-bold"
              style={{ color: data.colorText }}
            >
              {data.textInButton}
            </span>
            <div className="text-primary group-hover:translate-x-4 transition-transform duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
            <div className="absolute bottom-2 left-0 w-0 h-[1px] bg-black dark:bg-white group-hover:w-[60%] transition-all duration-700"></div>
          </a>
        </div>
      </div>
      <div className="relative flex-grow lg:w-[40%] flex min-h-[500px] lg:min-h-0 bg-transparent z-10 border-l border-gray-100 dark:border-gray-800">
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none -translate-x-3/4  overflow-hidden">
          <h1
            className="vertical-text text-5xl md:text-7xl lg:text-8xl font-thin tracking-ultra-wide uppercase whitespace-nowrap py-12 px-2 select-none"
            style={{ color: data.colorMainTitle }}
          >
            {data.mainTitle}
          </h1>
        </div>
        <div className="w-full h-full relative overflow-hidden">
          <div
            className="w-full h-full bg-cover absolute bg-center grayscale transition-transform duration-[4000ms] hover:scale-110 z-50"
            style={{
              backgroundImage: `url(${data.linkUrl})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-black/10 mix-blend-soft-light pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)] pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export const HeroB = ({ data }: { data: any }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(246,246,248,0.3), rgba(246,246,248,0.1)), url(${data.linkUrl})`,
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] mix-blend-soft-light"></div>
        <div className="absolute inset-0 marble-gradient opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-luxury">
        <div className="flex flex-col gap-10 items-center">
          <h1
            className="text-5xl md:text-7xl lg:text-9xl font-extralight tracking-extrawide leading-none text-glow drop-shadow-sm"
            style={{ color: data.colorMainTitle }}
          >
            {data.mainTitle}
          </h1>
          <div className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-aurelia-silver to-transparent"></div>

          <div className="flex flex-col gap-8 items-center max-w-xl">
            <p
              className="text-sm md:text-base font-light tracking-[0.2em] italic leading-relaxed"
              style={{ color: data.colorText }}
            >
              {data.pagaraph}
            </p>

            <a
              href="#shop"
              className="group relative flex flex-col items-center pt-2"
            >
              <span className="text-[11px] md:text-xs font-medium tracking-[0.6em] uppercase transition-all duration-500 group-hover:text-aurelia-purple"></span>
              <span className="mt-3 block h-[1px] w-0 bg-aurelia-purple transition-all duration-700 group-hover:w-16"></span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 hidden lg:block">
        <p className="text-[9px] uppercase tracking-[0.5em] text-gray-400 font-light italic">
          Variant 8 / 08
        </p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-light group-hover:tracking-[0.5em] transition-all">
          Explore
        </span>
        <div className="h-16 w-[1px] bg-gradient-to-b from-aurelia-silver to-transparent"></div>
      </div>
    </section>
  );
};
const HeroC = ({ data }: { data: any }) => {
  return (
    <main className="relative pt-32 pb-24 overflow-hidden h-[220vh] flex flex-col">
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <span className="vertical-text text-[10px] tracking-[0.8em] font-medium uppercase text-gray-300">
          Precision & Authority
        </span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block text-right">
        <span
          className="vertical-text rotate-180 text-[10px] tracking-[0.8em] font-medium uppercase"
          style={{ color: data.colorMainTitle }}
        >
          {data.mainTitle}
        </span>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 flex flex-col items-center">
        <div
          className="text-center mb-12 animate-fade-in"
          key={`header-${data.id}`}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-200" />
            <div className="h-[1px] w-12 bg-gray-200" />
            <span
              className="text-[10px] tracking-[0.3em] font-semibold uppercase"
              style={{ color: data.colorText }}
            >
              {data.subtitle}
            </span>
          </div>
          <h1
            className="text-6xl md:text-8xl lg:text-[110px] font-black serif uppercase tracking-tight leading-none"
            style={{ color: data.colorMainTitle }}
          >
            {data.h1.split(" ")[0]}
            <br />
            {data.h1.split(" ")[1]}
          </h1>
        </div>
        <div
          className="relative group max-w-2xl w-full aspect-[4/5] mb-16 animate-fade-in"
          key={`img-${data.id}`}
        >
          <div className="absolute inset-0 border-[1px] border-black/5 translate-x-4 translate-y-4 -z-10" />
          <div className="w-full h-full overflow-hidden shadow-2xl bg-gray-100">
            <img
              src={data.linkUrl}
              alt={data.title}
              className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
            />
          </div>

          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/40" />
        </div>

        <div
          className="max-w-lg text-center space-y-10 animate-fade-in"
          key={`desc-${data.id}`}
        >
          <p
            className="text-lg md:text-xl font-light leading-relaxed serif italic"
            style={{ color: data.colorText }}
          >
            {data.pagaraph}
          </p>

          <button
            className="px-12 py-5 text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:opacity-80 transition-colors shadow-xl"
            style={{ backgroundColor: data.colorMainTitle }}
          >
            Explore Collection
          </button>
        </div>
      </div>
    </main>
  );
};

const HeroD = ({ data }: { data: any }) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center relative px-4 h-screen overflow-hidden">
      <div className="text-center">
        <h1
          className="text-[10vw] md:text-[14vw] font-black leading-none tracking-[-0.05em] silver-foil-text italic select-none"
          style={{ color: data.colorMainTitle }}
        >
          {data.mainTitle}
        </h1>
        <p
          className="mt-2 text-[10px] md:text-xs uppercase tracking-ultra-wide"
          style={{ color: data.colorText }}
        >
          {data.pagaraph}
        </p>
      </div>

      <div className="mt-68">
        <a
          href="#"
          className="relative inline-block text-sm md:text-base tracking-very-wide font-light uppercase silver-foil-text cta-line group"
          style={{ color: data.colorText }}
        >
          {data.textButton}
        </a>
      </div>

      <div className="absolute bottom-16 right-8 md:bottom-24 md:right-24 w-36 md:w-56 lg:w-72 aspect-[3/4] bg-gray-200 rounded-sm shadow-2xl overflow-hidden animate-float">
        <img
          src={data.linkUrl}
          alt="Aurelia Collection"
          className="w-full h-full object-cover grayscale brightness-90 hover:scale-105 transition-transform duration-[2s]"
        />
        <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay"></div>
      </div>

      <div className="absolute bottom-16 left-8 md:left-24 flex flex-col items-center gap-6">
        <span
          className="text-[10px] tracking-widest font-bold silver-foil-text"
          style={{ color: data.colorText }}
        >
          05 / 05
        </span>
        <div className="w-[1px] h-32 bg-gradient-to-b from-luxury-silver via-gray-300 to-transparent"></div>
      </div>
    </main>
  );
};

export const StoryA = ({ data }: any) => {
  return (
    <section className="relative w-full h-[90vh] flex items-center overflow-hidden bg-zinc-900 dark:bg-black">
      <div className="absolute inset-0 w-full h-full">
        <img
          alt="High-end fashion aesthetic background"
          className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
          src={data.linkUrl}
        />
        <div className="absolute inset-0 banner-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="w-16 h-0.5 bg-primary mb-8"></div>
          <p className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-tight mb-8 tracking-tighter drop-shadow-lg">
            {data.mainTitle}
          </p>
          <div className="flex flex-col md:row items-start md:items-center gap-6">
            <h1 className="text-white/80 text-xl md:text-2xl font-serif tracking-widest uppercase">
              {data.h1}
            </h1>
            <div className="hidden md:block w-12 h-px bg-white/20"></div>
            <p className="text-white/60 text-base leading-relaxed font-light max-w-sm">
              {data.pagaraph}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const StoryB = ({ data }: {data: any}) => {
  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px] lg:h-[600px] bg-charcoal overflow-hidden shadow-2xl rounded-sm">
      <div className="w-full md:w-[42%] flex flex-col justify-center p-10 md:p-16 lg:p-24 bg-black border-r border-white/5 relative">
        <div className="absolute top-0 left-0 w-1 h-20 bg-primary opacity-50"></div>
        <div className="flex flex-col gap-6 md:gap-8">
          <span className=" text-xl md:text-2xl font-serif tracking-wide animate-in fade-in slide-in-from-left-4 duration-700">
            {data.mainTitle}
          </span>

          <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight animate-in fade-in slide-in-from-left-6 duration-1000">
            {data.h1}
          </h1>

          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-sm animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            {data.pagaraph}
          </p>

          <div className="mt-4 md:mt-6">
            <button className="group relative overflow-hidden inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-white py-2">
              <span className="relative z-10">Discover More</span>
              <ArrowBigLeft className="w-5 h-5 transform rotate-180 transition-transform duration-500 group-hover:-translate-x-2" />
              <span className="absolute bottom-0 left-0 w-8 h-px bg-primary transition-all duration-500 group-hover:w-full"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[58%] relative min-h-[400px] md:h-full group">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10 md:hidden"></div>
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay z-10"></div>

        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-[3000ms] group-hover:scale-110"
          style={{ backgroundImage: `url("${data.linkUrl}")` }}
          aria-label="Artistic close-up of luxury hangers"
        ></div>
        <div className="absolute bottom-8 right-8 z-20 hidden lg:flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-8 h-px bg-primary"></div>
          <span className="text-[10px] uppercase tracking-widest text-white/70">
            Signature Series // SS24
          </span>
        </div>
      </div>
    </section>
  );
};

export const StoryC = ({ data }: {data: any}) => {
  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden bg-luxury-charcoal dark:bg-black">
      <div className="absolute inset-0 w-full h-full">
        <img 
          alt="High-end silver designer hangers" 
          className="w-full h-full object-cover object-right opacity-80" 
          src={data.linkUrl}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/1920/600?grayscale';
          }}
        />
        <div className="absolute inset-0 banner-gradient"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <p className=" text-5xl md:text-7xl lg:text-8xl text-white font-serif  leading-tight mb-6  animate-fade-in-up">
            {data.mainTitle}
          </p>
          <h1 className="text-white text-2xl md:text-3xl font-light mb-4 tracking-wide uppercase">
            {data.h1}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed font-light max-w-md">
            {data.pagaraph}
          </p>
        </div>
      </div>

    </section>
  );
}