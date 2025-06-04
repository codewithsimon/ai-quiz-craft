import React, { useState } from 'react';
import { Sparkles, Book, Lightbulb, Send, Brain } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface HeroProps {
  onGenerateQuiz: (prompt: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onGenerateQuiz }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY  });

  const examplePrompts = [
    {
      title: "Science Quiz",
      prompt: "Generate a 10-question quiz about the solar system for middle school students",
      icon: <Brain className="w-5 h-5" />
    },
    {
      title: "Literature",
      prompt: "Create a quiz about Shakespeare's plays with 5 multiple choice questions",
      icon: <Book className="w-5 h-5" />
    },
    {
      title: "General Knowledge",
      prompt: "Make a trivia quiz with questions about world capitals and geography",
      icon: <Lightbulb className="w-5 h-5" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                answer: { type: Type.STRING }
              },
              required: ["question", "options", "answer"],
              propertyOrdering: ["question", "options", "answer"]
            }
          }
        }
      });

      // console.log(response.text);

      // Parse the response text as JSON
      const quizRaw = JSON.parse(response.text ?? "[]");
   

      // Convert Gemini's answer format to your QuizQuestion format
      const quiz = quizRaw.map((item: any, idx: number) => ({
        id: idx + 1,
        question: item.question,
        options: item.options,
        correctAnswer: item.options.findIndex((opt: string) => opt === item.answer)
      }));

      onGenerateQuiz(quiz);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <section className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Generate Perfect Quizzes <span className="text-blue-600 dark:text-blue-400">in Seconds</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Just enter a prompt, and our AI will craft a customized quiz for your specific needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="mb-3">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Create a 10-question quiz about climate change with multiple choice answers"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white resize-none transition-all duration-200"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 ${isGenerating || !prompt.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Generate Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Example prompts to try</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {examplePrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(item.prompt)}
                  className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;