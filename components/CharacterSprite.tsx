
import React from 'react';
import { MoveType } from '../types';

interface CharacterSpriteProps {
  currentMove: MoveType | null;
  isKiai: boolean;
  isError?: boolean;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ currentMove, isKiai, isError }) => {
  const getMoveClass = () => {
    switch (currentMove) {
      case MoveType.PUNCH: return 'anim-punch scale-110';
      case MoveType.KICK: return 'anim-kick scale-110';
      case MoveType.BLOCK: return 'anim-block scale-95';
      default: return 'animate-pulse';
    }
  };

  return (
    <div className={`relative flex flex-col items-center transition-all duration-150 
      ${isKiai ? 'animate-kiai' : ''} 
      ${isError ? 'opacity-50 grayscale shake-error' : ''}`}>
      
      {/* Action Lines (Lignes d'action) */}
      {currentMove && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-40 z-0">
          <div className="absolute inset-0 border-t-4 border-red-500 animate-ping rounded-full"></div>
          <div className="absolute top-0 left-1/2 w-1 h-32 bg-white origin-bottom rotate-45"></div>
          <div className="absolute top-0 right-1/2 w-1 h-32 bg-white origin-bottom -rotate-45"></div>
        </div>
      )}

      <div className={`relative w-48 h-64 transition-transform duration-75 ${getMoveClass()} transform-gpu`}>
        {/* Tête */}
        <div className="absolute top-0 left-12 w-24 h-24 bg-[#ffdbac] pixel-border z-20">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#333]"></div> {/* Cheveux plus sombres */}
          <div className="absolute top-10 left-4 w-4 h-4 bg-black"></div>
          <div className="absolute top-10 right-4 w-4 h-4 bg-black"></div>
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-4 border-2 border-red-900 transition-all ${isKiai ? 'h-10 rounded-full bg-red-800' : 'bg-[#d2b48c]'}`}></div>
        </div>
        
        {/* Corps - Gi de Karaté */}
        <div className="absolute top-24 left-8 w-32 h-24 bg-white pixel-border z-10 shadow-lg">
          <div className="absolute bottom-4 left-0 w-full h-4 bg-black"></div>
          
          <div className={`absolute -left-10 top-2 w-10 h-16 bg-white pixel-border transition-all origin-top-right
            ${currentMove === MoveType.PUNCH ? '-translate-x-12 -rotate-90 scale-x-150' : ''}
            ${currentMove === MoveType.BLOCK ? 'rotate-45 translate-y-4' : ''}`}>
          </div>
          
          <div className={`absolute -right-10 top-2 w-10 h-16 bg-white pixel-border transition-all origin-top-left
            ${currentMove === MoveType.PUNCH ? 'translate-x-12 -rotate-90 scale-x-150' : ''}`}>
          </div>
        </div>

        {/* Jambes */}
        <div className="absolute top-48 left-8 w-32 h-16">
          <div className={`absolute left-0 top-0 w-14 h-16 bg-white pixel-border transition-all
            ${currentMove === MoveType.KICK ? 'rotate-90 -translate-y-12 translate-x-12' : ''}`}></div>
          <div className="absolute right-0 top-0 w-14 h-16 bg-white pixel-border"></div>
        </div>

        {/* Pieds */}
        <div className="absolute bottom-0 left-8 w-32 h-4">
          <div className="absolute left-0 bottom-0 w-14 h-4 bg-[#ffdbac] pixel-border"></div>
          <div className="absolute right-0 bottom-0 w-14 h-4 bg-[#ffdbac] pixel-border"></div>
        </div>
      </div>
      
      <div className="w-32 h-4 bg-black/40 rounded-full mt-4 blur-md"></div>
    </div>
  );
};

export default CharacterSprite;
