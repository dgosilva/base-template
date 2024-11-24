import React, { useState, useEffect } from "react";
import { Command } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ingredients = [
  "Chicken", "Beef", "Pork", "Fish", "Eggs", "Milk", "Cheese", "Butter",
  "Flour", "Rice", "Pasta", "Tomatoes", "Onions", "Garlic", "Potatoes",
  "Carrots", "Broccoli", "Spinach", "Lettuce", "Bread", "Olive Oil"
];

const recipes = [
  {
    name: "Spaghetti Bolognese",
    ingredients: ["Beef", "Tomatoes", "Onions", "Garlic", "Pasta"],
    shoppingList: ["Parmesan cheese", "Fresh basil"]
  },
  {
    name: "Chicken Stir Fry",
    ingredients: ["Chicken", "Broccoli", "Carrots", "Garlic", "Rice"],
    shoppingList: ["Soy sauce", "Sesame oil"]
  },
  {
    name: "Vegetable Omelette",
    ingredients: ["Eggs", "Cheese", "Spinach", "Onions"],
    shoppingList: ["Bell peppers", "Mushrooms"]
  },
  {
    name: "Grilled Cheese Sandwich",
    ingredients: ["Bread", "Cheese", "Butter"],
    shoppingList: ["Tomato soup"]
  },
  {
    name: "Fish and Chips",
    ingredients: ["Fish", "Potatoes", "Flour"],
    shoppingList: ["Lemon", "Tartar sauce"]
  }
];

// Component for inputting ingredients
function IngredientInput({ selectedIngredients, setSelectedIngredients }) {
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]); // Add ingredient if not already selected
    }
    setInputValue(""); // Clear input field
  };

  return (
    <div className="w-full max-w-sm">
      <Command>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value on change
          placeholder="Search ingredients..."
          className="mb-2"
        />
        <ul className="max-h-48 overflow-y-auto">
          {ingredients
            .filter((ingredient) =>
              ingredient.toLowerCase().includes(inputValue.toLowerCase()) // Filter ingredients based on input
            )
            .map((ingredient) => (
              <li
                key={ingredient}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(ingredient)} // Handle ingredient selection
              >
                {ingredient}
              </li>
            ))}
        </ul>
      </Command>
    </div>
  );
}

function SelectedIngredients({ selectedIngredients, setSelectedIngredients }) {
  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {selectedIngredients.map((ingredient) => (
        <span
          key={ingredient}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
        >
          {ingredient}
          <button
            onClick={() => removeIngredient(ingredient)}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

function RecipeList({ selectedIngredients }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filter recipes that match all selected ingredients
  const matchingRecipes = recipes.filter((recipe) =>
    recipe.ingredients.every((ingredient) =>
      selectedIngredients.includes(ingredient)
    )
  );

  const handleShowShoppingList = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Possible Dishes</h2>
      {matchingRecipes.length === 0 ? (
        <p>No dishes found with the selected ingredients.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matchingRecipes.map((recipe) => (
            <Card key={recipe.name}>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleShowShoppingList(recipe)}>
                  Show Shopping List
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shopping List for {selectedRecipe?.name}</DialogTitle>
          </DialogHeader>
          <ul className="list-disc pl-5">
            {selectedRecipe?.shoppingList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Finder</h1>
      <IngredientInput
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients} // Pass state handlers to child components
      />
      <SelectedIngredients
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />
      <RecipeList selectedIngredients={selectedIngredients} />
    </div>
  );
}