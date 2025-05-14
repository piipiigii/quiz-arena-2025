
import { useEffect } from 'react';
import { useQuizStore } from '@/lib/store';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';
import Authentication from './Authentication';
import Footer from './Footer';
import Timer from './Timer';
import Welcome from './slides/Welcome';
import RoundSelection from './slides/RoundSelection';
import RoundIntroduction from './slides/RoundIntroduction';
import Rules from './slides/Rules';
import QuestionSlide from './slides/QuestionSlide';
import AnswerSlide from './slides/AnswerSlide';
import EndOfRound from './slides/EndOfRound';
import SubjectSelection from './slides/SubjectSelection';

const Layout = () => {
  const isAuthenticated = useQuizStore(state => state.isAuthenticated);
  const currentSlide = useQuizStore(state => state.currentSlide);
  const nextSlide = useQuizStore(state => state.nextSlide);
  const prevSlide = useQuizStore(state => state.prevSlide);
  const goToRoundSelection = useQuizStore(state => state.goToRoundSelection);
  const toggleFullscreen = useQuizStore(state => state.toggleFullscreen);
  const toggleTimer = useQuizStore(state => state.toggleTimer);
  const resetTimer = useQuizStore(state => state.resetTimer);
  const decrementTimer = useQuizStore(state => state.decrementTimer);
  const isTimerActive = useQuizStore(state => state.isTimerActive);
  const loadRounds = useQuizStore(state => state.loadRounds);
  const currentRound = useQuizStore(state => state.currentRound);

  useEffect(() => {
    loadRounds();
  }, [loadRounds]);

  useEffect(() => {
    // Reset timer when the round changes
    resetTimer();
  }, [currentRound, resetTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAuthenticated) return;
      
      if (KEYBOARD_SHORTCUTS.NEXT_SLIDE.includes(e.key) || e.key === "PageDown") {
        nextSlide();
      } else if (KEYBOARD_SHORTCUTS.PREV_SLIDE.includes(e.key) || e.key === "PageUp") {
        prevSlide();
      } else if (KEYBOARD_SHORTCUTS.HOME.includes(e.key)) {
        goToRoundSelection();
      } else if (KEYBOARD_SHORTCUTS.FULLSCREEN.includes(e.key.toLowerCase())) {
        toggleFullscreen();
      } else if (KEYBOARD_SHORTCUTS.TIMER.includes(e.key.toLowerCase())) {
        toggleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAuthenticated, 
    nextSlide, 
    prevSlide, 
    goToRoundSelection, 
    toggleFullscreen, 
    toggleTimer
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive) {
      timer = setInterval(() => {
        decrementTimer();
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, decrementTimer]);

  if (!isAuthenticated) {
    return <Authentication />;
  }

  // Render the appropriate slide based on the current slide type
  const renderSlide = () => {
    switch (currentSlide.type) {
      case 'welcome':
        return <Welcome />;
      case 'roundSelection':
        return <RoundSelection />;
      case 'roundIntroduction':
        return <RoundIntroduction />;
      case 'rules':
        return <Rules />;
      case 'question':
      case 'question-media':
        return <QuestionSlide />;
      case 'answer':
        return <AnswerSlide />;
      case 'endOfRound':
        return <EndOfRound />;
      case 'subjectSelection':
        return <SubjectSelection />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="quiz-container">
      <Timer />
      <main className="quiz-slide">
        {renderSlide()}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
