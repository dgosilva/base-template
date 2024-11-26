import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [open, setOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (currentNote.title.trim() || currentNote.content.trim()) {
      const newNote = {
        ...currentNote,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes([...notes, newNote]);
      setCurrentNote({ id: null, title: '', content: '' });
    }
  };

  const updateNote = () => {
    setNotes(notes.map(note => 
      note.id === currentNote.id ? { ...note, ...currentNote, updatedAt: new Date() } : note
    ));
    setOpen(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Note Taking App</h1>
        <Card>
          <CardHeader>
            <CardTitle>Add Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={currentNote.title} 
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} 
              placeholder="Title" 
              className="mb-2"
            />
            <Textarea 
              value={currentNote.content} 
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})} 
              placeholder="Content"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={addNote}>Add Note</Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {notes.map((note) => (
            <Card key={note.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader onClick={() => {setCurrentNote(note); setOpen(true);}}>
                <CardTitle>{note.title || 'Untitled'}</CardTitle>
                <CardDescription>
                  {note.content.length > 20 ? note.content.substring(0, 20) + "..." : note.content}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Button size="sm" onClick={() => {setCurrentNote(note); setOpen(true);}}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(note.id)}>Delete</Button>
                <Button size="sm" onClick={() => alert(`Created: ${format(note.createdAt, 'PPpp')}\nUpdated: ${format(note.updatedAt, 'PPpp')}`)}>
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <Input 
              value={currentNote.title} 
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} 
              placeholder="Title" 
              className="mb-2"
            />
            <Textarea 
              value={currentNote.content} 
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})} 
              placeholder="Content"
            />
            <DialogFooter>
              <Button onClick={updateNote}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete this note?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => deleteNote(deleteId)}>Confirm</Button>
              <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;