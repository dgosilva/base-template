import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, addDays } from 'date-fns';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [tasks, setTasks] = useState([]);
  const [plants, setPlants] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addTask = (task) => {
    setTasks(prevTasks => [...prevTasks, { ...task, id: Date.now() }]);
    // Here you would implement persistence logic
  };

  const toggleTask = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    );
    // Here you would implement persistence logic
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    // Here you would implement persistence logic
  };

  const addPlant = (plant) => {
    setPlants(prevPlants => [...prevPlants, { ...plant, id: Date.now() }]);
    // Here you would implement persistence logic
  };

  const TaskForm = () => {
    const [task, setTask] = useState({ name: '', date: format(selectedDate, 'yyyy-MM-dd'), description: '', time: '', recurrence: '' });

    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={task.name} 
            onChange={e => setTask({...task, name: e.target.value})} 
            placeholder="Task Name" 
            required 
          />
          <Input 
            type="date" 
            value={task.date} 
            onChange={e => setTask({...task, date: e.target.value})} 
            required 
          />
          <Input 
            value={task.description} 
            onChange={e => setTask({...task, description: e.target.value})} 
            placeholder="Description" 
          />
          <Input 
            type="time" 
            value={task.time} 
            onChange={e => setTask({...task, time: e.target.value})} 
          />
          <Input 
            value={task.recurrence} 
            onChange={e => setTask({...task, recurrence: e.target.value})} 
            placeholder="Recurrence (e.g., daily, weekly)" 
          />
          <Button onClick={() => {addTask(task); setTask({ name: '', date: format(selectedDate, 'yyyy-MM-dd'), description: '', time: '', recurrence: '' });}}>
            Add Task
          </Button>
        </CardContent>
      </Card>
    );
  };

  const TaskList = ({ date }) => {
    const dateTasks = tasks.filter(task => task.date === format(date, 'yyyy-MM-dd'));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks for {format(date, 'PP')}</CardTitle>
        </CardHeader>
        <CardContent>
          {dateTasks.map(task => (
            <div key={task.id} className="flex justify-between items-center mb-2">
              <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
              <div>
                <Button onClick={() => toggleTask(task.id)}>{task.completed ? 'Undo' : 'Done'}</Button>
                <Button onClick={() => deleteTask(task.id)} className="ml-2">Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const PlantCatalog = () => (
    <Card>
      <CardHeader>
        <CardTitle>My Plants</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for plant catalog */}
        <Button onClick={() => addPlant({ name: 'New Plant', notes: '', photo: '' })}>Add Plant</Button>
      </CardContent>
    </Card>
  );

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const taskCount = tasks.filter(task => task.date === format(date, 'yyyy-MM-dd')).length;
      return taskCount > 0 ? 'bg-green-100' : null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar" onClick={() => setActiveTab('calendar')}>Calendar</TabsTrigger>
          <TabsTrigger value="tasks" onClick={() => setActiveTab('tasks')}>Tasks</TabsTrigger>
          <TabsTrigger value="plants" onClick={() => setActiveTab('plants')}>Plants</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            tileClassName={tileClassName}
            onClickDay={(value) => setSelectedDate(value)}
          />
          <TaskList date={selectedDate} />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskForm />
          <div className="mt-4">
            {tasks.map(task => (
              <TaskList key={task.id} date={new Date(task.date)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="plants">
          <PlantCatalog />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;