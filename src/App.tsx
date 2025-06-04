import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import { QuizQuestion } from './components/Quiz';

function App() {
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);

  const handleGenerateQuiz = (quiz: QuizQuestion[]) => {
    setGeneratedQuiz(quiz);
  };

  const handleRegenerate = () => {
    setGeneratedQuiz(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      {generatedQuiz ? (
        <Quiz questions={generatedQuiz} onRegenerate={handleRegenerate} />
      ) : (
        <Hero onGenerateQuiz={handleGenerateQuiz} />
      )}
    </div>
  );
}

export default App;