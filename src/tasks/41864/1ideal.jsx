import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define an object to store question types
const Q_TYPES = {
  MULTIPLE_CHOICE: "mc",
  TRUE_FALSE: "tf",
  FILL_IN_THE_BLANK: "fib"
};

// Language options with emojis for visual representation
const languages = [
  { name: "Spanish", emoji: "🇪🇸" },
  { name: "French", emoji: "🇫🇷" },
  { name: "German", emoji: "🇩🇪" },
  { name: "Italian", emoji: "🇮🇹" },
];

// Questions categorized by language
const questions = {
  Spanish: [
    { type: Q_TYPES.MULTIPLE_CHOICE, question: "What is 'hello' in Spanish?", options: ["Hola", "Bonjour", "Ciao", "Hallo"], answer: "Hola" },
    { type: Q_TYPES.TRUE_FALSE, question: "Is 'gato' the Spanish word for 'dog'?", answer: false },
    { type: Q_TYPES.FILL_IN_THE_BLANK, question: "Complete: 'Buenos ____'", answer: "días" },
  ],
  French: [
    { type: Q_TYPES.MULTIPLE_CHOICE, question: "What is 'goodbye' in French?", options: ["Au revoir", "Adios", "Ciao", "Auf Wiedersehen"], answer: "Au revoir" },
    { type: Q_TYPES.TRUE_FALSE, question: "Is 'chat' the French word for 'cat'?", answer: true },
    { type: Q_TYPES.FILL_IN_THE_BLANK, question: "Complete: 'Bonjour, comment allez-____'", answer: "vous" },
  ],
  German: [
    { type: Q_TYPES.MULTIPLE_CHOICE, question: "What is 'thank you' in German?", options: ["Danke", "Merci", "Gracias", "Grazie"], answer: "Danke" },
    { type: Q_TYPES.TRUE_FALSE, question: "Is 'Hund' the German word for 'house'?", answer: false },
    { type: Q_TYPES.FILL_IN_THE_BLANK, question: "Complete: 'Guten ____'", answer: "Tag" },
  ],
  Italian: [
    { type: Q_TYPES.MULTIPLE_CHOICE, question: "What is 'please' in Italian?", options: ["Per favore", "S'il vous plaît", "Por favor", "Bitte"], answer: "Per favore" },
    { type: Q_TYPES.TRUE_FALSE, question: "Is 'cane' the Italian word for 'cat'?", answer: false },
    { type: Q_TYPES.FILL_IN_THE_BLANK, question: "Complete: 'Buona ____'", answer: "sera" },
  ],
};

// Friends list to display in the app
const friends = [
  { name: "Alice", language: "Spanish", level: 5 },
  { name: "Bob", language: "French", level: 3 },
  { name: "Charlie", language: "German", level: 4 },
];

// Component for displaying each quiz question
function QuizQuestion({ question, onAnswer }) {
  const [answer, setAnswer] = useState("");

  // Handle submission of an answer
  const handleAnswer = () => {
    onAnswer(answer); // Pass the answer to the parent component
    setAnswer("");    // Reset the answer field
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Render options based on question type */}
        {question.type === Q_TYPES.MULTIPLE_CHOICE && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => setAnswer(option)}
                variant={answer === option ? "default" : "outline"}
                className="w-full"
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        {question.type === Q_TYPES.TRUE_FALSE && (
          <div className="space-x-2">
            <Button onClick={() => setAnswer("true")} variant={answer === "true" ? "default" : "outline"}>
              True
            </Button>
            <Button onClick={() => setAnswer("false")} variant={answer === "false" ? "default" : "outline"}>
              False
            </Button>
          </div>
        )}
        {question.type === Q_TYPES.FILL_IN_THE_BLANK && (
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer"
            className="w-full"
          />
        )}
        <Button onClick={handleAnswer} className="mt-4 w-full" disabled={!answer}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}

// Component for displaying feedback after an answer is submitted
function FeedbackDialog({ isOpen, onClose, isCorrect, correctAnswer }) {
  // Convert boolean correctAnswer to "True" or "False" if necessary
  const displayAnswer = typeof correctAnswer === "boolean" ? (correctAnswer ? "True" : "False") : correctAnswer;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
        <DialogHeader>
          <DialogTitle>{isCorrect ? "Correct! ✅" : "Incorrect ❌"}</DialogTitle>
        </DialogHeader>
        {!isCorrect && <p>The correct answer is: {displayAnswer}</p>}
      </DialogContent>
    </Dialog>
  );
}

// Main app component
export default function App() {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Effect to handle level progression
  useEffect(() => {
    if (progress >= 100) {
      setLevel((prevLevel) => prevLevel + 1); // Increase level
      setProgress(0); // Reset progress
    }
  }, [progress]);

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setCurrentQuestion(0);
    setScore(0);
    setLevel(1);
    setProgress(0);
  };

  // Handle answer submission and feedback logic
  const handleAnswer = (answer) => {
    const currentQ = questions[selectedLanguage][currentQuestion];
    const isAnswerCorrect =
      currentQ.type === Q_TYPES.FILL_IN_THE_BLANK
        ? answer.toLowerCase() === currentQ.answer.toLowerCase()
        : answer.toString().toLowerCase() === currentQ.answer.toString().toLowerCase();

    setIsCorrect(isAnswerCorrect);
    setCorrectAnswer(currentQ.answer); // Capture correct answer for the current question
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 1);
      setProgress((prevProgress) => Math.min(prevProgress + 33.33, 100));
      setTimeout(() => setShowFeedback(false), 1000);
    }

    setTimeout(() => {
      if (currentQuestion < questions[selectedLanguage].length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        setCurrentQuestion(0);
      }
    }, isAnswerCorrect ? 1000 : 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Language Learning Quiz</h1>
      {!selectedLanguage ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <Button key={lang.name} onClick={() => handleLanguageSelect(lang.name)} className="text-lg">
              {lang.emoji} {lang.name}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {languages.find((lang) => lang.name === selectedLanguage).emoji} {selectedLanguage}
            </h2>
            <Button onClick={() => setSelectedLanguage(null)}>Change Language</Button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg">Score: {score}</p>
            <div className="text-right">
              <p className="text-lg">Level: {level}</p>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
          <QuizQuestion
            question={questions[selectedLanguage][currentQuestion]}
            onAnswer={handleAnswer}
          />
          <FeedbackDialog
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            isCorrect={isCorrect}
            correctAnswer={correctAnswer} // Use the captured correct answer
          />
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li key={friend.name} className="flex justify-between items-center">
                    <span>{friend.name}</span>
                    <span>
                      {languages.find((lang) => lang.name === friend.language).emoji} Level {friend.level}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}