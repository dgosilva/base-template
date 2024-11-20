import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  const [activeOption, setActiveOption] = useState(null);

  const MenuOption = ({ children, onClick, isActive }) => (
    <Button 
      variant={isActive ? "default" : "outline"} 
      onClick={onClick} 
      className="w-full mb-2 last:mb-0"
    >
      {children}
    </Button>
  );

  const handleOptionClick = (option) => {
    setActiveOption(option);
    // Here you would typically handle what happens when an option is selected
    console.log(`Selected: ${option}`);
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Game Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MenuOption onClick={() => handleOptionClick('New Game')} isActive={activeOption === 'New Game'}>
            New Game
          </MenuOption>
          <MenuOption onClick={() => handleOptionClick('Load Game')} isActive={activeOption === 'Load Game'}>
            Load Game
          </MenuOption>
          <MenuOption onClick={() => handleOptionClick('Settings')} isActive={activeOption === 'Settings'}>
            Settings
          </MenuOption>
        </CardContent>
      </Card>
    </div>
  );
}