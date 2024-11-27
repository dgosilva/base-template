import React, { useState, useMemo } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  Input, 
  Select, 
  SelectItem,
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState(['Food', 'Transport', 'Housing', 'Entertainment']);
  const [isExtractOpen, setIsExtractOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  const totalIncome = useMemo(() => 
    entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.value, 0), 
    [entries]
  );

  const totalExpenses = useMemo(() => 
    entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.value, 0), 
    [entries]
  );

  const balance = totalIncome - totalExpenses;

  const addEntry = (entry) => setEntries(prev => [...prev, { id: Date.now(), ...entry }]);
  const removeEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateEntry = (updatedEntry) => setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));

  const addCategory = (newCategory) => setCategories(prev => [...prev, newCategory]);

  const generateExtract = () => {
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => (
      <div key={entry.id}>
        {entry.date} - {entry.type === 'expense' ? 'Spent' : 'Earned'} {entry.value} on {entry.category}: {entry.description}
      </div>
    ));
  };

  const categorySpending = useMemo(() => {
    return categories.map(cat => ({
      category: cat,
      total: entries.filter(e => e.category === cat && e.type === 'expense').reduce((sum, e) => sum + e.value, 0)
    }));
  }, [entries, categories]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-green-500 font-bold">Total Income: ${totalIncome.toFixed(2)}</div>
            <div className="text-red-500 font-bold">Total Expenses: ${totalExpenses.toFixed(2)}</div>
            <div className={`font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>Balance: ${balance.toFixed(2)}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsExtractOpen(true)}>Generate Extract</Button>
            <Button onClick={() => setIsOverviewOpen(true)}>Category Overview</Button>
          </div>
        </CardContent>
      </Card>
      <EntryForm 
        addEntry={addEntry} 
        categories={['salary', 'extra', ...categories]} 
        addCategory={addCategory} 
      />
      <EntryList entries={entries} removeEntry={removeEntry} updateEntry={updateEntry} />
      
      <Dialog open={isExtractOpen} onOpenChange={setIsExtractOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expenses Extract</DialogTitle>
          </DialogHeader>
          <div>{generateExtract()}</div>
          <DialogFooter>
            <Button onClick={() => navigator.clipboard.writeText(generateExtract().map(e => e.props.children).join('\n'))}>Copy to Clipboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Category Overview</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorySpending.map(cat => (
                <TableRow key={cat.category}>
                  <TableCell>{cat.category}</TableCell>
                  <TableCell>${cat.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button onClick={() => navigator.clipboard.writeText(categorySpending.map(cat => `${cat.category}: $${cat.total.toFixed(2)}`).join('\n'))}>Copy to Clipboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EntryForm({ addEntry, categories, addCategory }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const submitEntry = () => {
    if (value && description && category) {
      addEntry({
        type, 
        category, 
        description, 
        value: parseFloat(value), 
        date: new Date().toISOString()
      });
      setDescription('');
      setValue('');
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{type === 'expense' ? 'Add Expense' : 'Add Income'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setType}>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
        </Select>
        {type === 'expense' && (
          <Input 
            type="text" 
            placeholder="New Category" 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)} 
            onBlur={() => {
              if (newCategory && !categories.includes(newCategory)) {
                addCategory(newCategory);
                setCategory(newCategory);
                setNewCategory('');
              }
            }}
          />
        )}
        <Input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <Input 
          type="number" 
          placeholder="Value" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
        />
        <Button onClick={submitEntry}>Add</Button>
      </CardContent>
    </Card>
  );
}

function EntryList({ entries, removeEntry, updateEntry }) {
  return (
    <div className="mt-4">
      {entries.map(entry => (
        <EntryItem 
          key={entry.id} 
          entry={entry} 
          onDelete={removeEntry} 
          onUpdate={updateEntry} 
        />
      ))}
    </div>
  );
}

function EntryItem({ entry, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(entry.description);
  const [value, setValue] = useState(entry.value);

  const saveEdit = () => {
    onUpdate({ ...entry, description, value: parseFloat(value) });
    setIsEditing(false);
  };

  return (
    <Card className="mb-2">
      <CardContent>
        {isEditing ? (
          <>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            <Button onClick={saveEdit}>Save</Button>
          </>
        ) : (
          <>
            <div>{entry.category}: {entry.description} - ${entry.value}</div>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={() => onDelete(entry.id)} className="ml-2">Delete</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}