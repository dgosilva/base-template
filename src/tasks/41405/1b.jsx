import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Switch } from "@/components/ui";

export default function App() {
  const [isTextArea, setIsTextArea] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleToggle = () => {
    setIsTextArea(!isTextArea);
    setInputValue(''); // Clear input when switching type
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Dynamic Input/TextArea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isTextArea} 
              onCheckedChange={handleToggle} 
              id="input-type"
            />
            <label htmlFor="input-type" className="text-sm font-medium">
              {isTextArea ? 'Use Text Area' : 'Use Input'}
            </label>
          </div>
          {isTextArea ? (
            <textarea 
              value={inputValue}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              rows="4"
              placeholder="Type something here..."
            />
          ) : (
            <input 
              type="text" 
              value={inputValue}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Type something here..."
            />
          )}
          <div className="text-sm text-gray-600">
            You've typed: <span className="font-semibold">{inputValue}</span>
          </div>
        </CardContent>
        <div className="p-4">
          <Button 
            onClick={() => setInputValue('')} 
            className="w-full"
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </Card>
    </div>
  );
}