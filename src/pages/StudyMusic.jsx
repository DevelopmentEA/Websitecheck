import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const playlist = [
    "/muziek1.mp3",
    "/muziek2.mp3",
    "/muziek3.mp3",
    "/muziek4.mp3"
  ];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(err => console.log("Audio interactie nodig:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleTrackEnd = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  return (
    /* De waarde 'left' is aangepast naar de originele 2rem + 3cm extra */
    <div className="fixed bottom-8 left-[calc(2rem+2cm)] z-[100] flex items-center gap-4">
      <audio 
        ref={audioRef} 
        src={playlist[currentTrack]} 
        onEnded={handleTrackEnd}
      />

      <motion.button
        onClick={() => setIsPlaying(!isPlaying)}
        initial={{ scale: 0, opacity: 0, x: -20, backgroundColor: "#1A365D" }}
        animate={{ scale: 1, opacity: 1, x: 0, backgroundColor: "#1A365D" }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
        whileHover={{ 
          scale: 1.05, 
          y: -5, 
          backgroundColor: "#1A365D", 
          boxShadow: "0px 10px 20px rgba(26, 54, 93, 0.4)" 
        }}
        whileTap={{ scale: 0.95, backgroundColor: "#1A365D" }}
        style={{ backgroundColor: "#1A365D" }}
        className="flex items-center gap-3 px-6 py-3 text-white rounded-full shadow-2xl border border-white/10 cursor-pointer group"
      >
        <span className="text-xl">
          {isPlaying ? "⏸️" : "🎧"}
        </span>
        
        <div className="flex flex-col items-start text-left">
          <span className="text-[8px] font-black uppercase tracking-widest leading-none text-white/60 mb-0.5">
            Focus Modus
          </span>
          <span className="text-xs font-bold font-serif italic text-white whitespace-nowrap">
            {isPlaying ? "Nu aan het spelen..." : "Studiemuziek?"}
          </span>
        </div>

        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex gap-0.5 h-3 ml-2 items-end"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 6, 10, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  className="w-0.5 bg-[#C5A059] rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default StudyMusic;