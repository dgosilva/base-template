import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: [], status: 'todo' },
    { id: 'doing', title: 'Doing', tasks: [], status: 'doing' },
    { id: 'done', title: 'Done', tasks: [], status: 'done' }
  ]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = (columnId) => {
    if (!newTaskTitle.trim()) return;
    setColumns(columns.map(column => 
      column.id === columnId ? { ...column, tasks: [...column.tasks, { id: Date.now(), title: newTaskTitle, status: column.status }]} : column
    ));
    setNewTaskTitle('');
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(columns.map(column => 
      column.id === columnId ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId)} : column
    ));
  };

  const moveTask = (fromColumnId, toColumnId, taskId) => {
    const taskToMove = columns.find(col => col.id === fromColumnId).tasks.find(task => task.id === taskId);
    setColumns(columns.map(column => {
      if (column.id === fromColumnId) {
        return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
      } else if (column.id === toColumnId) {
        return { ...column, tasks: [...column.tasks, { ...taskToMove, status: column.status }] };
      }
      return column;
    }));
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn = { id: `col-${Date.now()}`, title: newColumnTitle, tasks: [], status: newColumnTitle.toLowerCase().replace(/ /g, '-') };
    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  const reorderColumns = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setColumns(items);
  }, [columns]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-5xl">
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className="flex flex-col sm:flex-row flex-grow space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.draggableProps} 
                      {...provided.dragHandleProps}
                      className="flex-grow"
                    >
                      <Card className="flex flex-col h-full">
                        <CardHeader>
                          <CardTitle>{column.title} <Button onClick={() => deleteColumn(column.id)} variant="destructive" size="sm">Delete</Button></CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          {column.tasks.map((task, taskIndex) => (
                            <div key={task.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                              <Checkbox checked={column.status === 'done'} onClick={() => moveTask(column.id, column.status === 'done' ? 'todo' : 'done', task.id)} />
                              <span className={column.status === 'done' ? 'line-through' : ''}>{task.title}</span>
                              <Button onClick={() => deleteTask(column.id, task.id)} variant="destructive" size="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </Button>
                            </div>
                          ))}
                          <Input 
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="New task"
                            className="mt-2"
                            onKeyPress={(e) => { if (e.key === 'Enter') addTask(column.id); }}
                          />
                          <Button onClick={() => addTask(column.id)} className="mt-2">Add Task</Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="flex space-x-2">
        <Input 
          value={newColumnTitle}
          onChange={e => setNewColumnTitle(e.target.value)}
          placeholder="New column name"
        />
        <Button onClick={addColumn}>Add Column</Button>
      </div>
    </div>
  );
}

export default App;