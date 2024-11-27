import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define an object to store filter statuses
const STATUSES = {
    ALL: "all",
    COOKED: "cooked",
    NOT_COOKED: "notCooked",
    FAVORITES: "favorites"
  };
  
// Mock data representing recipes
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

  // Function to copy ingredients to clipboard
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
        {/* Checkbox to toggle favorite status */}
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id={`favorite-${recipe.id}`}
            checked={recipe.isFavorite}
            onCheckedChange={() => onToggleFavorite(recipe.id)}
          />
          <Label htmlFor={`favorite-${recipe.id}`}>Favorite</Label>
        </div>
        {/* Checkbox to toggle cooked status */}
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id={`cooked-${recipe.id}`}
            checked={recipe.isCooked}
            onCheckedChange={() => onToggleCooked(recipe.id)}
          />
          <Label htmlFor={`cooked-${recipe.id}`}>Cooked</Label>
        </div>
        {/* Dialog for shopping list */}
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
            {/* Button to copy ingredients */}
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
    // Update search term based on user input
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

  // Filter recipes based on search term and selected filter
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm)
    );
    
    switch (filter) {
      case STATUSES.COOKED:
        return matchesSearch && recipe.isCooked;
      case STATUSES.NOT_COOKED:
        return matchesSearch && !recipe.isCooked;
      case STATUSES.FAVORITES:
        return matchesSearch && recipe.isFavorite;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Finder</h1>
      <div className="mb-4">
        {/* Input field for searching recipes by ingredient */}
        <Input
          type="text"
          placeholder="Search by ingredient"
          onChange={handleSearch}
          className="mb-2"
        />
        {/* Dropdown to select filter criteria */}
        <Select onValueChange={setFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter recipes" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value={STATUSES.ALL}>All Recipes</SelectItem>
            <SelectItem value={STATUSES.COOKED}>Cooked</SelectItem>
            <SelectItem value={STATUSES.NOT_COOKED}>Not Cooked</SelectItem>
            <SelectItem value={STATUSES.FAVORITES}>Favorites</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Display filtered recipes */}
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