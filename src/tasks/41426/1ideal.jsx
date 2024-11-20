import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LikeDislikeComponent = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  //receives onSelect so that the parent component can have access to the changes
  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Rate this content</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center space-x-4">
        <Button
          onClick={() => handleSelect("like")}
          variant={selected === "like" ? "default" : "outline"}
          className="w-24"
        >
          👍 Like
        </Button>
        <Button
          onClick={() => handleSelect("dislike")}
          variant={selected === "dislike" ? "default" : "outline"}
          className="w-24"
        >
          👎 Dislike
        </Button>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Like/Dislike Component Demo</h1>
      <LikeDislikeComponent onSelect={handleSelection} />
      {selectedOption && (
        <p className="mt-4 text-lg">
          You selected: <strong>{selectedOption}</strong>
        </p>
      )}
    </div>
  );
}