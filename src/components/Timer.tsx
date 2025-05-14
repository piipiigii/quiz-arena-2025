
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';

const Timer = () => {
  const timerValue = useQuizStore(state => state.timerValue);
  const isTimerActive = useQuizStore(state => state.isTimerActive);
  const currentRound = useQuizStore(state => state.currentRound);
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const longTickSoundRef = useRef<HTMLAudioElement | null>(null);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio elements
    tickSoundRef.current = new Audio('/tick.mp3');
    longTickSoundRef.current = new Audio('/tick-60-sec.mp3');
    beepSoundRef.current = new Audio('/beep.mp3');
    
    return () => {
      // Cleanup
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current = null;
      }
      if (longTickSoundRef.current) {
        longTickSoundRef.current.pause();
        longTickSoundRef.current = null;
      }
      if (beepSoundRef.current) {
        beepSoundRef.current.pause();
        beepSoundRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    const isRapidFire = currentRound?.isRapidFire || false;
    
    // Play appropriate tick sound based on round type
    if (isTimerActive && timerValue > 0) {
      // Stop both sounds first
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current.currentTime = 0;
      }
      if (longTickSoundRef.current) {
        longTickSoundRef.current.pause();
        longTickSoundRef.current.currentTime = 0;
      }
      
      // Play the appropriate tick sound
      if (isRapidFire) {
        longTickSoundRef.current?.play().catch(e => console.error("Audio play error:", e));
      } else {
        tickSoundRef.current?.play().catch(e => console.error("Audio play error:", e));
      }
    } else {
      // Stop the sounds when timer is toggled off or reaches 0
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current.currentTime = 0;
      }
      if (longTickSoundRef.current) {
        longTickSoundRef.current.pause();
        longTickSoundRef.current.currentTime = 0;
      }
    }
    
    // Play beep sound when timer reaches 0
    if (isTimerActive && timerValue === 0) {
      // Stop tick sounds
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current.currentTime = 0;
      }
      if (longTickSoundRef.current) {
        longTickSoundRef.current.pause();
        longTickSoundRef.current.currentTime = 0;
      }
      beepSoundRef.current?.play().catch(e => console.error("Audio play error:", e));
    }
  }, [timerValue, isTimerActive, currentRound]);

  if (!isTimerActive) {
    return null;
  }

  return (
    <motion.div 
      className="fixed top-4 right-4 bg-gradient-to-br from-quiz-dark to-black bg-opacity-90 rounded-full text-white font-mono text-3xl font-bold shadow-2xl flex items-center justify-center ring-2 ring-white/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ width: '80px', height: '80px' }}
    >
      {timerValue}s
    </motion.div>
  );
};

export default Timer;
