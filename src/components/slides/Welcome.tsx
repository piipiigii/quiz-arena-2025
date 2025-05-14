
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/lib/store';
import { APP_NAME } from '@/lib/constants';
import { ChevronRight } from 'lucide-react';

const Welcome = () => {
  const setSlide = useQuizStore(state => state.setSlide);

  const handleStart = () => {
    setSlide({ type: 'roundSelection' });
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1 
          className="quiz-header"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to {APP_NAME}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-white mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          The ultimate quiz experience for large audiences
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button 
            onClick={handleStart}
            className="mx-auto bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-6 px-10 rounded-full text-xl shadow-lg transform transition hover:scale-105 flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ChevronRight size={20} />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
