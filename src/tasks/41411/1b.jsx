import React, { useState } from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function StatusDropdown({ initialStatus = "Not started", onSelect }) {
  const [status, setStatus] = useState(initialStatus);

  const handleSelect = (newStatus) => {
    setStatus(newStatus);
    onSelect(newStatus);
  };

  const statusColors = {
    "Not started": "text-gray-500",
    "In progress": "text-blue-500",
    "Completed": "text-green-500",
    "Deleted": "text-red-500",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`${statusColors[status]} sm:w-40`}>
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Lesson Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(statusColors).map(([key, value]) => (
          <DropdownMenuItem 
            key={key} 
            onClick={() => handleSelect(key)}
            className={`${key === status ? 'font-bold ' + value : ''} cursor-pointer hover:text-black sm:px-4`}
          >
            {key}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function App() {
  const [currentStatus, setCurrentStatus] = useState("Not started");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="sm:max-w-sm w-full p-4">
        <h1 className="text-2xl font-bold mb-4 sm:text-center">Lesson Status</h1>
        <StatusDropdown 
          initialStatus={currentStatus} 
          onSelect={setCurrentStatus} 
        />
        <p className="mt-4 text-center text-lg sm:text-xl">
          Current Status: <span className={`font-semibold ${currentStatus === "Deleted" ? 'text-red-500' : ''}`}>{currentStatus}</span>
        </p>
      </div>
    </div>
  );
}