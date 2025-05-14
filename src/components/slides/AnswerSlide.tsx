import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuizStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { Media } from '@/lib/types';

const AnswerSlide = () => {
  const currentRound = useQuizStore(state => state.currentRound);
  const currentQuestion = useQuizStore(state => state.currentQuestion);
  const nextSlide = useQuizStore(state => state.nextSlide);
  const questionIndex = useQuizStore(state => state.questionIndex);
  const currentSlide = useQuizStore(state => state.currentSlide);
  const setSlide = useQuizStore(state => state.setSlide);
  const currentSubjectId = useQuizStore(state => state.currentSubjectId);
  
  const [isFullscreenMedia, setIsFullscreenMedia] = useState(false);
  
  if (!currentRound || !currentQuestion) {
    return <div>Loading...</div>;
  }

  const correctAnswers = currentQuestion.answers
    ? currentQuestion.answers.filter(answer => answer.isCorrect)
    : [];
  
  // Determine if this is the last question in the current context (regular round or subject)
  let isLastQuestion = false;
  let totalQuestions = 0;
  
  if (currentRound.isSpecial && currentSubjectId && currentRound.subjects) {
    // For special rounds, check if this is the last question in the subject
    const subject = currentRound.subjects.find(s => s.id === currentSubjectId);
    if (subject) {
      totalQuestions = subject.questions.length;
      isLastQuestion = questionIndex === totalQuestions - 1;
    }
  } else if (!currentRound.isSpecial && currentRound.questions) {
    // For regular rounds
    totalQuestions = currentRound.questions.length;
    isLastQuestion = questionIndex === totalQuestions - 1;
  }

  const handleNext = () => {
    nextSlide();
  };

  const handleBackToSubjects = () => {
    setSlide({ type: 'subjectSelection', roundId: currentRound.id });
  };

  const toggleFullscreenMedia = () => {
    setIsFullscreenMedia(!isFullscreenMedia);
  };

  const renderMedia = (media: Media) => {
    if (isFullscreenMedia && media.type === 'image') {
      return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={toggleFullscreenMedia}>
          <img 
            src={media.url} 
            alt={media.caption || "Answer media"} 
            className="max-h-full max-w-full object-contain cursor-pointer"
          />
        </div>
      );
    }

    switch (media.type) {
      case 'image':
        return (
          <div className="media-container mb-6">
            <img 
              src={media.url} 
              alt={media.caption || "Answer image"} 
              className="w-full h-auto object-contain cursor-pointer rounded-lg shadow-lg max-h-96"
              onClick={() => media.type === 'image' && setIsFullscreenMedia(true)}
            />
            {media.caption && (
              <p className="text-sm text-white opacity-70 mt-2 text-center">
                {media.caption}
              </p>
            )}
          </div>
        );
      case 'audio':
        return (
          <div className="media-container mb-6">
            <audio 
              controls 
              src={media.url} 
              className="w-full"
            >
              Your browser does not support the audio element.
            </audio>
            {media.caption && (
              <p className="text-sm text-white opacity-70 mt-2 text-center">
                {media.caption}
              </p>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="media-container mb-6">
            <video 
              controls 
              src={media.url} 
              className="w-full rounded-lg shadow-lg"
            >
              Your browser does not support the video element.
            </video>
            {media.caption && (
              <p className="text-sm text-white opacity-70 mt-2 text-center">
                {media.caption}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Determine if answers should be displayed in two columns
  const shouldUseColumns = correctAnswers.length > 1;
  
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="quiz-subheader mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Answer
      </motion.h1>
      
      <motion.div 
        className="mb-8 p-6 bg-quiz-dark bg-opacity-80 rounded-lg shadow-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-xl text-white mb-4 italic">Question:</p>
        <p className="text-3xl text-white font-semibold mb-8">
          {currentQuestion.text}
        </p>
        
        {/* Render answer media if available */}
        {currentQuestion.mediaAnswer && renderMedia(currentQuestion.mediaAnswer)}
        
        {currentQuestion.answers ? (
          <div>
            <p className="text-xl text-white mb-4 italic">Correct Answer{correctAnswers.length > 1 ? 's' : ''}:</p>
            <div className={`grid ${shouldUseColumns ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {correctAnswers.map((answer, index) => (
                <motion.div 
                  key={index}
                  className="bg-green-500 bg-opacity-20 border border-green-500 p-4 rounded-lg"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                >
                  <p className="text-4xl text-white font-semibold">{answer.text}</p>
                  {answer.explanation && (
                    <p className="text-white opacity-80 mt-2">{answer.explanation}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xl text-white mb-4">Correct Answer:</p>
            <motion.div 
              className="bg-green-500 bg-opacity-20 border border-green-500 p-4 rounded-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-xl text-white font-semibold">{currentQuestion.correctAnswer}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
      
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {currentRound.isSpecial && (
          <Button 
            onClick={handleBackToSubjects}
            className="bg-quiz-secondary hover:bg-quiz-secondary/80 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <LayoutGrid size={18} />
            <span>Back to Subjects</span>
          </Button>
        )}
        
        <Button 
          onClick={handleNext}
          className="bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2"
        >
          <span>
            {currentRound.isSpecial 
              ? isLastQuestion ? "Back to Subjects" : "Next Question" 
              : isLastQuestion ? "Finish Round" : "Next Question"
            }
          </span>
          <ChevronRight size={18} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AnswerSlide;
