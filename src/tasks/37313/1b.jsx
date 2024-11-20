import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const MenuButton = ({ children, onClick }) => (
  <Button
    className="w-full text-lg font-semibold py-6 mb-4"
    variant="outline"
    onClick={onClick}
  >
    {children}
  </Button>
);

const NewGameDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <MenuButton>New Game</MenuButton>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Start New Game</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="difficulty" className="text-right">
            Difficulty
          </Label>
          <Select defaultValue="normal">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={() => console.log("Starting new game...")}>
        Start Game
      </Button>
    </DialogContent>
  </Dialog>
);

const LoadGameDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <MenuButton>Load Game</MenuButton>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Load Game</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="savegame" className="text-right">
            Save Game
          </Label>
          <Select defaultValue="save1">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select save game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="save1">Save 1</SelectItem>
              <SelectItem value="save2">Save 2</SelectItem>
              <SelectItem value="save3">Save 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={() => console.log("Loading game...")}>Load Game</Button>
    </DialogContent>
  </Dialog>
);

const SettingsDialog = () => {
  const [volume, setVolume] = React.useState(50);
  const [fullscreen, setFullscreen] = React.useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MenuButton>Settings</MenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume" className="text-right">
              Volume
            </Label>
            <Slider
              id="volume"
              max={100}
              defaultValue={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullscreen" className="text-right">
              Fullscreen
            </Label>
            <Switch
              id="fullscreen"
              checked={fullscreen}
              onCheckedChange={setFullscreen}
            />
          </div>
        </div>
        <Button onClick={() => console.log("Saving settings...")}>
          Save Settings
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-6">
            Game Title
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewGameDialog />
          <LoadGameDialog />
          <SettingsDialog />
        </CardContent>
      </Card>
    </div>
  );
}