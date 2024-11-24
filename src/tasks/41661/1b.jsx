import React, { useState, useEffect } from 'react';
import { Input, Button, Modal, List, ListItem, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const ingredientsList = [
  "chicken", "beef", "pork", "rice", "noodles", "tomato", "onion", "garlic", "spinach", "cheese"
];

const dishes = {
  "chicken": ["Chicken Curry", "Grilled Chicken Salad"],
  "beef": ["Beef Stir Fry", "Beef Stew"],
  // Add more ingredients and dishes as needed
};

function IngredientAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    if (inputValue) {
      const filteredSuggestions = ingredientsList.filter(ing =>
        ing.includes(inputValue.toLowerCase()) && !selectedIngredients.includes(ing)
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, selectedIngredients]);

  const addIngredient = (ingredient) => {
    setSelectedIngredients(prev => [...prev, ingredient]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col space-y-2">
      <Input 
        value={inputValue} 
        onChange={e => setInputValue(e.target.value)} 
        placeholder="Type an ingredient..."
      />
      <div className="border p-2 space-y-1 max-h-40 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <div key={index} onClick={() => addIngredient(suggestion)} className="cursor-pointer hover:bg-gray-100 p-1">
            {suggestion}
          </div>
        ))}
      </div>
      <div>
        {selectedIngredients.map((ing, idx) => (
          <span key={idx} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {ing} <span onClick={() => setSelectedIngredients(selectedIngredients.filter(i => i !== ing))} className="cursor-pointer ml-1">×</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DishList({ ingredients }) {
  const [open, setOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);

  const possibleDishes = ingredients.flatMap(ingredient => dishes[ingredient] || []);

  return (
    <div className="mt-4 space-y-4">
      {possibleDishes.map((dish, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{dish}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => { setCurrentDish(dish); setOpen(true); }}>View Shopping List</Button>
          </CardContent>
        </Card>
      ))}
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Shopping List for {currentDish}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <List>
              <ListItem>Ingredient 1</ListItem>
              <ListItem>Ingredient 2</ListItem>
              {/* Here you would dynamically list ingredients needed for the dish */}
            </List>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">What Can I Cook?</h1>
      <IngredientAutocomplete selectedIngredients={selectedIngredients} setSelectedIngredients={setSelectedIngredients} />
      {selectedIngredients.length > 0 && (
        <DishList ingredients={selectedIngredients} />
      )}
    </div>
  );
}