import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusOptions = [
  { value: "not-started", label: "Not started", color: "bg-gray-200" },
  { value: "in-progress", label: "In progress", color: "bg-yellow-200" },
  { value: "completed", label: "Completed", color: "bg-green-200" },
  { value: "deleted", label: "Deleted", color: "bg-red-200" },
];

const StatusDropdown = ({ onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0].value);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    onStatusChange(value);
  };

  return (
    <Select value={selectedStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder="Select lesson status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={`${option.color} hover:${option.color} focus:${option.color}`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const LessonCard = ({ lesson, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <StatusDropdown onStatusChange={(status) => onStatusChange(lesson.id, status)} />
    </div>
  );
};

export default function App() {
  const [lessons, setLessons] = useState([
    { id: 1, title: "Introduction to React", description: "Learn the basics of React", status: "not-started" },
    { id: 2, title: "State and Props", description: "Understanding state and props in React", status: "in-progress" },
    { id: 3, title: "Hooks", description: "Exploring React Hooks", status: "completed" },
  ]);

  const handleStatusChange = (lessonId, newStatus) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, status: newStatus } : lesson
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lesson Status Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}