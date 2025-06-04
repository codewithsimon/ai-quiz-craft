import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  onRegenerate: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onRegenerate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    
    // Wait a bit before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) correct++;
    });
    return correct;
  };

  const handleTryAgain = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };
  
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          {showResults ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {calculateScore()}/{questions.length}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Quiz Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {calculateScore() === questions.length 
                    ? '🎉 Perfect score! Excellent work!' 
                    : calculateScore() > questions.length / 2 
                      ? '👏 Good job! You did well.' 
                      : '💪 Keep practicing, you\'ll get better!'}
                </p>
                
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                    return (
                      <div 
                        key={question.id} 
                        className={`p-4 rounded-lg ${
                          isCorrect 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium mb-2">
                              {index + 1}. {question.question}
                            </p>
                            <p className="text-sm">
                              Your answer: <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                {question.options[selectedAnswers[question.id]]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600 dark:text-green-400">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 flex justify-center gap-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onRegenerate}
                  className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <button
                    onClick={onRegenerate}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Different quiz
                  </button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-medium mb-6 text-gray-900 dark:text-white">
                  {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleOptionSelect(currentQuestion.id, optionIndex)}
                      className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:transform hover:translate-x-1 group
                        bg-gray-50 hover:bg-blue-50 dark:bg-gray-700/50 dark:hover:bg-blue-900/30
                        border border-gray-200 hover:border-blue-200 dark:border-gray-600 dark:hover:border-blue-800"
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full 
                          bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 
                          group-hover:bg-blue-100 group-hover:text-blue-600
                          dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400
                          mr-3 text-sm font-medium"
                        >
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {option}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;