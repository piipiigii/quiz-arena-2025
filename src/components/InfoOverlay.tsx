import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-indigo-950/95 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Close button */}
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-indigo-800/50 rounded-full"
            aria-label="Close overlay"
          >
            <X className="h-8 w-8" />
          </Button>
        </div>

        {/* 2-column content */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
            {/* Left column - image */}
            <div>
              <img 
                src="/images/banner.jpg" 
                alt="Quizmaster Information" 
                className="w-full h-auto rounded-xl shadow-2xl border border-indigo-300/20"
              />
            </div>

            {/* Right column - text content */}
            <div className="text-left space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                Bihure Birina Paat 11
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-indigo-200">
                The Ultimate Quiz Experience
              </h2>

              <p className="text-indigo-100 text-lg">
                Quizmaster is designed to create engaging and interactive quiz sessions for classrooms, events, or friendly gatherings.
                Navigate through rounds, select topics, and challenge participants with a variety of question formats including multiple-choice, 
                open-ended, and media-based questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoOverlay;
