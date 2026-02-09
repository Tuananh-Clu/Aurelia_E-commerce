
import { useContext, useMemo } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { ArrowBigLeftDash } from "lucide-react";


export const Story = () => {
  const { StoryBanner } = useContext(AdminContext);
  const banner=useMemo(
    () => (Array.isArray(StoryBanner) ? StoryBanner : []),
    [StoryBanner]
  );

return (
    <>
    {
      banner.map((data: any, index: number) => {
        if (data.layout=== 'A') {
          return <StoryA key={index} data={data} />;
        }
        else if (data.layout === 'B') {
          return <StoryB key={index} data={data} />;
        }
        else if (data.layout === 'C') {
          return <StoryC key={index} data={data} />;
        }
        return null;
      }
      )
    }
    </>
)
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
              <ArrowBigLeftDash className="w-5 h-5 transform rotate-180 transition-transform duration-500 group-hover:-translate-x-2" />
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