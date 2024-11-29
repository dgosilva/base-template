import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const languages = {
  '🇪🇸 Spanish': { 
    vocabulary: [
      { question: "House", answer: "Casa" },
      { question: "Water", answer: "Agua" }
    ],
    grammar: [
      { question: "He ___ to the store.", answer: "goes", options: ["goes", "go", "went"] }
    ]
  },
  '🇫🇷 French': {
    vocabulary: [
      { question: "Book", answer: "Livre" },
      { question: "Car", answer: "Voiture" }
    ],
    grammar: [
      { question: "She ___ very well.", answer: "speaks", options: ["speaks", "speak", "spoken"] }
    ]
  }
};

function Quiz({ language }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const questions = [...languages[language].vocabulary, ...languages[language].grammar];
  const currentQuestion = questions[questionIndex];

  const checkAnswer = () => {
    let isCorrect = false;
    if (currentQuestion.options) {
      isCorrect = currentQuestion.options.some(option => option.toLowerCase() === userAnswer.toLowerCase());
    } else {
      isCorrect = currentQuestion.answer.toLowerCase() === userAnswer.toLowerCase();
    }
    
    setShowResult({
      correct: isCorrect,
      correctAnswer: currentQuestion.answer
    });
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const nextQuestion = () => {
    setShowResult(null);
    setUserAnswer('');
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  return (
    <Card className="sm:w-full w-80">
      <CardHeader>
        <CardTitle>{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {currentQuestion.options ? (
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <Button 
                key={idx} 
                onClick={() => setUserAnswer(option)}
                variant={userAnswer === option ? "secondary" : "outline"}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <Input 
            placeholder="Type your answer" 
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)} 
          />
        )}
        <Button onClick={checkAnswer} className="mt-4">Confirm</Button>
        {showResult && (
          <div className={`mt-4 ${showResult.correct ? 'text-green-500' : 'text-red-500'}`}>
            {showResult.correct ? 
              <div className="flex items-center">✅ Correct!</div> :
              <div className="flex items-center">
                ❌ Incorrect. The correct answer is: {showResult.correctAnswer}
                <Button onClick={nextQuestion} className="ml-2">Next</Button>
              </div>
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FriendsSection() {
  const friends = [
    { name: 'Alice', level: 5, language: '🇪🇸 Spanish' },
    { name: 'Bob', level: 3, language: '🇫🇷 French' }
  ];

  return (
    <Card className="mt-4 sm:w-full w-80">
      <CardHeader>
        <CardTitle>Friends</CardTitle>
      </CardHeader>
      <CardContent>
        {friends.map(friend => (
          <div key={friend.name} className="flex items-center justify-between">
            <span>{friend.name}</span>
            <span>{friend.language} Level {friend.level}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) {
      setLevel(prevLevel => prevLevel + 1);
      setProgress(0);
    }
  }, [progress]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl">Language Learning Quiz</h1>
      {!selectedLanguage ? (
        <div className="space-y-4">
          {Object.keys(languages).map(lang => (
            <Button key={lang} onClick={() => setSelectedLanguage(lang)}>
              Learn {lang}
            </Button>
          ))}
        </div>
      ) : (
        <>
          <Quiz language={selectedLanguage} setProgress={setProgress} />
          <Progress value={progress} className="w-full sm:w-80" />
          <div>Level: {level}</div>
          <FriendsSection />
        </>
      )}
    </div>
  );
}