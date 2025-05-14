
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Media } from '@/lib/types';
import { ChevronRight, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const QuestionSlide = () => {
  const currentRound = useQuizStore(state => state.currentRound);
  const currentQuestion = useQuizStore(state => state.currentQuestion);
  const questionIndex = useQuizStore(state => state.questionIndex);
  const nextSlide = useQuizStore(state => state.nextSlide);
  const currentSlide = useQuizStore(state => state.currentSlide);
  const setSlide = useQuizStore(state => state.setSlide); 
  
  const [isFullscreenMedia, setIsFullscreenMedia] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  
  if (!currentRound || !currentQuestion) {
    return <div>Loading...</div>;
  }

  // For special rounds, we need to get the subject
  const subject = currentRound.isSpecial && currentRound.subjects && currentSlide.subjectId
    ? currentRound.subjects.find(s => s.id === currentSlide.subjectId)
    : null;

  const handleMediaClick = () => {
    if (currentQuestion.media?.type === 'image') {
      setIsFullscreenMedia(!isFullscreenMedia);
    }
  };

  const toggleFullscreenMedia = () => {
    setIsFullscreenMedia(!isFullscreenMedia);
  };

  const handleShowAnswer = () => {
    setSlide({ 
      type: 'answer', 
      roundId: currentRound.id, 
      questionIndex, 
      subjectId: currentSlide.subjectId 
    });
  };

  const toggleAnswerSelection = (index: number) => {
    if (currentQuestion.multipleCorrect) {
      // For multiple correct answers
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    } else {
      // For single correct answer
      setSelectedAnswers([index]);
    }
  };

  const isAnswerSelected = (index: number) => {
    return selectedAnswers.includes(index);
  };

  const renderMedia = (media: Media) => {
    if (isFullscreenMedia && media.type === 'image') {
      return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={toggleFullscreenMedia}>
          <img 
            src={media.url} 
            alt={media.caption || "Question media"} 
            className="max-h-full max-w-full object-contain cursor-pointer"
          />
        </div>
      );
    }

    switch (media.type) {
      case 'image':
        return (
          <div className="media-container">
            <img 
              src={media.url} 
              alt={media.caption || "Question image"} 
              className="w-full h-auto object-contain cursor-pointer rounded-lg shadow-lg max-h-96"
              onClick={handleMediaClick}
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
          <div className="media-container">
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
          <div className="media-container">
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

  // Check if this is a media-first slide
  if (currentSlide.type === 'question-media' && currentQuestion.type === 'media-first' && currentQuestion.media) {
    return (
      <motion.div 
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl md:text-3xl text-white font-bold mb-8 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Media
        </motion.h2>
        
        <div className="flex justify-center mb-8">
          {renderMedia(currentQuestion.media)}
        </div>
        
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            onClick={() => setSlide({ 
              type: 'question', 
              roundId: currentRound.id, 
              questionIndex, 
              subjectId: currentSlide.subjectId 
            })}
            className="mx-auto bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <span>Continue to Question</span>
            <ChevronRight size={18} />
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {subject && (
        <motion.div 
          className="mb-4 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="inline-block bg-quiz-secondary text-white py-1 px-4 rounded-full text-sm font-semibold">
            {subject.name}
          </span>
        </motion.div>
      )}
      
      {/* Show question number for both regular and special rounds */}
      <motion.div 
        className="mb-6 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <span className="inline-block bg-quiz-dark text-white py-1 px-4 rounded-full text-sm font-semibold">
          {currentRound.isSpecial && subject 
            ? `Question ${questionIndex + 1} of ${subject.questions.length}`
            : `Question ${questionIndex + 1} of ${currentRound.questions?.length || 0}`
          }
        </span>
      </motion.div>
      
      {/* Only show media if it's not a media-first question or if we're on the question slide */}
      {currentQuestion.media && currentQuestion.type !== 'media-first' && renderMedia(currentQuestion.media)}
      
      <motion.div 
        className="question-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-4xl text-white font-bold mb-8">
          {currentQuestion.text}
        </h2>
        
        {currentQuestion.answers && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.answers.map((answer, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
              >
                <button
                  onClick={() => toggleAnswerSelection(index)}
                  className={`w-full text-left ${
                    isAnswerSelected(index) 
                      ? 'bg-quiz-accent bg-opacity-50' 
                      : 'bg-quiz-secondary bg-opacity-30 hover:bg-opacity-50'
                  } p-4 rounded-lg text-white flex justify-between items-center`}
                >
                  <div className='text-2xl font-semibold'>
                    <span className="inline-block w-8 h-8 bg-quiz-primary rounded-full text-center text-xl mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {answer.text}
                  </div>
                  {isAnswerSelected(index) && (
                    <Check className="text-white" size={20} />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'open-ended' && (
          <div className="text-lg text-white opacity-80 italic text-center p-4 bg-quiz-secondary bg-opacity-20 rounded-lg">
            <p>Open-ended question - discuss and answer verbally.</p>
            {currentQuestion.correctAnswer && (
              <p className="mt-2 font-medium">Consider: {currentQuestion.correctAnswer}</p>
            )}
          </div>
        )}
        
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            onClick={handleShowAnswer}
            className="mx-auto bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <span>Show Answer</span>
            <ChevronRight size={18} />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionSlide;
