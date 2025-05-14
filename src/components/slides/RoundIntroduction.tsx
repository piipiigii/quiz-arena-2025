
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const RoundIntroduction = () => {
  const currentRound = useQuizStore(state => state.currentRound);
  const nextSlide = useQuizStore(state => state.nextSlide);

  if (!currentRound) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="quiz-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Round {currentRound.id}
      </motion.h1>
      
      <motion.h2 
        className="quiz-subheader mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {currentRound.title}
      </motion.h2>
      
      <motion.div 
        className="bg-quiz-dark bg-opacity-80 p-8 rounded-lg shadow-lg mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-white text-xl mb-6">{currentRound.description}</p>
        
        {currentRound.isRapidFire && (
          <div className="bg-indigo-700 p-4 rounded-md mb-4 animate-pulse">
            <p className="text-white font-bold text-lg">
              ⚡ RAPID FIRE ROUND ⚡
            </p>
            <p className="text-white opacity-90">
              60-second timer per question!
            </p>
          </div>
        )}
        
        <p className="text-white opacity-80">
          {currentRound.isSpecial 
            ? `This is a special "Choose Yourself" round with ${currentRound.subjects?.length || 0} different subjects.`
            : `This round contains ${currentRound.questions?.length || 0} questions.`
          }
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button 
          onClick={nextSlide}
          className="bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-4 px-8 rounded-lg text-lg"
        >
          Start Round
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RoundIntroduction;
