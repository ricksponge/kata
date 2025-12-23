
import React from 'react';
import { MoveType } from '../types';

interface CharacterSpriteProps {
  currentMove: MoveType | null;
  isKiai: boolean;
  isError?: boolean;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ currentMove, isKiai, isError }) => {
  const isPunch = currentMove === MoveType.OI_ZUKI_JODAN;
  const isBlock = currentMove === MoveType.GEDAN_BARAI;

  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 
      ${isKiai ? 'animate-kiai scale-110' : ''} 
      ${isError ? 'opacity-40 grayscale blur-[1px]' : ''}`}>
      
      {/* Aura de concentration */}
      <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse blur-3xl -z-10"></div>

      <div className={`relative w-48 h-64 transition-all duration-150 transform-gpu`}>
        {/* Tête - Avec bandeau Hachimaki */}
        <div className={`absolute top-0 left-12 w-24 h-24 bg-[#ffdbac] pixel-border z-30 transition-transform ${isPunch ? 'translate-x-2' : ''}`}>
          <div className="absolute top-4 left-0 w-full h-2 bg-white"></div> {/* Bandeau */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-sm"></div> {/* Soleil levant */}
          <div className="absolute top-12 left-4 w-4 h-4 bg-black"></div>
          <div className="absolute top-12 right-4 w-4 h-4 bg-black"></div>
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-red-900 transition-all rounded-t-lg ${isKiai ? 'h-10 bg-red-600' : 'h-2'}`}></div>
        </div>
        
        {/* Corps - Gi blanc avec ombres pixelisées */}
        <div className={`absolute top-24 left-8 w-32 h-24 bg-white pixel-border z-20 shadow-xl transition-all ${isPunch ? 'rotate-6 translate-x-4' : ''}`}>
          {/* Ceinture Noire (Kuro-Obi) */}
          <div className="absolute bottom-4 left-0 w-full h-6 bg-black z-10 flex justify-center">
             <div className="w-2 h-10 bg-black rotate-12 -translate-y-2"></div>
             <div className="w-2 h-10 bg-black -rotate-12 -translate-y-2"></div>
          </div>
          
          {/* Bras Gauche (Hikite ou Frappe) */}
          <div className={`absolute -left-8 top-2 w-10 h-20 bg-white pixel-border transition-all origin-top
            ${isPunch ? 'translate-x-8 -rotate-90 scale-x-[2.0]' : ''}
            ${isBlock ? 'rotate-12 translate-y-4 h-24' : ''}`}>
          </div>
          
          {/* Bras Droit */}
          <div className={`absolute -right-8 top-2 w-10 h-20 bg-white pixel-border transition-all origin-top
            ${isPunch ? '-translate-x-2 rotate-12 h-16 opacity-80' : ''}
            ${isBlock ? '-translate-x-4 rotate-45 h-16' : ''}`}>
          </div>
        </div>

        {/* Jambes - Stance ZENKUTSU-DACHI */}
        <div className="absolute top-44 left-0 w-48 h-24 z-10">
          {/* Jambe Avant (Pliée) */}
          <div className={`absolute left-4 top-0 w-16 h-20 bg-white pixel-border transition-all
            ${isPunch ? 'translate-x-8 scale-x-125' : ''}`}></div>
          {/* Jambe Arrière (Tendue) */}
          <div className={`absolute right-4 top-0 w-12 h-24 bg-white pixel-border transition-all origin-top
            ${isPunch ? 'rotate-45 translate-x-4 scale-y-110' : ''}`}></div>
        </div>

        {/* Pieds */}
        <div className="absolute bottom-0 left-0 w-48 h-4">
          <div className={`absolute left-6 bottom-0 w-14 h-4 bg-[#ffdbac] pixel-border`}></div>
          <div className={`absolute right-0 bottom-0 w-14 h-4 bg-[#ffdbac] pixel-border transition-all ${isPunch ? 'translate-x-8' : ''}`}></div>
        </div>
      </div>
      
      {/* Ombre portée */}
      <div className="w-48 h-4 bg-black/30 rounded-full mt-2 blur-lg shadow-2xl"></div>
    </div>
  );
};

export default CharacterSprite;
