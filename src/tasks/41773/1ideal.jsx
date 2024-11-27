import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialExpenseCategories = ["Food", "Transportation", "Entertainment", "Utilities"];
const incomeCategories = ["Salary", "Extra"];

export default function App() {
  // State for storing entries, expense categories, new category input, and currently editing entry
  const [entries, setEntries] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState(initialExpenseCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);

  // State for form inputs
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");

  // Recalculate totals whenever entries change
  useEffect(() => {
    calculateTotals();
  }, [entries]);

  // State for financial calculations
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  // Calculate total expenses, income, and balance
  const calculateTotals = () => {
    const expenses = entries.filter(entry => !incomeCategories.includes(entry.category));
    const income = entries.filter(entry => incomeCategories.includes(entry.category));
    
    const totalExp = expenses.reduce((sum, entry) => sum + parseFloat(entry.value), 0);
    const totalInc = income.reduce((sum, entry) => sum + parseFloat(entry.value), 0);
    
    setTotalExpenses(totalExp);
    setTotalIncome(totalInc);
    setBalance(totalInc - totalExp);
  };

  const addEntry = () => {
    if (category && description && value) {
      const newEntry = {
        id: Date.now(),
        category,
        description,
        value: parseFloat(value),
        date: new Date().toISOString(),
      };
      setEntries([...entries, newEntry]);
      setCategory("");
      setDescription("");
      setValue("");
    }
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Set an entry for editing
  const editEntry = (entry) => {
    setEditingEntry(entry);
    setCategory(entry.category);
    setDescription(entry.description);
    setValue(entry.value.toString());
  };

  const updateEntry = () => {
    if (editingEntry && category && description && value) {
      const updatedEntries = entries.map(entry =>
        entry.id === editingEntry.id ? { ...entry, category, description, value: parseFloat(value) } : entry
      );
      setEntries(updatedEntries);
      setEditingEntry(null);
      setCategory("");
      setDescription("");
      setValue("");
    }
  };

  const addExpenseCategory = () => {
    if (newCategory && !expenseCategories.includes(newCategory)) {
      setExpenseCategories([...expenseCategories, newCategory]);
      setNewCategory("");
    }
  };

  const removeExpenseCategory = (categoryToRemove) => {
    setExpenseCategories(expenseCategories.filter(category => category !== categoryToRemove));
  };

  // Generate a text-based extract of all entries sorted by date
  const generateExtract = () => {
    return entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(entry => `${new Date(entry.date).toLocaleString()}: ${entry.category} - ${entry.description} - $${entry.value.toFixed(2)}`)
      .join("\n");
  };

  // Generate an overview of total spending per category
  const generateOverview = () => {
    const overview = {};
    entries.forEach(entry => {
      if (!overview[entry.category]) {
        overview[entry.category] = 0;
      }
      overview[entry.category] += entry.value;
    });
    return Object.entries(overview)
      .map(([category, total]) => `${category}: $${total.toFixed(2)}`)
      .join("\n");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      {/* Card for adding new entries */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Select for category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.concat(expenseCategories).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Input for description */}
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/* Input for value */}
            <Input
              type="number"
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {/* Button to add or update entry */}
            <Button onClick={editingEntry ? updateEntry : addEntry}>
              {editingEntry ? "Update" : "Add"} Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card for adding new expense categories */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Expense Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={addExpenseCategory}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* Card displaying current expense categories */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {expenseCategories.map(category => (
              <li key={category} className="flex justify-between items-center mb-2">
                {category}
                <Button variant="destructive" size="sm" onClick={() => removeExpenseCategory(category)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Card displaying all entries */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {entries.map(entry => (
              <li key={entry.id} className="flex justify-between items-center mb-2">
                {entry.category} - {entry.description} - ${entry.value.toFixed(2)}
                <div>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => editEntry(entry)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => removeEntry(entry.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Card displaying totals and balance */}
      <Card className="mb-4">
        <CardContent>
          <p className="text-green-500">Total Income: ${totalIncome.toFixed(2)}</p>
          <p className="text-red-500">Total Expenses: ${totalExpenses.toFixed(2)}</p>
          <p className={balance >= 0 ? "text-green-500" : "text-red-500"}>
            Balance: ${balance.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Dialogs for extract and overview */}
      <div className="flex space-x-2">
        {/* Dialog for generating extracts */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Generate Extract</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Extract</DialogTitle>
            </DialogHeader>
            <pre className="whitespace-pre-wrap">{generateExtract()}</pre>
            <Button onClick={() => copyToClipboard(generateExtract())}>Copy to Clipboard</Button>
          </DialogContent>
        </Dialog>

        {/* Dialog for category overview */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Overview</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Overview</DialogTitle>
            </DialogHeader>
            <pre className="whitespace-pre-wrap">{generateOverview()}</pre>
            <Button onClick={() => copyToClipboard(generateOverview())}>Copy to Clipboard</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}