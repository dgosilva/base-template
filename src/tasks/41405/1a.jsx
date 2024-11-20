import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const DynamicInput = ({ isTextArea, ...props }) => {
  return isTextArea ? (
    <Textarea className="w-full" {...props} />
  ) : (
    <Input className="w-full" {...props} />
  );
};

export default function App() {
  const [isTextArea, setIsTextArea] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dynamic Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="input-type-switch" className="text-sm font-medium">
                Use Text Area
              </Label>
              <Switch
                id="input-type-switch"
                checked={isTextArea}
                onCheckedChange={setIsTextArea}
              />
            </div>
            <div>
              <Label htmlFor="dynamic-input" className="text-sm font-medium">
                {isTextArea ? "Text Area" : "Input"}
              </Label>
              <DynamicInput
                id="dynamic-input"
                isTextArea={isTextArea}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={isTextArea ? "Enter multiple lines..." : "Enter text..."}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <p className="text-sm bg-gray-200 p-2 rounded-md break-words">
                {inputValue || "No input yet"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}