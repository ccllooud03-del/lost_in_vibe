import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { VibeCard } from './components/VibeCard';
import { AnimatePresence } from 'framer-motion';
import { localProverbs } from './data/proverbs';

function shuffleSequence(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState('left');

  useEffect(() => {
    async function loadCards() {
      const { data, error } = await supabase.from('vibes').select('*');
      let combined = [...localProverbs];
      if (data && data.length > 0) {
        combined = [...combined, ...data];
      }
      if (combined.length > 0) {
        setCards(shuffleSequence(combined));
      }
      setIsLoading(false);
    }
    loadCards();
  }, []);

  const handleAction = (direction) => {
    setExitDirection(direction);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      setCards(prev => shuffleSequence(prev));
    }
  };

  return (
    <>
      <div className="absolute inset-0 bg-slate-950 -z-20"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-blob -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] bg-pink-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000 -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full max-w-sm mx-auto px-4 relative">
        {isLoading || cards.length === 0 ? (
          <div className="text-white text-opacity-50 tracking-widest animate-pulse font-bold flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            VIBE CHECK...
          </div>
        ) : (
          <>
            <div className="w-full mb-8 mt-4 pt-4">
              <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-widest mb-3">
                <span>Прогресс</span>
                <span>{currentIndex + 1} / {cards.length}</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="relative w-full flex-grow max-h-[620px] mb-4">
              <AnimatePresence mode="wait" custom={exitDirection}>
                <VibeCard 
                  key={cards[currentIndex].id || currentIndex} 
                  card={cards[currentIndex]} 
                  onAction={handleAction} 
                  zIndex={10} 
                  custom={exitDirection}
                />
              </AnimatePresence>
            </div>

            <p className="mt-20 mb-6 z-10 text-white/30 text-[10px] font-black tracking-[0.4em] uppercase text-center w-full">
              Lost In Vibe • Anastasia Edition
            </p>
          </>
        )}
      </div>
    </>
  );
}
