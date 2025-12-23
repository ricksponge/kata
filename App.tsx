
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
  const [breathLevel, setBreathLevel] = useState(0);
  const [senseiQuote, setSenseiQuote] = useState<SenseiQuote>({
    text: "Oss ! Prêt pour le Heian Shodan ? Observe ton souffle avant chaque technique.",
    mood: 'peaceful'
  });
  const [isLoadingSensei, setIsLoadingSensei] = useState(false);

  const moveTimeout = useRef<NodeJS.Timeout | null>(null);
  const breathInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchSenseiWisdom = useCallback(async (context: string) => {
    setIsLoadingSensei(true);
    try {
      const quote = await getSenseiWisdom(context);
      setSenseiQuote(quote);
    } catch (error) {
      console.error("Gemini Error", error);
    } finally {
      setIsLoadingSensei(false);
    }
  }, []);

  // Mécanique de respiration (Zanshin)
  useEffect(() => {
    if (gameState === GameState.PERFORMING) {
      breathInterval.current = setInterval(() => {
        setBreathLevel(prev => (prev + 5) % 100);
      }, 50);
    } else {
      if (breathInterval.current) clearInterval(breathInterval.current);
      setBreathLevel(0);
    }
    return () => { if (breathInterval.current) clearInterval(breathInterval.current); };
  }, [gameState]);

  const startKata = (kata: Kata) => {
    setCurrentKata(kata);
    setUserSequence([]);
    setGameState(GameState.STARTING);
    audioService.playZenAmbience();
    
    setTimeout(() => {
        setGameState(GameState.PERFORMING);
        setSenseiQuote({ text: "Concentration... Écoute l'ordre et exécute.", mood: 'strict' });
    }, 2000);
  };

  const handleMove = useCallback((move: MoveType) => {
    if (gameState !== GameState.PERFORMING || !currentKata) return;

    audioService.playMove(move);
    setLastMove(move);
    
    if (moveTimeout.current) clearTimeout(moveTimeout.current);
    moveTimeout.current = setTimeout(() => setLastMove(null), 400);

    const nextExpectedMove = currentKata.sequence[userSequence.length];
    
    if (move === nextExpectedMove) {
        const newSequence = [...userSequence, move];
        setUserSequence(newSequence);

        if (newSequence.length === currentKata.sequence.length) {
            setGameState(GameState.SUCCESS);
            audioService.playSuccess();
            fetchSenseiWisdom(`a maîtrisé Heian Shodan avec un bon rythme.`);
        }
    } else {
        setGameState(GameState.FAIL);
        audioService.playFail();
        fetchSenseiWisdom(`a fait une erreur à l'étape ${userSequence.length + 1} (${nextExpectedMove}).`);
    }
  }, [gameState, currentKata, userSequence, fetchSenseiWisdom]);

  const getMoveIcon = (move: MoveType) => {
    switch (move) {
      case MoveType.OI_ZUKI_JODAN: return '👊';
      case MoveType.GEDAN_BARAI: return '🛡️';
      case MoveType.KIAI: return '🔥';
      case MoveType.YAME: return '🙏';
      default: return '🥋';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.IDLE) return;
      const move = MOVE_KEYS[e.key] || MOVE_KEYS[e.key.toLowerCase()];
      if (move) handleMove(move);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, gameState]);

  // Calcul du mouvement actuel à afficher
  const currentTargetMove = currentKata && userSequence.length < currentKata.sequence.length 
    ? currentKata.sequence[userSequence.length] 
    : null;

  return (
    <div className="w-screen h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-full max-h-[850px] pixel-border border-[12px] border-[#2c1810] relative overflow-hidden bg-[#fdf5e6] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        <Dojo>
          <CharacterSprite 
            currentMove={lastMove} 
            isKiai={lastMove === MoveType.KIAI} 
            isError={gameState === GameState.FAIL}
          />
          
          {/* OVERLAY DIDACTIQUE */}
          <div className="absolute top-0 left-0 w-full p-8 pointer-events-none flex flex-col items-center h-full">
            
            {/* Dialogue du Sensei */}
            <div className={`w-full max-w-2xl bg-[#fff9ea] p-6 border-4 border-[#5d2e0a] shadow-[10px_10px_0px_rgba(93,46,10,0.2)] transition-all duration-700 ${isLoadingSensei ? 'opacity-40 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
               <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-black flex items-center justify-center rounded-sm">
                    <span className="text-white text-[10px]">師</span>
                  </div>
                  <h3 className="text-[14px] text-red-900 font-black tracking-widest uppercase">Sensei Hiroshi</h3>
               </div>
               <p className="text-[12px] leading-relaxed text-black italic font-serif">"{senseiQuote.text}"</p>
            </div>

            {/* INSTRUCTION UNIQUE (Le mouvement à reproduire) */}
            {gameState === GameState.PERFORMING && currentTargetMove && (
              <div className="mt-12 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-white border-8 border-black p-8 shadow-[15px_15px_0px_rgba(0,0,0,0.1)] flex flex-col items-center min-w-[300px]">
                  <p className="text-[10px] text-gray-500 font-bold mb-4 tracking-widest">ÉXÉCUTEZ MAINTENANT :</p>
                  
                  <div className="text-6xl mb-6 transform hover:scale-110 transition-transform">
                    {getMoveIcon(currentTargetMove)}
                  </div>
                  
                  <h2 className="text-[20px] text-red-900 font-black mb-2 text-center">
                    {currentTargetMove.toUpperCase()}
                  </h2>
                  
                  <div className="h-1 w-24 bg-black mb-4"></div>
                  
                  <p className="text-[10px] text-black font-serif italic text-center">
                    "{currentKata?.translations[currentTargetMove]}"
                  </p>
                </div>

                {/* Indicateur de progression numérique */}
                <div className="mt-6 bg-black text-white px-4 py-2 border-2 border-white text-[10px]">
                  ÉTAPE {userSequence.length + 1} / {currentKata?.sequence.length}
                </div>
              </div>
            )}

            {/* COMMANDES EN BAS À GAUCHE */}
            {gameState === GameState.PERFORMING && (
              <div className="absolute bottom-8 left-8 flex flex-col gap-2 bg-black/80 text-white p-4 border-2 border-white/20 backdrop-blur-sm pointer-events-none">
                <p className="text-[7px] font-bold text-amber-400 mb-2 border-b border-white/20 pb-1 tracking-widest">COMMANDES</p>
                <div className="flex flex-col gap-1 text-[7px]">
                  <div className="flex justify-between gap-4"><span>⬆️ / W</span> <span className="text-red-400">OI-ZUKI</span></div>
                  <div className="flex justify-between gap-4"><span>⬇️ / S</span> <span className="text-red-400">GEDAN-BARAI</span></div>
                  <div className="flex justify-between gap-4"><span>SPACE</span> <span className="text-red-400">KIAI!</span></div>
                  <div className="flex justify-between gap-4"><span>SHIFT</span> <span className="text-red-400">YAME</span></div>
                </div>
              </div>
            )}

            {/* Jauge de Zanshin (Respiration) - Plus discrète en bas */}
            {gameState === GameState.PERFORMING && (
              <div className="absolute bottom-10 right-10 flex flex-col items-end">
                <p className="text-[8px] text-black font-bold mb-1 uppercase opacity-60">Zanshin</p>
                <div className="w-32 h-3 bg-[#333] border-2 border-black relative overflow-hidden">
                   <div 
                     className="h-full bg-red-600 transition-all duration-75" 
                     style={{ width: `${breathLevel}%` }}
                   ></div>
                </div>
              </div>
            )}
          </div>

          {/* Menus de démarrage et fin */}
          {gameState === GameState.IDLE && (
            <div className="flex flex-col items-center bg-[#fff9ea] p-16 border-[8px] border-[#5d2e0a] shadow-[20px_20px_0px_#2c1810] z-50 animate-in fade-in zoom-in duration-500">
              <h1 className="text-4xl text-black font-black mb-2 tracking-tighter">HEIAN SHODAN</h1>
              <p className="text-[10px] text-red-800 font-bold mb-8 uppercase tracking-[0.3em]">L'art de la Paix Fondamentale</p>
              
              <button
                onClick={() => startKata(KATAS[0])}
                className="group relative bg-black text-white px-12 py-6 hover:bg-red-900 transition-all shadow-[8px_8px_0px_#5d2e0a] active:shadow-none active:translate-x-2 active:translate-y-2"
              >
                <span className="text-[14px] font-black">COMMENCER L'APPRENTISSAGE</span>
              </button>

              <div className="mt-12 grid grid-cols-2 gap-8 w-full border-t-2 border-black/10 pt-8">
                 <div className="text-[9px]">
                    <p className="font-bold mb-3 border-b border-black pb-1">COMMANDES</p>
                    <p className="mb-1">⬆️ / W : OI-ZUKI JODAN</p>
                    <p className="mb-1">⬇️ / S : GEDAN-BARAI</p>
                    <p className="mb-1">ESPACE : KIAI !</p>
                    <p>SHIFT : YAME</p>
                 </div>
                 <div className="text-[9px]">
                    <p className="font-bold mb-3 border-b border-black pb-1">PROGRESSION</p>
                    <p className="leading-relaxed opacity-70">Reproduisez chaque technique annoncée par le Sensei pour avancer dans le Kata.</p>
                 </div>
              </div>
            </div>
          )}

          {/* États de fin */}
          {gameState === GameState.SUCCESS && (
            <div className="flex flex-col items-center bg-emerald-50 p-16 border-[8px] border-emerald-900 shadow-[20px_20px_0px_#064e3b] z-50">
              <h2 className="text-4xl text-emerald-900 font-black mb-4 uppercase">Parfait !</h2>
              <p className="text-[12px] text-center italic mb-8 max-w-[400px]">
                "La fluidité naît de la répétition." Tu as complété Heian Shodan avec la précision d'un samouraï.
              </p>
              <button 
                onClick={() => setGameState(GameState.IDLE)}
                className="bg-emerald-900 text-white px-12 py-5 text-[12px] font-black"
              >
                RETOUR AU DOJO
              </button>
            </div>
          )}

          {gameState === GameState.FAIL && (
            <div className="flex flex-col items-center bg-red-50 p-16 border-[8px] border-red-900 shadow-[20px_20px_0px_#450a0a] z-50">
              <h2 className="text-4xl text-red-900 font-black mb-4">MAUVAISE GARDE</h2>
              <p className="text-[12px] text-center italic mb-8">Ce n'était pas le mouvement attendu. Respirez et reprenez depuis le début.</p>
              <button 
                onClick={() => setGameState(GameState.IDLE)}
                className="bg-red-900 text-white px-12 py-5 text-[12px] font-black"
              >
                RÉESSAYER
              </button>
            </div>
          )}
        </Dojo>

        {/* Grains de papier et scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]"></div>
      </div>
    </div>
  );
};

export default App;
