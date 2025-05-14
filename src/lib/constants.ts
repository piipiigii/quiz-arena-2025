
export const ADMIN_PASSWORD = "quiz123"; // Replace with your desired password

export const APP_NAME = "Quiz Arena";

export const TIMER_DURATION = 15; // seconds

export const KEYBOARD_SHORTCUTS = {
  NEXT_SLIDE: ["ArrowRight", " "], // Right arrow or space
  PREV_SLIDE: ["ArrowLeft"],
  HOME: ["Home"],
  FULLSCREEN: ["f"],
  TIMER: ["t"],
};

export const MAX_ROUNDS = 10;

// Sample round data (in a real app, this would be loaded from JSON files)
export const SAMPLE_ROUNDS: Record<number, any> = {
  1: {
    id: 1,
    title: "General Knowledge",
    description: "Test your knowledge across a variety of topics!",
    isSpecial: false,
    questions: [
      {
        id: "q1-1",
        text: "What is the capital of France?",
        answers: [
          { text: "London", isCorrect: false },
          { text: "Berlin", isCorrect: false },
          { text: "Paris", isCorrect: true },
          { text: "Madrid", isCorrect: false }
        ]
      },
      {
        id: "q1-2",
        text: "Who wrote 'Romeo and Juliet'?",
        answers: [
          { text: "Charles Dickens", isCorrect: false },
          { text: "William Shakespeare", isCorrect: true },
          { text: "Jane Austen", isCorrect: false },
          { text: "Mark Twain", isCorrect: false }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: "Science & Technology",
    description: "Explore the wonders of science and technology!",
    isSpecial: false,
    questions: [
      {
        id: "q2-1",
        text: "What planet is known as the Red Planet?",
        answers: [
          { text: "Venus", isCorrect: false },
          { text: "Mars", isCorrect: true },
          { text: "Jupiter", isCorrect: false },
          { text: "Saturn", isCorrect: false }
        ]
      },
      {
        id: "q2-2",
        text: "What is the chemical symbol for gold?",
        answers: [
          { text: "Go", isCorrect: false },
          { text: "Gd", isCorrect: false },
          { text: "Au", isCorrect: true },
          { text: "Ag", isCorrect: false }
        ]
      }
    ]
  },
  3: {
    id: 3,
    title: "Choose Your Topic",
    description: "Select from a variety of subjects and answer questions!",
    isSpecial: true,
    subjects: [
      {
        id: "sports",
        name: "Sports",
        questions: [
          {
            id: "sports-1",
            text: "Which country won the FIFA World Cup in 2018?",
            answers: [
              { text: "Brazil", isCorrect: false },
              { text: "Germany", isCorrect: false },
              { text: "France", isCorrect: true },
              { text: "Argentina", isCorrect: false }
            ]
          },
          {
            id: "sports-2",
            text: "How many players are on a standard basketball team on the court?",
            answers: [
              { text: "4", isCorrect: false },
              { text: "5", isCorrect: true },
              { text: "6", isCorrect: false },
              { text: "7", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: "history",
        name: "History",
        questions: [
          {
            id: "history-1",
            text: "In what year did World War II end?",
            answers: [
              { text: "1943", isCorrect: false },
              { text: "1945", isCorrect: true },
              { text: "1947", isCorrect: false },
              { text: "1950", isCorrect: false }
            ]
          },
          {
            id: "history-2",
            text: "Who was the first President of the United States?",
            answers: [
              { text: "Thomas Jefferson", isCorrect: false },
              { text: "John Adams", isCorrect: false },
              { text: "George Washington", isCorrect: true },
              { text: "Abraham Lincoln", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: "movies",
        name: "Movies",
        questions: [
          {
            id: "movies-1",
            text: "Who directed the movie 'Jaws'?",
            answers: [
              { text: "Steven Spielberg", isCorrect: true },
              { text: "George Lucas", isCorrect: false },
              { text: "Martin Scorsese", isCorrect: false },
              { text: "Francis Ford Coppola", isCorrect: false }
            ]
          },
          {
            id: "movies-2",
            text: "Which movie features a character named Jack Dawson?",
            answers: [
              { text: "The Revenant", isCorrect: false },
              { text: "Inception", isCorrect: false },
              { text: "Titanic", isCorrect: true },
              { text: "The Great Gatsby", isCorrect: false }
            ]
          }
        ]
      }
    ]
  }
};
