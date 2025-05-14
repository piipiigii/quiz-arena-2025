
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { Round } from '@/lib/types';

const RoundSelection = () => {
  const rounds = useQuizStore(state => state.rounds as Record<number, Round>);
  const setCurrentRound = useQuizStore(state => state.setCurrentRound);

  const handleSelectRound = (roundId: number) => {
    setCurrentRound(roundId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.h1 
        className="quiz-header mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Select a Round
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {Object.values(rounds).map((round: Round) => (
          <motion.div
            key={round.id}
            variants={itemVariants}
            className="h-full"
          >
            <button
              onClick={() => handleSelectRound(round.id)}
              className="w-full h-full bg-quiz-dark bg-opacity-80 hover:bg-quiz-primary rounded-xl p-6 text-white shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
            >
              <h2 className="text-xl font-bold mb-2">{round.title}</h2>
              <p className="text-sm opacity-80">{round.isSpecial ? "Special Round" : "Standard Round"}</p>
              <div className="mt-4 opacity-70 text-xs">
                {round.isSpecial 
                  ? `${round.subjects?.length || 0} Subjects` 
                  : `${round.questions?.length || 0} Questions`
                }
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RoundSelection;
