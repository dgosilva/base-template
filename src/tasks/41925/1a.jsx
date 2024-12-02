import React, { useState, useEffect } from 'react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Dialog, DialogContent, DialogTrigger, DialogClose, 
  Input, Label, Progress, Toast, useToast
} from "@/components/ui";

const initialPolls = [
  { id: 1, question: "What's your favorite color?", options: ["Red", "Blue", "Green"], votes: [5, 3, 7] },
];

export default function App() {
  const [polls, setPolls] = useState(initialPolls);
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { toast } = useToast();

  const addPoll = (question, options) => {
    setPolls(prev => [...prev, { 
      id: Date.now(), 
      question, 
      options, 
      votes: Array(options.length).fill(0) 
    }]);
    setDialogMessage("Poll added successfully!");
    setDialogOpen(true);
  };

  const updatePoll = (id, question, options) => {
    setPolls(prev => prev.map(poll => 
      poll.id === id ? { ...poll, question, options } : poll
    ));
    setDialogMessage("Poll updated successfully!");
    setDialogOpen(true);
  };

  const vote = (pollId, optionIndex) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { 
        ...poll, 
        votes: poll.votes.map((vote, i) => i === optionIndex ? vote + 1 : vote)
      } : poll
    ));
    setDialogMessage("Thank you for your vote!");
    setDialogOpen(true);
  };

  const closeTab = () => {
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Tabs defaultValue="list" className="w-full max-w-2xl mx-auto">
        <TabsList>
          <TabsTrigger value="list">Polls</TabsTrigger>
          <TabsTrigger value="create">Create Poll</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {polls.map(poll => (
            <Card key={poll.id} className="mb-4">
              <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Choose an action:</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => { setActiveTab(`answer-${poll.id}`); }}>Answer</Button>
                <Button onClick={() => { setActiveTab(`edit-${poll.id}`); }}>Edit</Button>
                <Button onClick={() => { setActiveTab(`results-${poll.id}`); }}>Results</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="create">
          <PollForm onSubmit={addPoll} onCancel={() => setActiveTab('list')} />
        </TabsContent>
        {polls.map(poll => (
          <>
            <TabsContent value={`answer-${poll.id}`}>
              <AnswerPoll poll={poll} onVote={vote} onClose={closeTab} />
            </TabsContent>
            <TabsContent value={`edit-${poll.id}`}>
              <EditPoll poll={poll} onSubmit={updatePoll} onClose={closeTab} />
            </TabsContent>
            <TabsContent value={`results-${poll.id}`}>
              <PollResults poll={poll} onClose={closeTab} />
            </TabsContent>
          </>
        ))}
      </Tabs>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setDialogOpen(false)}>
            {dialogMessage}
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PollForm({ onSubmit, onCancel }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(question, options.filter(o => o));
    setQuestion('');
    setOptions(['', '']);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Poll question" required />
      {options.map((opt, i) => (
        <Input 
          key={i}
          type="text" 
          value={opt} 
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }} 
          placeholder={`Option ${i + 1}`} 
          required 
        />
      ))}
      <Button type="button" onClick={() => setOptions([...options, ''])}>Add Option</Button>
      <div className="flex justify-between mt-4">
        <Button type="submit">Create Poll</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function AnswerPoll({ poll, onVote, onClose }) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {poll.options.map((option, index) => (
            <Button key={index} onClick={() => { onVote(poll.id, index); onClose(); }} className="mb-2 w-full">
              {option}
            </Button>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function EditPoll({ poll, onSubmit, onClose }) {
  const [question, setQuestion] = useState(poll.question);
  const [options, setOptions] = useState(poll.options);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(poll.id, question, options);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Poll question" required />
      {options.map((opt, i) => (
        <Input 
          key={i}
          type="text" 
          value={opt} 
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }} 
          placeholder={`Option ${i + 1}`} 
          required 
        />
      ))}
      <Button type="button" onClick={() => setOptions([...options, ''])}>Add Option</Button>
      <div className="flex justify-between mt-4">
        <Button type="submit">Save Changes</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function PollResults({ poll, onClose }) {
  const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
        <CardDescription>Total votes: {totalVotes}</CardDescription>
      </CardHeader>
      <CardContent>
        {poll.options.map((option, index) => (
          <div key={index} className="mb-2">
            <Label>{option}</Label>
            <Progress value={(poll.votes[index] / totalVotes) * 100 || 0} className="mb-1" />
            <p>{poll.votes[index]} votes</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
}