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
      {!selectedLanguage ? (import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialPolls = [
  {
    id: 1,
    question: "What's your favorite color?",
    options: ["Red", "Blue", "Green"],
    votes: [0, 0, 0],
  },
  {
    id: 2,
    question: "Best programming language?",
    options: ["JavaScript", "Python", "Java"],
    votes: [0, 0, 0],
  },
];

const PollList = ({ polls, onAnswer, onEdit, onResults }) => (
  <div className="space-y-4">
    {polls.map((poll) => (
      <Card key={poll.id}>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          <Button onClick={() => onAnswer(poll)}>Answer</Button>
          <Button onClick={() => onEdit(poll)}>Edit</Button>
          <Button onClick={() => onResults(poll)}>Results</Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const PollForm = ({ poll, onSave, onClose }) => {
  const [question, setQuestion] = useState(poll?.question || "");
  const [options, setOptions] = useState(poll?.options || ["", "", ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: poll?.id || Date.now(), question, options, votes: new Array(options.length).fill(0) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="question">Question</Label>
      <Input
        id="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        required
      />
      {options.map((option, index) => (
        <div key={index}>
          <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
          <Input
            id={`option-${index}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Enter option ${index + 1}`}
            required
          />
        </div>
      ))}
      <div className="flex justify-between">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

const PollVote = ({ poll, onVote, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = () => {
    if (selectedOption !== null) {
      onVote(poll.id, selectedOption);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{poll.question}</h2>
      {poll.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`option-${index}`}
            name="poll-option"
            value={index}
            checked={selectedOption === index}
            onChange={() => setSelectedOption(index)}
          />
          <Label htmlFor={`option-${index}`}>{option}</Label>
        </div>
      ))}
      <div className="flex justify-between">
        <Button onClick={handleVote} disabled={selectedOption === null}>Vote</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

const PollResults = ({ poll }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">{poll.question}</h2>
    {poll.options.map((option, index) => (
      <div key={index} className="space-y-1">
        <div className="flex justify-between">
          <span>{option}</span>
          <span>{poll.votes[index]} votes</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${(poll.votes[index] / poll.votes.reduce((a, b) => a + b, 0)) * 100}%`,
              backgroundColor: `hsl(${(index * 360) / poll.options.length}, 70%, 50%)`,
            }}
          ></div>
        </div>
      </div>
    ))}
  </div>
);

export default function App() {
  const [polls, setPolls] = useState(initialPolls);
  const [activeTab, setActiveTab] = useState("list");
  const [activePoll, setActivePoll] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const storedPolls = localStorage.getItem("polls");
    if (storedPolls) {
      setPolls(JSON.parse(storedPolls));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("polls", JSON.stringify(polls));
  }, [polls]);

  const handleSavePoll = (savedPoll) => {
    setPolls((prevPolls) =>
      prevPolls.some((p) => p.id === savedPoll.id)
        ? prevPolls.map((p) => (p.id === savedPoll.id ? savedPoll : p))
        : [...prevPolls, savedPoll]
    );
    setActiveTab("list");
    setActivePoll(null);
    showDialog("Poll saved successfully!");
  };

  const handleVote = (pollId, optionIndex) => {
    setPolls((prevPolls) =>
      prevPolls.map((p) =>
        p.id === pollId
          ? { ...p, votes: p.votes.map((v, i) => (i === optionIndex ? v + 1 : v)) }
          : p
      )
    );
    setActiveTab("list");
    setActivePoll(null);
    showDialog("Vote submitted successfully!");
  };

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Online Poll Creator</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">Polls</TabsTrigger>
          <TabsTrigger value="create">Create Poll</TabsTrigger>
          {activePoll && (
            <>
              <TabsTrigger value="edit">Edit Poll</TabsTrigger>
              <TabsTrigger value="vote">Vote</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="list">
          <PollList
            polls={polls}
            onAnswer={(poll) => {
              setActivePoll(poll);
              setActiveTab("vote");
            }}
            onEdit={(poll) => {
              setActivePoll(poll);
              setActiveTab("edit");
            }}
            onResults={(poll) => {
              setActivePoll(poll);
              setActiveTab("results");
            }}
          />
        </TabsContent>
        <TabsContent value="create">
          <PollForm onSave={handleSavePoll} onClose={() => setActiveTab("list")} />
        </TabsContent>
        <TabsContent value="edit">
          {activePoll && (
            <PollForm
              poll={activePoll}
              onSave={handleSavePoll}
              onClose={() => setActiveTab("list")}
            />
          )}
        </TabsContent>
        <TabsContent value="vote">
          {activePoll && (
            <PollVote
              poll={activePoll}
              onVote={handleVote}
              onClose={() => setActiveTab("list")}
            />
          )}
        </TabsContent>
        <TabsContent value="results">
          {activePoll && <PollResults poll={activePoll} />}
        </TabsContent>
      </Tabs>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification</DialogTitle>
          </DialogHeader>
          <p>{dialogMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
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