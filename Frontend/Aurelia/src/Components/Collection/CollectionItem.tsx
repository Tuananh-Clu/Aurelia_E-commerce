
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CollectionItemProps {
  title: string;
  subtitle: string;
  image: string;
  aspectRatio?: string;
  className?: string;
  showButton?: boolean;
  id: string;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ 
  title, 
  subtitle, 
  image, 
  aspectRatio = 'aspect-[3/4]', 
  className = '',
  showButton = false,
  id
}) => {
    const navigate = useNavigate();
  return (
    <div className={`flex flex-col gap-4 group cursor-pointer fade-in-up ${className}`} onClick={() => navigate(id)}>
      <div className={`overflow-hidden rounded-sm relative ${aspectRatio}`}>
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none m-3" />
      </div>
      <div className="flex justify-between items-end pt-2 border-t border-transparent group-hover:border-aurelia-light-gray transition-colors duration-500 pb-2">
        <div className="flex flex-col items-start">
          <h3 className="text-2xl lg:text-3xl font-light italic leading-tight group-hover:text-gray-600 transition-colors">
            {title}
          </h3>
          <span className="text-sm text-gray-500 mt-1 font-sans tracking-wide uppercase text-xs font-medium">
            {subtitle}
          </span>
        </div>
        {showButton && (
          <span onClick={() => navigate(id)} className="hidden md:inline-block text-[10px] uppercase font-sans font-bold tracking-[0.2em] border border-aurelia-gray px-4 py-2 rounded-full group-hover:bg-aurelia-black group-hover:text-white transition-all">
            View Collection
          </span>
        )}
      </div>
    </div>
  );
};

export default CollectionItem;
