
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Rules = () => {
  const currentRound = useQuizStore(state => state.currentRound);
  const nextSlide = useQuizStore(state => state.nextSlide);

  if (!currentRound) {
    return <div>Loading...</div>;
  }

  const rules = currentRound.isSpecial
    ? [
        "This is a 'Choose Yourself' round. You'll select subjects from the available options.",
        "Each subject contains several questions on that topic.",
        "After selecting a subject, you'll be presented with a question.",
        "After answering the question, you can return to select another subject.",
        "You can choose the same subject multiple times if you wish."
      ]
    : [
        `This round contains ${currentRound.questions?.length || 0} questions.`,
        "Each question will be displayed one at a time.",
        "Some questions may contain images, audio, or video.",
        "After each question, we'll reveal the correct answer.",
        "Navigate through questions using the arrows or spacebar."
      ];

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto"
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
        Round Rules
      </motion.h1>
      
      <motion.div 
        className="bg-quiz-dark bg-opacity-80 p-8 rounded-lg shadow-lg mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ul className="space-y-4">
          {rules.map((rule, index) => (
            <motion.li 
              key={index}
              className="flex items-start text-white text-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
            >
              <span className="inline-block bg-quiz-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">
                {index + 1}
              </span>
              {rule}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button 
          onClick={nextSlide}
          className="mx-auto bg-quiz-primary hover:bg-quiz-accent text-white font-semibold py-4 px-8 rounded-lg text-lg flex items-center space-x-2"
        >
          <span>Continue</span>
          <ChevronRight size={20} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Rules;
