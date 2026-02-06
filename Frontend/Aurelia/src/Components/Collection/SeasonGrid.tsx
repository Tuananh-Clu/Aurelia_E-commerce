
import React, { useContext } from 'react';
import CollectionItem from './CollectionItem';
import { CollectionContext } from '../../contexts/SeasonContext';


const SeasonGrid: React.FC = () => {
  const { collectionData } =  useContext(CollectionContext);
  console.log('Collection Data:', collectionData);
  return (
    <section className="w-full mb-32">
      <div className="flex items-end justify-between mb-12 border-b border-aurelia-gray pb-4">
        <h2 className="text-2xl font-normal tracking-wide">Current Season</h2>
        <span className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-[0.2em]">FW '24 — SS '24</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-x-12">
        <div className="md:col-span-5">
          <CollectionItem 
            id={collectionData[0]?.id || ''}
            title={collectionData[0]?.name || "Winter Edit"}
            subtitle={collectionData[0]?.description || "Cozy Elegance"}
            image={collectionData[0]?.banner || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"}
          />
        </div>

        <div className="hidden md:block md:col-span-1" />
        <div className="md:col-span-6 md:mt-32">
          <CollectionItem 
            id={collectionData[1]?.id || ''}
            title={collectionData[1]?.name || "Accessories Edit"}
            subtitle={collectionData[1]?.description || "Refined Details"}
            aspectRatio="aspect-square"
            image={collectionData[1]?.banner || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"}
          />
        </div>

        <div className="md:col-span-10 md:col-start-2 mt-12">
          <CollectionItem 
            id= {collectionData[2]?.id || ''}
            title={collectionData[2]?.name || "Ready-to-Wear"} 
            subtitle={collectionData[2]?.description || "Signature Silhouettes"}
            aspectRatio="aspect-[2/1]"
            showButton={true}
            image={collectionData[2]?.banner || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600"}
          />
        </div>
      </div>
    </section>
  );
};

export default SeasonGrid;
