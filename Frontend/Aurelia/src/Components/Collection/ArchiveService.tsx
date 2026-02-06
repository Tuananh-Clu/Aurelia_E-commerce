
import { useContext } from 'react';
import CollectionItem from './CollectionItem';
import { CollectionContext } from '../../contexts/SeasonContext';


const ArchivesSection= () => {
  const {collectionData}=useContext(CollectionContext);
  return (
    <section className="w-full mb-20">
      <div className="relative w-full flex items-center justify-center my-24 fade-in-up">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-aurelia-gray" />
        </div>
        <div className="relative flex justify-center bg-white px-8">
          <span className="text-sm font-sans font-bold tracking-[0.25em] uppercase text-gray-400">
            Aurelia Archives
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-24">
        <div className="fade-in-up">
          <CollectionItem 
            id={collectionData[3]?.id || ''}
            title={collectionData[3]?.name|| "Spring Summer '23"} 
            subtitle={collectionData[3]?.description|| "Modern Nostalgia"}
            aspectRatio="aspect-[4/5]"
            className="grayscale-[30%] hover:grayscale-0 transition-all duration-700"
            image={collectionData[3]?.banner || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"}
          />
        </div>
        <div className="md:mt-24 fade-in-up">
          <CollectionItem 
            id={collectionData[4]?.id || ''}
            title={collectionData[4]?.name || 'Summer Fall \'23'}
            subtitle={collectionData[4]?.description || 'Ethereal Vibes'}
            aspectRatio="aspect-[4/5]"
            className="grayscale-[30%] hover:grayscale-0 transition-all duration-700"
            image={collectionData[4]?.banner || "https://images.unsplash.com/photo-1495121605193-b116b5b09a6c?auto=format&fit=crop&q=80&w=800"}
          />
        </div>
      </div>
    </section>
  );
};

export default ArchivesSection;
