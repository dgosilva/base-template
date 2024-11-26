import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statuses = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  ON_BREAK: 'On Break',
  COMPLETED: 'Completed'
};

function Timer({ timeLeft, status, onTimeEnd, onHighlight }) {
  const [seconds, setSeconds] = useState(timeLeft);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === statuses.IN_PROGRESS || status === statuses.ON_BREAK) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current);
            onTimeEnd();
            return 0;
          }
          if (prevSeconds <= 10) onHighlight();
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [status, timeLeft]);

  return (
    <div className="text-center text-4xl mb-4">
      {Math.floor(seconds / 60)}:{('0' + (seconds % 60)).slice(-2)}
    </div>
  );
}

function TaskCard({ task, isActive, onClick }) {
  const statusColor = {
    [statuses.NOT_STARTED]: 'bg-blue-100',
    [statuses.IN_PROGRESS]: 'bg-green-100',
    [statuses.ON_BREAK]: 'bg-yellow-100',
    [statuses.COMPLETED]: 'bg-gray-100'
  };

  return (
    <Card className={`${statusColor[task.status]} ${isActive ? 'border-2 border-orange-500' : ''} cursor-pointer`} onClick={() => onClick(task)}>
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">{task.status}</div>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Code Review', description: 'Review new pull requests', status: statuses.NOT_STARTED },
    { id: 2, name: 'Write Report', description: 'Summarize weekly progress', status: statuses.NOT_STARTED }
  ]);
  const [activeTask, setActiveTask] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(statuses.NOT_STARTED);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);

  const startTimer = () => {
    if (activeTask) {
      setCurrentStatus(currentStatus === statuses.IN_PROGRESS ? statuses.ON_BREAK : statuses.IN_PROGRESS);
      setTimeLeft(currentStatus === statuses.IN_PROGRESS ? breakTime * 60 : workTime * 60);
    }
  };

  const resetTimer = () => {
    setCurrentStatus(statuses.NOT_STARTED);
    setTimeLeft(workTime * 60);
  };

  const handleTimeEnd = () => {
    if (currentStatus === statuses.IN_PROGRESS) {
      setCurrentStatus(statuses.ON_BREAK);
      setTimeLeft(breakTime * 60);
    } else if (currentStatus === statuses.ON_BREAK) {
      setCurrentStatus(statuses.COMPLETED);
      setActiveTask(null);
      setTasks(tasks.map(t => t.id === activeTask.id ? { ...t, status: statuses.COMPLETED } : t));
    }
  };

  const handleHighlight = () => {
    // This function could change the UI to highlight the timer, for simplicity we'll just log
    console.log('Timer is highlighting');
  };

  const selectTask = (task) => {
    if (!activeTask) {
      setActiveTask(task);
      setCurrentStatus(statuses.IN_PROGRESS);
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: statuses.IN_PROGRESS } : t));
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-4">
        <Label>Work Time (min)</Label>
        <Input type="number" value={workTime} onChange={(e) => setWorkTime(e.target.value)} className="w-full mb-2" />
        <Label>Break Time (min)</Label>
        <Input type="number" value={breakTime} onChange={(e) => setBreakTime(e.target.value)} className="w-full" />
      </div>

      <div className="mb-4 text-center">
        <Button onClick={startTimer} disabled={!activeTask}>Start/Pause</Button>
        <Button onClick={resetTimer} className="ml-2">Reset</Button>
      </div>

      {activeTask && (
        <div>
          <Timer timeLeft={timeLeft} status={currentStatus} onTimeEnd={handleTimeEnd} onHighlight={handleHighlight} />
          <h2 className="text-2xl mb-2">Current Task: {activeTask.name}</h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl mb-2">To Do</h2>
          {tasks.filter(t => t.status === statuses.NOT_STARTED || t.status === statuses.IN_PROGRESS || t.status === statuses.ON_BREAK).map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              isActive={activeTask && activeTask.id === task.id}
              onClick={selectTask} 
            />
          ))}
        </div>
        <div>
          <h2 className="text-xl mb-2">Completed</h2>
          {tasks.filter(t => t.status === statuses.COMPLETED).map(task => (
            <TaskCard key={task.id} task={task} onClick={selectTask} />
          ))}
        </div>
      </div>
    </div>
  );
}