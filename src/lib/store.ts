import { create } from 'zustand';
import { CONFIG } from './config';
import { SlideState, Round, Question } from './types';
import { ADMIN_PASSWORD } from './constants';
import { persist } from 'zustand/middleware';

interface QuizState {
  // Authentication
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
  
  // Rounds and Questions
  rounds: Record<number, Round>;
  loadRounds: () => void;
  currentRound: Round | null;
  setCurrentRound: (roundId: number) => void;
  
  // Slide Navigation
  currentSlide: SlideState;
  setSlide: (slide: SlideState) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToRoundSelection: () => void;
  
  // Question Management
  currentQuestion: Question | null;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
  
  // Subject Management (for special rounds)
  currentSubjectId: string | null;
  setCurrentSubject: (subjectId: string) => void;
  
  // UI State
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isTimerActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  timerValue: number;
  decrementTimer: () => void;
  
  // New function to skip to next question without showing answer
  skipToNextQuestion: () => void;
}

// Function to fetch round data from JSON files
const fetchRoundData = async (roundId: number): Promise<Round | null> => {
  try {
    const response = await fetch(`/data/round${roundId}.json`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(`Error loading round ${roundId}:`, error);
  }
  return null;
};

// Create the store with persistence
export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // Authentication
      isAuthenticated: false,
      authenticate: (password) => {
        if (password === CONFIG.ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      
      // Rounds and Questions
      rounds: {},
      loadRounds: async () => {
        const rounds: Record<number, Round> = {};
        
        // Try to load rounds from JSON files
        for (let i = 1; i <= 10; i++) {
          try {
            const round = await fetchRoundData(i);
            if (round) {
              rounds[i] = round;
            }
          } catch (error) {
            console.error(`Error loading round ${i}:`, error);
          }
        }
        
        // Fall back to built-in rounds if none were loaded
        if (Object.keys(rounds).length === 0) {
          // Use the sample rounds from constants
          const { SAMPLE_ROUNDS } = await import('./constants');
          set({ rounds: SAMPLE_ROUNDS });
        } else {
          set({ rounds });
        }
      },
      currentRound: null,
      setCurrentRound: (roundId: number) => {
        const rounds = get().rounds;
        const round = rounds[roundId];
        
        if (round) {
          // Reset timer to the appropriate default value based on round type
          const defaultTimerValue = round.isRapidFire ? 60 : 15;
          
          if (round.isSpecial) {
            set({ 
              currentRound: round,
              currentSlide: { type: 'roundIntroduction', roundId },
              questionIndex: 0,
              currentSubjectId: null,
              timerValue: defaultTimerValue,
            });
          } else {
            set({ 
              currentRound: round,
              currentSlide: { type: 'roundIntroduction', roundId },
              questionIndex: 0,
              timerValue: defaultTimerValue
            });
          }
        }
      },
      
      // Slide Navigation
      currentSlide: { type: 'authentication' },
      setSlide: (slide: SlideState) => set({ currentSlide: slide }),
      nextSlide: () => {
        const { currentSlide, currentRound, questionIndex, currentSubjectId, currentQuestion } = get();
        const slide = currentSlide;
        const round = currentRound;
        
        if (!round) {
          return;
        }

        switch (slide.type) {
          case 'roundIntroduction':
            set({ currentSlide: { type: 'rules', roundId: round.id } });
            break;
            
          case 'rules':
            if (round.isSpecial) {
              set({ currentSlide: { type: 'subjectSelection', roundId: round.id } });
            } else if (round.questions && round.questions.length > 0) {
              const firstQuestion = round.questions[0];
              // Check if this is a media-first question type
              if (firstQuestion.type === 'media-first' && firstQuestion.media) {
                set({ 
                  currentSlide: { type: 'question-media', roundId: round.id, questionIndex: 0 },
                  currentQuestion: firstQuestion,
                  questionIndex: 0
                });
              } else {
                set({ 
                  currentSlide: { type: 'question', roundId: round.id, questionIndex: 0 },
                  currentQuestion: firstQuestion,
                  questionIndex: 0
                });
              }
            } else {
              set({ currentSlide: { type: 'endOfRound', roundId: round.id } });
            }
            break;
            
          case 'question-media':
            // Move from media slide to the actual question
            set({ 
              currentSlide: { 
                type: 'question', 
                roundId: round.id, 
                questionIndex,
                subjectId: currentSubjectId 
              }
            });
            break;
            
          case 'question':
            set({ 
              currentSlide: { 
                type: 'answer', 
                roundId: round.id, 
                questionIndex,
                subjectId: currentSubjectId
              }
            });
            break;
            
          case 'answer':
            if (round.isSpecial && currentSubjectId) {
              const subject = round.subjects?.find(s => s.id === currentSubjectId);
              if (subject) {
                const nextIndex = questionIndex + 1;
                if (nextIndex < subject.questions.length) {
                  const nextQuestion = subject.questions[nextIndex];
                  // Check if this is a media-first question type
                  if (nextQuestion.type === 'media-first' && nextQuestion.media) {
                    set({ 
                      currentSlide: { 
                        type: 'question-media', 
                        roundId: round.id, 
                        questionIndex: nextIndex,
                        subjectId: currentSubjectId 
                      },
                      currentQuestion: nextQuestion,
                      questionIndex: nextIndex
                    });
                  } else {
                    set({ 
                      currentSlide: { 
                        type: 'question', 
                        roundId: round.id, 
                        questionIndex: nextIndex,
                        subjectId: currentSubjectId 
                      },
                      currentQuestion: nextQuestion,
                      questionIndex: nextIndex
                    });
                  }
                } else {
                  // If this is the last question in the subject, go back to subject selection
                  set({ currentSlide: { type: 'subjectSelection', roundId: round.id } });
                }
              }
            } else if (!round.isSpecial && round.questions) {
              const nextIndex = questionIndex + 1;
              if (nextIndex < round.questions.length) {
                const nextQuestion = round.questions[nextIndex];
                // Check if this is a media-first question type
                if (nextQuestion.type === 'media-first' && nextQuestion.media) {
                  set({ 
                    currentSlide: { type: 'question-media', roundId: round.id, questionIndex: nextIndex },
                    currentQuestion: nextQuestion,
                    questionIndex: nextIndex
                  });
                } else {
                  set({ 
                    currentSlide: { type: 'question', roundId: round.id, questionIndex: nextIndex },
                    currentQuestion: nextQuestion,
                    questionIndex: nextIndex
                  });
                }
              } else {
                set({ currentSlide: { type: 'endOfRound', roundId: round.id } });
              }
            }
            break;
            
          case 'subjectSelection':
            // This would be handled by clicking a subject
            break;
            
          case 'endOfRound':
            set({ currentSlide: { type: 'roundSelection' } });
            break;
            
          default:
            break;
        }
      },
      
      prevSlide: () => {
        const { currentSlide, currentRound, questionIndex, currentSubjectId, currentQuestion } = get();
        const slide = currentSlide;
        const round = currentRound;
        
        if (!round) {
          return;
        }
        
        switch (slide.type) {
          case 'rules':
            set({ currentSlide: { type: 'roundIntroduction', roundId: round.id } });
            break;
            
          case 'question-media':
            if (questionIndex === 0) {
              if (round.isSpecial) {
                set({ currentSlide: { type: 'subjectSelection', roundId: round.id } });
              } else {
                set({ currentSlide: { type: 'rules', roundId: round.id } });
              }
            } else {
              const prevIndex = questionIndex - 1;
              if (round.isSpecial && currentSubjectId) {
                const subject = round.subjects?.find(s => s.id === currentSubjectId);
                if (subject && prevIndex >= 0) {
                  set({ 
                    currentSlide: { 
                      type: 'answer', 
                      roundId: round.id, 
                      questionIndex: prevIndex,
                      subjectId: currentSubjectId
                    },
                    questionIndex: prevIndex,
                    currentQuestion: subject.questions[prevIndex]
                  });
                }
              } else if (!round.isSpecial && round.questions && prevIndex >= 0) {
                set({ 
                  currentSlide: { type: 'answer', roundId: round.id, questionIndex: prevIndex },
                  questionIndex: prevIndex,
                  currentQuestion: round.questions[prevIndex]
                });
              }
            }
            break;
            
          case 'question':
            // If it's a media-first question, go back to the media slide
            if (currentQuestion?.type === 'media-first') {
              set({
                currentSlide: {
                  type: 'question-media',
                  roundId: round.id,
                  questionIndex,
                  subjectId: currentSubjectId
                }
              });
            } else if (questionIndex === 0) {
              if (round.isSpecial) {
                set({ currentSlide: { type: 'subjectSelection', roundId: round.id } });
              } else {
                set({ currentSlide: { type: 'rules', roundId: round.id } });
              }
            } else {
              const prevIndex = questionIndex - 1;
              if (round.isSpecial && currentSubjectId) {
                const subject = round.subjects?.find(s => s.id === currentSubjectId);
                if (subject && prevIndex >= 0) {
                  set({ 
                    currentSlide: { 
                      type: 'answer', 
                      roundId: round.id, 
                      questionIndex: prevIndex,
                      subjectId: currentSubjectId
                    },
                    questionIndex: prevIndex,
                    currentQuestion: subject.questions[prevIndex]
                  });
                }
              } else if (!round.isSpecial && round.questions && prevIndex >= 0) {
                set({ 
                  currentSlide: { type: 'answer', roundId: round.id, questionIndex: prevIndex },
                  questionIndex: prevIndex,
                  currentQuestion: round.questions[prevIndex]
                });
              }
            }
            break;
            
          case 'answer':
            if (round.isSpecial && currentSubjectId) {
              const subject = round.subjects?.find(s => s.id === currentSubjectId);
              if (subject) {
                const question = subject.questions[questionIndex];
                if (question.type === 'media-first') {
                  set({ 
                    currentSlide: { 
                      type: 'question-media', 
                      roundId: round.id, 
                      questionIndex,
                      subjectId: currentSubjectId 
                    }
                  });
                } else {
                  set({ 
                    currentSlide: { 
                      type: 'question', 
                      roundId: round.id, 
                      questionIndex,
                      subjectId: currentSubjectId 
                    }
                  });
                }
              }
            } else if (!round.isSpecial && round.questions) {
              const question = round.questions[questionIndex];
              if (question.type === 'media-first') {
                set({ 
                  currentSlide: { type: 'question-media', roundId: round.id, questionIndex }
                });
              } else {
                set({ 
                  currentSlide: { type: 'question', roundId: round.id, questionIndex }
                });
              }
            }
            break;
            
          case 'subjectSelection':
            set({ currentSlide: { type: 'rules', roundId: round.id } });
            break;
            
          case 'endOfRound':
            if (!round.isSpecial && round.questions && round.questions.length > 0) {
              const lastIndex = round.questions.length - 1;
              set({ 
                currentSlide: { type: 'answer', roundId: round.id, questionIndex: lastIndex },
                questionIndex: lastIndex,
                currentQuestion: round.questions[lastIndex]
              });
            } else if (round.isSpecial) {
              set({ currentSlide: { type: 'subjectSelection', roundId: round.id } });
            }
            break;
            
          default:
            break;
        }
      },
      
      goToRoundSelection: () => {
        set({ currentSlide: { type: 'roundSelection' } });
      },
      
      // Question Management
      currentQuestion: null,
      questionIndex: 0,
      setQuestionIndex: (index: number) => set({ questionIndex: index }),
      
      // Subject Management
      currentSubjectId: null,
      setCurrentSubject: (subjectId: string) => {
        const { currentRound } = get();
        if (currentRound?.isSpecial && currentRound.subjects) {
          const subject = currentRound.subjects.find(s => s.id === subjectId);
          if (subject && subject.questions.length > 0) {
            const firstQuestion = subject.questions[0];
            
            // Check if it's a media-first question
            if (firstQuestion.type === 'media-first' && firstQuestion.media) {
              set({ 
                currentSubjectId: subjectId,
                currentQuestion: firstQuestion,
                questionIndex: 0,
                currentSlide: { 
                  type: 'question-media', 
                  roundId: currentRound.id, 
                  questionIndex: 0,
                  subjectId 
                }
              });
            } else {
              // Regular question
              set({ 
                currentSubjectId: subjectId,
                currentQuestion: firstQuestion,
                questionIndex: 0,
                currentSlide: { 
                  type: 'question', 
                  roundId: currentRound.id, 
                  questionIndex: 0,
                  subjectId 
                }
              });
            }
          }
        }
      },
      
      // UI State
      isFullscreen: false,
      toggleFullscreen: () => {
        const isFullscreen = get().isFullscreen;
        if (!isFullscreen) {
          const docEl = document.documentElement;
          const requestFullScreen = 
            docEl.requestFullscreen || 
            (docEl as any).mozRequestFullScreen || 
            (docEl as any).webkitRequestFullscreen || 
            (docEl as any).msRequestFullscreen;
          
          if (requestFullScreen) {
            requestFullScreen.call(docEl);
          }
        } else {
          const exitFullScreen = 
            document.exitFullscreen || 
            (document as any).mozCancelFullScreen || 
            (document as any).webkitExitFullscreen || 
            (document as any).msExitFullscreen;
          
          if (exitFullScreen) {
            exitFullScreen.call(document);
          }
        }
        
        set({ isFullscreen: !isFullscreen });
      },
      
      isTimerActive: false,
      toggleTimer: () => set(state => ({ isTimerActive: !state.isTimerActive })),
      resetTimer: () => {
        const currentRound = get().currentRound;
        const defaultTimerValue = currentRound?.isRapidFire ? 60 : 15;
        set({ timerValue: defaultTimerValue });
      },
      timerValue: 15,
      decrementTimer: () => set(state => {
        if (state.timerValue > 0 && state.isTimerActive) {
          return { timerValue: state.timerValue - 1 };
        }
        return { isTimerActive: false };
      }),
      
      // Function to skip to next question without showing answer
      skipToNextQuestion: () => {
        const { currentRound, questionIndex, currentSubjectId } = get();
        const round = currentRound;
        
        if (!round) {
          return;
        }
        
        if (round.isSpecial && currentSubjectId) {
          const subject = round.subjects?.find(s => s.id === currentSubjectId);
          if (subject) {
            const nextIndex = questionIndex + 1;
            if (nextIndex < subject.questions.length) {
              const nextQuestion = subject.questions[nextIndex];
              
              // Check if it's a media-first question
              if (nextQuestion.type === 'media-first' && nextQuestion.media) {
                set({ 
                  currentSlide: { 
                    type: 'question-media', 
                    roundId: round.id, 
                    questionIndex: nextIndex,
                    subjectId: currentSubjectId 
                  },
                  currentQuestion: nextQuestion,
                  questionIndex: nextIndex
                });
              } else {
                set({ 
                  currentSlide: { 
                    type: 'question', 
                    roundId: round.id, 
                    questionIndex: nextIndex,
                    subjectId: currentSubjectId 
                  },
                  currentQuestion: nextQuestion,
                  questionIndex: nextIndex
                });
              }
            } else {
              // If this is the last question, go back to subject selection
              set({ currentSlide: { type: 'subjectSelection', roundId: round.id } });
            }
          }
        } else if (!round.isSpecial && round.questions) {
          const nextIndex = questionIndex + 1;
          if (nextIndex < round.questions.length) {
            const nextQuestion = round.questions[nextIndex];
            
            // Check if it's a media-first question
            if (nextQuestion.type === 'media-first' && nextQuestion.media) {
              set({ 
                currentSlide: { type: 'question-media', roundId: round.id, questionIndex: nextIndex },
                currentQuestion: nextQuestion,
                questionIndex: nextIndex
              });
            } else {
              set({ 
                currentSlide: { type: 'question', roundId: round.id, questionIndex: nextIndex },
                currentQuestion: nextQuestion,
                questionIndex: nextIndex
              });
            }
          } else {
            set({ currentSlide: { type: 'endOfRound', roundId: round.id } });
          }
        }
      }
    }),
    {
      name: 'quiz-state',
      // Only persist certain parts of the store
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentRound: state.currentRound,
        currentSlide: state.currentSlide,
        currentQuestion: state.currentQuestion,
        questionIndex: state.questionIndex,
        currentSubjectId: state.currentSubjectId,
      }),
    }
  )
);
