import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Calendar({ tasks, onDayClick }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{`${monthNames[currentMonth]} ${currentYear}`}</h2>
        <div>
          <Button onClick={handlePrevMonth}>&lt;</Button>
          <Button onClick={handleNextMonth}>&gt;</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
        {days.map((day) => {
          const date = new Date(currentYear, currentMonth, day);
          const dayTasks = tasks.filter((task) => {
            const taskDate = new Date(task.date);
            return (
              taskDate.getFullYear() === date.getFullYear() &&
              taskDate.getMonth() === date.getMonth() &&
              taskDate.getDate() === date.getDate()
            );
          });
          const hasUncompletedTasks = dayTasks.some((task) => !task.completed);
          const hasCompletedTasks = dayTasks.some((task) => task.completed);

          return (
            <Button
              key={day}
              onClick={() => onDayClick(date)}
              className={`h-12 ${
                hasUncompletedTasks
                  ? "bg-yellow-200"
                  : hasCompletedTasks
                  ? "bg-green-200"
                  : ""
              }`}
            >
              {day}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function TaskManager({ tasks, onAddTask, onEditTask, onDeleteTask, onToggleTask }) {
  const [newTask, setNewTask] = useState({
    name: "",
    date: "",
    description: "",
    time: "",
    recurrence: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTask);
    setNewTask({ name: "", date: "", description: "", time: "", recurrence: "" });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          placeholder="Task name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          required
        />
        <Input
          type="date"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          required
        />
        <Textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <Input
          type="time"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
        />
        <Select
          value={newTask.recurrence}
          onValueChange={(value) => setNewTask({ ...newTask, recurrence: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Add Task</Button>
      </form>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleTask(task.id)}
            />
            <span className={task.completed ? "line-through" : ""}>{task.name}</span>
            <Button onClick={() => onEditTask(task.id)}>Edit</Button>
            <Button onClick={() => onDeleteTask(task.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlantCatalog() {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({ name: "", notes: "" });

  const handleAddPlant = (e) => {
    e.preventDefault();
    // TODO: Implement photo upload
    setPlants([...plants, { ...newPlant, id: Date.now() }]);
    setNewPlant({ name: "", notes: "" });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddPlant} className="space-y-2">
        <Input
          placeholder="Plant name"
          value={newPlant.name}
          onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
          required
        />
        <Textarea
          placeholder="Notes"
          value={newPlant.notes}
          onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
        />
        <Button type="submit">Add Plant</Button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <div key={plant.id} className="border p-4 rounded">
            <h3 className="font-bold">{plant.name}</h3>
            <p>{plant.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddTask = (newTask) => {
    // TODO: Implement persistence
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
  };

  const handleEditTask = (id) => {
    // TODO: Implement edit functionality
  };

  const handleDeleteTask = (id) => {
    // TODO: Implement persistence
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleTask = (id) => {
    // TODO: Implement persistence
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gardening Planner</h1>
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Calendar tasks={tasks} onDayClick={handleDayClick} />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4">View Selected Day</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "No date selected"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {selectedDate &&
                  tasks
                    .filter((task) => {
                      const taskDate = new Date(task.date);
                      return (
                        taskDate.getFullYear() === selectedDate.getFullYear() &&
                        taskDate.getMonth() === selectedDate.getMonth() &&
                        taskDate.getDate() === selectedDate.getDate()
                      );
                    })
                    .map((task) => (
                      <div key={task.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(task.id)}
                        />
                        <span className={task.completed ? "line-through" : ""}>
                          {task.name}
                        </span>
                      </div>
                    ))}
              </div>
              <Button
                onClick={() => {
                  // TODO: Implement navigation to task manager tab with date pre-filled
                }}
              >
                Add New Task
              </Button>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="tasks">
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        </TabsContent>
        <TabsContent value="plants">
          <PlantCatalog />
        </TabsContent>
      </Tabs>
    </div>
  );
}