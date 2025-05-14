
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { Home, ChevronLeft, ChevronRight, LogOut, Timer, Fullscreen, Info } from 'lucide-react';
import { useState } from 'react';
import InfoOverlay from './InfoOverlay';

const Footer = () => {
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const currentSlide = useQuizStore(state => state.currentSlide);
  const nextSlide = useQuizStore(state => state.nextSlide);
  const prevSlide = useQuizStore(state => state.prevSlide);
  const skipToNextQuestion = useQuizStore(state => state.skipToNextQuestion);
  const goToRoundSelection = useQuizStore(state => state.goToRoundSelection);
  const toggleFullscreen = useQuizStore(state => state.toggleFullscreen);
  const toggleTimer = useQuizStore(state => state.toggleTimer);
  const isTimerActive = useQuizStore(state => state.isTimerActive);
  const resetTimer = useQuizStore(state => state.resetTimer);
  const logout = useQuizStore(state => state.logout);
  const currentRound = useQuizStore(state => state.currentRound);
  const currentQuestion = useQuizStore(state => state.currentQuestion);

  const handleTimer = () => {
    if (!isTimerActive) {
      resetTimer();
    }
    toggleTimer();
  };

  // Handle next button click based on slide type
  const handleNextClick = () => {
    // For media-first questions, go to question slide
    if (currentSlide.type === 'question-media') {
      nextSlide();
      return;
    }
    
    // Skip to next question for question slides in special rounds
    if (currentSlide.type === 'question' && currentRound?.isSpecial) {
      skipToNextQuestion();
    } else {
      nextSlide();
    }
  };

  const isQuestionOrMediaSlide = currentSlide.type === 'question' || currentSlide.type === 'question-media';
  const showPrevButton = currentSlide.type !== 'authentication' && currentSlide.type !== 'welcome';
  const showNextButton = currentSlide.type !== 'authentication' && currentSlide.type !== 'welcome';

  return (
    <>
      <InfoOverlay isOpen={showInfoOverlay} onClose={() => setShowInfoOverlay(false)} />
      
      <motion.footer 
        className="bg-quiz-dark py-3 px-6 shadow-md border-t border-quiz-secondary"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white opacity-80">{APP_NAME} © 2025 Pallav Pran Goswami</span>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white" 
              onClick={goToRoundSelection}
              title="Home"
            >
              <Home size={20} />
            </Button>
            {showPrevButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white" 
                onClick={prevSlide}
                title="Previous"
              >
                <ChevronLeft size={20} />
              </Button>
            )}
            {showNextButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white" 
                onClick={handleNextClick}
                title={isQuestionOrMediaSlide && currentRound?.isSpecial ? "Skip to Next Question" : "Next"}
              >
                <ChevronRight size={20} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${isTimerActive ? 'text-quiz-accent animate-pulse' : 'text-white'}`} 
              onClick={handleTimer}
              title="Timer"
            >
              <Timer size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white" 
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              <Fullscreen size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-indigo-300" 
              onClick={() => setShowInfoOverlay(true)}
              title="Info"
            >
              <Info size={20} />
            </Button>
          </div>

          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-red-500" 
              onClick={logout}
              title="Logout"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;
