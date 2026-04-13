import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

export function VibeCard({ card, onAction, zIndex, custom }) {
  const { speak, isSpeaking } = useSpeech();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (e, info) => {
    if (info.offset.x > 100) {
      onAction('right');
    } else if (info.offset.x < -100) {
      onAction('left');
    }
  };

  const hasImage = card.image_url && card.image_url.length > 5 && card.image_url !== '-' && !card.image_url.includes('<a');
  
  // Умный поиск картинок: берем первую часть слова (до пробела)
  const flickrTag = card.word ? encodeURIComponent(card.word.split(' ')[0]) : 'apple';
  const flickrUrl = `https://loremflickr.com/600/800/${flickrTag}`;

  return (
    <motion.div 
      className="glass-card p-6 w-full absolute top-0 left-0"
      style={{ x, rotate, opacity, zIndex }}
      drag="x"
      custom={custom}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={(direction) => ({ x: direction === 'right' ? 300 : -300, opacity: 0, transition: { duration: 0.2 } })}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="relative w-full h-80 mb-6 rounded-[32px] overflow-hidden shadow-2xl">
        {hasImage ? (
          <img src={card.image_url} alt={card.word} className="w-full h-full object-cover pointer-events-none bg-slate-800" />
        ) : (
          <img src={flickrUrl} alt="Flickr placeholder" className="w-full h-full object-cover pointer-events-none bg-slate-800" />
        )}
      </div>

      <div className="text-center pb-4 select-none flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-2 w-full">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter w-full leading-tight">{card.word}</h2>
          <button 
            onClick={() => speak(card.correct_translation_en || card.word)}
            className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-300 shadow-lg ${isSpeaking ? 'text-indigo-300 bg-indigo-500/30 scale-110' : 'text-slate-300 bg-white/5 hover:bg-white/15'}`}
          >
            <Volume2 size={24} />
          </button>
        </div>
        
        {card.joke_translation ? (
          <div className="flex flex-col items-center justify-center mt-2 mb-2 w-full">
            <p className="text-sm sm:text-base text-gray-400 font-bold uppercase tracking-widest line-through opacity-70 mb-1">
              {card.joke_translation}
            </p>
            <p className="text-xl sm:text-2xl text-green-400 font-black uppercase tracking-widest">
              {card.correct_translation_en}
            </p>
          </div>
        ) : (
          <p className="text-xl text-indigo-400 font-bold mb-4 uppercase tracking-widest">{card.translation}</p>
        )}
        
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner mt-4 w-full">
          <p className="text-gray-300 italic text-sm leading-relaxed pointer-events-none">"{card.example}"</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button 
          onClick={() => onAction('left')} 
          className="flex-1 glass-button py-5 rounded-3xl flex items-center justify-center text-slate-400 hover:text-red-400 active:scale-95 transition-transform"
        >
          <ThumbsDown size={32} />
        </button>

        <button 
          onClick={() => onAction('right')} 
          className="flex-1 glass-button-primary py-5 rounded-3xl flex items-center justify-center text-indigo-300 hover:text-indigo-100 active:scale-95 transition-transform"
        >
          <ThumbsUp size={32} />
        </button>
      </div>
    </motion.div>
  );
}
