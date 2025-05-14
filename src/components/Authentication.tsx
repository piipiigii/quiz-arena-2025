
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/store';
import { APP_NAME } from '@/lib/constants';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Authentication = () => {
  const [password, setPassword] = useState('');
  const authenticate = useQuizStore(state => state.authenticate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CONFIG.ADMIN_PASSWORD) {
      authenticate(password);
      toast({
        title: "Authentication Successful",
        description: "Welcome to Quiz Arena!",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
      setPassword('');
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center w-full h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md p-8 bg-quiz-dark bg-opacity-80 rounded-lg shadow-xl backdrop-blur-sm"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1 
          className="text-3xl font-bold text-white mb-6 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {APP_NAME} Admin
        </motion.h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-quiz-dark text-white border-quiz-secondary"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-quiz-primary hover:bg-quiz-accent text-white"
          >
            Login
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Authentication;
