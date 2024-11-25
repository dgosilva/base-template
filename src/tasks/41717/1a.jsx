import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialColumns = [
  { id: 1, name: "To do", status: "todo" },
  { id: 2, name: "Doing", status: "doing" },
  { id: 3, name: "Done", status: "done" },
];

export default function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newColumnName, setNewColumnName] = useState("");

  useEffect(() => {
    const storedColumns = localStorage.getItem("columns");
    const storedTasks = localStorage.getItem("tasks");
    if (storedColumns) setColumns(JSON.parse(storedColumns));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [columns, tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, status: columns[0].status }]);
      setNewTask("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  const addColumn = () => {
    if (newColumnName.trim() !== "") {
      const newColumn = {
        id: Date.now(),
        name: newColumnName,
        status: newColumnName.toLowerCase().replace(/\s+/g, "-"),
      };
      setColumns([...columns, newColumn]);
      setNewColumnName("");
    }
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((column) => column.id !== columnId));
    setTasks(tasks.filter((task) => task.status !== columns.find((col) => col.id === columnId).status));
  };

  const moveColumn = (columnId, direction) => {
    const index = columns.findIndex((column) => column.id === columnId);
    if ((direction === "left" && index > 0) || (direction === "right" && index < columns.length - 1)) {
      const newColumns = [...columns];
      const temp = newColumns[index];
      newColumns[index] = newColumns[index + (direction === "left" ? -1 : 1)];
      newColumns[index + (direction === "left" ? -1 : 1)] = temp;
      setColumns(newColumns);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Management App</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="flex-grow"
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="New column name"
          className="flex-grow"
        />
        <Button onClick={addColumn}>Add Column</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Card key={column.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{column.name}</CardTitle>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => moveColumn(column.id, "left")}>
                  ←
                </Button>
                <Button size="sm" variant="outline" onClick={() => moveColumn(column.id, "right")}>
                  →
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteColumn(column.id)}>
                  X
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <div key={task.id} className="mb-2 p-2 bg-gray-100 rounded flex justify-between items-center">
                    <span>{task.text}</span>
                    <div className="flex gap-1">
                      <Select
                        value={task.status}
                        onValueChange={(value) => updateTaskStatus(task.id, value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((col) => (
                            <SelectItem key={col.id} value={col.status}>
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                        X
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}