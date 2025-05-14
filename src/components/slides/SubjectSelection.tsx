
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';

const SubjectSelection = () => {
  const currentRound = useQuizStore(state => state.currentRound);
  const setCurrentSubject = useQuizStore(state => state.setCurrentSubject);

  if (!currentRound || !currentRound.isSpecial || !currentRound.subjects) {
    return <div>Loading...</div>;
  }

  const handleSubjectSelect = (subjectId: string) => {
    setCurrentSubject(subjectId);
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
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.h1 
        className="quiz-header mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose a Subject
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {currentRound.subjects.map((subject) => (
          <motion.div
            key={subject.id}
            variants={itemVariants}
            className="h-full"
          >
            <button
              onClick={() => handleSubjectSelect(subject.id)}
              className="w-full h-full bg-quiz-dark bg-opacity-80 hover:bg-quiz-secondary rounded-xl p-6 text-white shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
            >
              <h2 className="text-2xl font-bold mb-4">{subject.name}</h2>
              <p className="text-sm opacity-70">{subject.questions.length} Questions</p>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SubjectSelection;
