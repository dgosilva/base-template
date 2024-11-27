import React, { useState, useEffect } from 'react';
// import { 
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
//   Button, Dialog, DialogContent, DialogHeader, DialogTrigger,
//   Input, Checkbox, Label
// } from "@/components/ui";

const API_URL = 'mockapi.io/recipes'; // Placeholder for actual API

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ made: false, notMade: false, favorite: false });
  const [openDialog, setOpenDialog] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setRecipes(data));
  }, []);

  const filteredRecipes = recipes.filter(recipe => 
    (recipe.name.toLowerCase().includes(search.toLowerCase()) || 
     recipe.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase()))) &&
    ((filter.made && recipe.made) || (filter.notMade && !recipe.made) || (filter.favorite && recipe.favorite) || (!filter.made && !filter.notMade && !filter.favorite))
  );

  const toggleMade = (id) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, made: !r.made } : r));
  };

  const toggleFavorite = (id) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Input 
        placeholder="Search by name or ingredient"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="flex mb-4 space-x-2">
        {['made', 'notMade', 'favorite'].map((key) => (
          <Label key={key}>
            <Checkbox 
              checked={filter[key]}
              onCheckedChange={() => setFilter({...filter, [key]: !filter[key]})}
            /> {key}
          </Label>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredRecipes.map(recipe => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription>{recipe.cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setOpenDialog(recipe)}>Shopping List</Button>
              <div>
                <Checkbox checked={recipe.made} onChange={() => toggleMade(recipe.id)} /> Made
                <Checkbox checked={recipe.favorite} onChange={() => toggleFavorite(recipe.id)} className="ml-2" /> Favorite
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {openDialog && (
        <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader title="Shopping List" />
            <ul>
              {openDialog.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
            </ul>
            <Button onClick={() => copyToClipboard(openDialog.ingredients.join('\n'))}>Copy to Clipboard</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default App;