import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, addWeeks, addMonths, isSameDay } from "date-fns";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toIsoDateString(date) {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(23, 0, 0, 0); // Set time to 23:00 to mitigate timezone shift issues
  return adjustedDate.toISOString().split('T')[0];
}

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
          const dayTasks = tasks.filter((task) => isSameDay(new Date(task.date), date)); // Compare using isSameDay
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

function TaskManager({ tasks, onAddTask, onEditTask, onDeleteTask, onToggleTask, selectedDate, onDateChange }) {
  const [newTask, setNewTask] = useState({
    name: "",
    date: selectedDate ? toIsoDateString(selectedDate) : "", // Use utility function
    description: "",
    time: "",
    recurrence: "none",
  });

  useEffect(() => {
    if (selectedDate) {
      setNewTask((prevTask) => ({
        ...prevTask,
        date: toIsoDateString(selectedDate), // Use utility function
      }));
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setNewTask({ ...newTask, date: dateValue });
    const newSelectedDate = new Date(dateValue);
    onDateChange(newSelectedDate); // Update selectedDate in the parent component
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recurrenceTasks = generateRecurrenceTasks(newTask);
    
    // Add the original task and recurrence tasks
    onAddTask([
      { ...newTask, id: Date.now(), completed: false },
      ...recurrenceTasks.map((task, index) => ({
        ...task,
        id: Date.now() + index + 1 // Ensuring unique IDs
      }))
    ]);
  
    setNewTask({ name: "", date: "", description: "", time: "", recurrence: "none" });
  };

  // Generate additional tasks based on recurrence
  const generateRecurrenceTasks = (task) => {
    const tasks = [];
    let currentDate = new Date(task.date);

    if (task.recurrence === "daily") {
      for (let i = 1; i <= 30; i++) { // Example: Generate for 30 days
        currentDate = addDays(currentDate, 1);
        tasks.push({ ...task, date: toIsoDateString(currentDate) });
      }
    } else if (task.recurrence === "weekly") {
      for (let i = 1; i <= 12; i++) { // Example: Generate for 12 weeks
        currentDate = addWeeks(currentDate, 1);
        tasks.push({ ...task, date: toIsoDateString(currentDate) });
      }
    } else if (task.recurrence === "monthly") {
      for (let i = 1; i <= 12; i++) { // Example: Generate for 12 months
        currentDate = addMonths(currentDate, 1);
        tasks.push({ ...task, date: toIsoDateString(currentDate) });
      }
    }

    return tasks;
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
          onChange={handleDateChange} // Update selected date when changed
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
        <label className="block text-sm font-medium text-gray-700">Recurrence</label>
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
          <div key={task.id} className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
              />
              <span className={task.completed ? "line-through" : ""}>{task.name}</span>
              {task.recurrence !== "none" && (
                <span className="text-xs text-gray-500">
                  ({task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1)})
                </span>
              )}
            </div>
            <div>
              <Button onClick={() => onEditTask(task.id)}>Edit</Button>
              <Button onClick={() => onDeleteTask(task.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlantCatalog() {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({ name: "", notes: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddPlant = (e) => {
    e.preventDefault();
    // Handle the image upload logic here
    // Simulating a plant addition
    setPlants([...plants, { ...newPlant, id: Date.now() }]);
    setNewPlant({ name: "", notes: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPlant({ ...newPlant, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-gray-100 file:text-gray-700
          hover:file:bg-gray-200"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Plant Preview"
            className="mt-2 w-full h-auto rounded"
          />
        )}
        <Button type="submit">Add Plant</Button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <div key={plant.id} className="border p-4 rounded">
            <h3 className="font-bold">{plant.name}</h3>
            <p>{plant.notes}</p>
            {plant.image && (
              <img
                src={URL.createObjectURL(plant.image)}
                alt={plant.name}
                className="mt-2 w-full h-auto rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = (newTasks) => {
    // Add new tasks to the state
    setTasks((prevTasks) => [...prevTasks, ...newTasks]);
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
    setIsDialogOpen(true);
  };

  const handleAddNewTaskClick = () => {
    setActiveTab("tasks");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gardening Planner</h1>
      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Calendar tasks={tasks} onDayClick={handleDayClick} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    .filter((task) => isSameDay(new Date(task.date), selectedDate))
                    .map((task) => (
                      <div key={task.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(task.id)}
                        />
                        <span className={task.completed ? "line-through" : ""}>
                          {task.name}
                        </span>
                        {task.recurrence !== "none" && (
                          <span className="text-xs text-gray-500">
                            ({task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1)})
                          </span>
                        )}
                      </div>
                    ))}
              </div>
              <Button onClick={handleAddNewTaskClick}>
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
            selectedDate={selectedDate} // Pass the selected date to TaskManager
            onDateChange={setSelectedDate} // Update date from TaskManager
          />
        </TabsContent>
        <TabsContent value="plants">
          <PlantCatalog />
        </TabsContent>
      </Tabs>
    </div>
  );
}