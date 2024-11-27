import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockRecipes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    ingredients: ["spaghetti", "eggs", "bacon", "parmesan cheese"],
    instructions: "1. Cook pasta. 2. Fry bacon. 3. Mix eggs and cheese. 4. Combine all ingredients.",
    isFavorite: false,
    isCooked: false,
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    ingredients: ["chicken", "vegetables", "soy sauce", "rice"],
    instructions: "1. Cook rice. 2. Stir fry chicken and vegetables. 3. Add soy sauce. 4. Serve over rice.",
    isFavorite: false,
    isCooked: false,
  },
];

function RecipeCard({ recipe, onToggleFavorite, onToggleCooked }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(recipe.ingredients.join(", "));
  };

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>
          Ingredients: {recipe.ingredients.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{recipe.instructions}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id={`favorite-${recipe.id}`}
            checked={recipe.isFavorite}
            onCheckedChange={() => onToggleFavorite(recipe.id)}
          />
          <Label htmlFor={`favorite-${recipe.id}`}>Favorite</Label>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id={`cooked-${recipe.id}`}
            checked={recipe.isCooked}
            onCheckedChange={() => onToggleCooked(recipe.id)}
          />
          <Label htmlFor={`cooked-${recipe.id}`}>Cooked</Label>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Shopping List</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shopping List for {recipe.name}</DialogTitle>
            </DialogHeader>
            <ul className="list-disc pl-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleFavorite = (id) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
  };

  const toggleCooked = (id) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, isCooked: !recipe.isCooked } : recipe
    ));
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm)
    );
    
    switch (filter) {
      case "cooked":
        return matchesSearch && recipe.isCooked;
      case "notCooked":
        return matchesSearch && !recipe.isCooked;
      case "favorites":
        return matchesSearch && recipe.isFavorite;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Finder</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by ingredient"
          onChange={handleSearch}
          className="mb-2"
        />
        <Select onValueChange={setFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter recipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recipes</SelectItem>
            <SelectItem value="cooked">Cooked</SelectItem>
            <SelectItem value="notCooked">Not Cooked</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onToggleFavorite={toggleFavorite}
            onToggleCooked={toggleCooked}
          />
        ))}
      </div>
    </div>
  );
}