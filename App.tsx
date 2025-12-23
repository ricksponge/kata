
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MoveType, GameState, Kata, SenseiQuote } from './types';
import { KATAS, MOVE_KEYS } from './constants';
import { getSenseiWisdom } from './services/geminiService';
import { audioService } from './services/audioService';
import Dojo from './components/Dojo';
import CharacterSprite from './components/CharacterSprite';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [currentKata, setCurrentKata] = useState<Kata | null>(null);
  const [userSequence, setUserSequence] = useState<MoveType[]>([]);
  const [lastMove, setLastMove] = useState<MoveType | null>(null);
  const [senseiQuote, setSenseiQuote] = useState<SenseiQuote>({
    text: "Oss ! Bienvenue dans mon dojo. Le Karaté commence et finit par le respect. Choisis ton Kata.",
    mood: 'peaceful'
  });
  const [isLoadingSensei, setIsLoadingSensei] = useState(false);

  const moveTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchSenseiWisdom = useCallback(async (context: string) => {
    setIsLoadingSensei(true);
    try {
      const quote = await getSenseiWisdom(context);
      setSenseiQuote(quote);
    } catch (error) {
      console.error("Failed to fetch sensei wisdom", error);
    } finally {
      setIsLoadingSensei(false);
    }
  }, []);

  const startKata = (kata: Kata) => {
    setCurrentKata(kata);
    setUserSequence([]);
    setGameState(GameState.STARTING);
    setSenseiQuote({ text: `Maîtrise ton souffle pour ${kata.name}. Prépare-toi !`, mood: 'strict' });
    
    setTimeout(() => {
        setGameState(GameState.PERFORMING);
    }, 1500);
  };

  const handleMove = useCallback((move: MoveType) => {
    if (gameState !== GameState.PERFORMING || !currentKata) return;

    audioService.playMove(move);
    setLastMove(move);
    
    if (moveTimeout.current) clearTimeout(moveTimeout.current);
    moveTimeout.current = setTimeout(() => setLastMove(null), 350);

    const nextExpectedMove = currentKata.sequence[userSequence.length];
    
    if (move === nextExpectedMove) {
        const newSequence = [...userSequence, move];
        setUserSequence(newSequence);

        if (newSequence.length === currentKata.sequence.length) {
            setGameState(GameState.SUCCESS);
            audioService.playSuccess();
            fetchSenseiWisdom(`a parfaitement exécuté le kata ${currentKata.name}`);
        }
    } else {
        setGameState(GameState.FAIL);
        audioService.playFail();
        fetchSenseiWisdom(`a confondu ${nextExpectedMove} avec un autre mouvement`);
    }
  }, [gameState, currentKata, userSequence, fetchSenseiWisdom]);

  const getMoveIcon = (move: MoveType) => {
    switch (move) {
      case MoveType.PUNCH: return '⬆️';
      case MoveType.BLOCK: return '⬇️';
      case MoveType.KICK: return '↔️';
      case MoveType.KIAI: return '🔥';
      default: return '?';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.IDLE) return;
      const move = MOVE_KEYS[e.key];
      if (move) handleMove(move);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, gameState]);

  const reset = () => {
    setGameState(GameState.IDLE);
    setCurrentKata(null);
    setUserSequence([]);
    setLastMove(null);
    setSenseiQuote({ text: "L'entraînement ne s'arrête jamais. Prêt pour la suite ?", mood: 'peaceful' });
  };

  return (
    <div className="w-screen h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-full max-h-[800px] pixel-border border-[10px] border-black relative overflow-hidden bg-white shadow-2xl">
        
        <Dojo>
          <CharacterSprite 
            currentMove={lastMove} 
            isKiai={lastMove === MoveType.KIAI} 
            isError={gameState === GameState.FAIL}
          />
          
          {/* HUD DIDACTIQUE */}
          <div className="absolute top-0 left-0 w-full p-8 pointer-events-none">
            {/* Sensei Talk */}
            <div className={`bg-amber-50/95 p-6 border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 transform ${isLoadingSensei ? 'translate-y-2 opacity-50' : 'translate-y-0 opacity-100'}`}>
               <div className="flex justify-between items-center mb-2">
                 <p className="text-[12px] text-red-900 font-bold uppercase tracking-tighter">SENSEI HIROSHI</p>
                 <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-sm"></div>
               </div>
               <p className="text-[12px] leading-relaxed text-neutral-800 font-medium">"{senseiQuote.text}"</p>
            </div>

            {/* Technique en cours */}
            {lastMove && (
              <div className="absolute top-48 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 border-2 border-white animate-bounce shadow-xl z-50">
                <p className="text-[14px] font-black">{lastMove.toUpperCase()}</p>
              </div>
            )}

            {/* Séquence Kata */}
            {gameState === GameState.PERFORMING && currentKata && (
              <div className="flex flex-col items-center mt-4">
                <h2 className="text-[16px] bg-red-800 text-white px-6 py-2 mb-4 border-4 border-black italic">
                   KATA : {currentKata.name.toUpperCase()}
                </h2>
                <div className="flex gap-4 p-4 bg-white/30 backdrop-blur-md border-2 border-black/10 rounded-xl">
                  {currentKata.sequence.map((move, idx) => (
                    <div 
                      key={idx} 
                      className={`w-14 h-14 border-4 border-black flex flex-col items-center justify-center transition-all duration-300 transform
                        ${idx < userSequence.length ? 'bg-emerald-500 text-white scale-110 -rotate-2' : 'bg-white text-black opacity-30'}
                        ${idx === userSequence.length ? 'bg-amber-400 opacity-100 animate-pulse scale-125 z-10' : ''}
                      `}
                    >
                      <span className="text-[16px]">{getMoveIcon(move)}</span>
                      <span className="text-[6px] font-bold mt-1 opacity-60">
                        {idx === userSequence.length ? 'ACTION' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Menus */}
          {gameState === GameState.IDLE && (
            <div className="flex flex-col gap-6 items-center bg-amber-50 p-12 border-[6px] border-black pointer-events-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-50">
              <h1 className="text-3xl text-red-900 font-black tracking-tight underline decoration-4 mb-2">PIXEL KATA MASTER</h1>
              <p className="text-[10px] text-neutral-600 text-center max-w-[400px]">
                Apprenez les techniques ancestrales du Karaté Shotokan. Suivez le rythme du Sensei.
              </p>
              
              <div className="grid grid-cols-1 gap-4 w-full">
                {KATAS.map(kata => (
                  <button
                    key={kata.id}
                    onClick={() => startKata(kata)}
                    className="w-full bg-black text-white p-5 hover:bg-red-800 hover:-translate-y-1 hover:shadow-[0_4px_0_0_#4a1d1d] transition-all text-[11px] flex justify-between items-center active:translate-y-0"
                  >
                    <div className="text-left">
                        <span className="block font-bold mb-1 text-amber-400">{kata.name}</span>
                        <span className="text-[7px] opacity-70 italic">{kata.description}</span>
                    </div>
                    <span className={`px-3 py-1 text-[8px] border-2 border-white/40 ${kata.difficulty === 'Maître' ? 'bg-red-900' : 'bg-neutral-800'}`}>
                        {kata.difficulty}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-6 bg-white border-4 border-black w-full shadow-inner">
                <p className="text-[9px] text-center font-bold mb-4 border-b-2 border-black pb-2">CONTRÔLES DU DOJO</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[8px] font-medium">
                    <div className="flex justify-between"><span>⬆️ POING</span> <span className="text-red-700 font-bold">OI-ZUKI</span></div>
                    <div className="flex justify-between"><span>⬇️ PARADE</span> <span className="text-red-700 font-bold">GEDAN-BARAI</span></div>
                    <div className="flex justify-between"><span>↔️ PIED</span> <span className="text-red-700 font-bold">MAE-GERI</span></div>
                    <div className="flex justify-between"><span>⌨️ KIAI</span> <span className="text-red-700 font-bold">CRI</span></div>
                </div>
              </div>
            </div>
          )}

          {/* États de fin */}
          {(gameState === GameState.SUCCESS || gameState === GameState.FAIL) && (
            <div className={`flex flex-col gap-6 items-center p-12 border-[8px] border-black pointer-events-auto z-50 transform animate-in zoom-in duration-300 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]
              ${gameState === GameState.SUCCESS ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <h2 className={`text-3xl font-black ${gameState === GameState.SUCCESS ? 'text-emerald-800' : 'text-red-800'}`}>
                {gameState === GameState.SUCCESS ? 'MAÎTRISE !' : 'ENTRAÎNEMENT...'}
              </h2>
              <p className="text-[12px] text-center max-w-[300px] leading-loose italic">
                {gameState === GameState.SUCCESS ? "Ton corps et ton esprit sont en harmonie." : "L'échec est le terreau de la réussite. Analyse ta posture."}
              </p>
              <button 
                onClick={reset}
                className="bg-black text-white px-10 py-5 text-[11px] hover:bg-neutral-800 border-b-4 border-neutral-600 active:border-0"
              >
                RETOURNER AU DOJO
              </button>
            </div>
          )}
        </Dojo>

        {/* CRT Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-repeat bg-[length:100%_4px] bg-gradient-to-b from-transparent to-black"></div>
      </div>
    </div>
  );
};

export default App;
