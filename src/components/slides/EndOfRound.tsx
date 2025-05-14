
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const EndOfRound = () => {
  const currentRound = useQuizStore(state => state.currentRound);
  const nextSlide = useQuizStore(state => state.nextSlide);

  if (!currentRound) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="quiz-header mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Round Complete
      </motion.h1>
      
      <motion.div 
        className="bg-quiz-dark bg-opacity-80 p-8 rounded-lg shadow-lg mb-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-3xl text-white font-bold mb-4">
            {currentRound.title}
          </h2>
          
          <div className="w-24 h-1 bg-quiz-primary mx-auto mb-6"></div>
          
          <p className="text-xl text-white mb-6">
            You have completed this round.
          </p>
          
          <p className="text-white opacity-80">
            {currentRound.isSpecial 
              ? `This special round featured ${currentRound.subjects?.length || 0} different subjects.`
              : `This round featured ${currentRound.questions?.length || 0} questions.`
            }
          </p>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button 
          onClick={nextSlide}
          className="mx-auto bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-4 px-8 rounded-lg text-lg flex items-center space-x-2"
        >
          <span>Choose Next Round</span>
          <ChevronRight size={20} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EndOfRound;
