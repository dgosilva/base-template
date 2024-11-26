import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function NoteCard({ note, onEdit, onDelete, onDetails }) {
  // Truncate content if it exceeds 20 characters
  const truncatedContent =
    note.content.length > 20 ? note.content.slice(0, 20) + "..." : note.content;

  return (
    <Card className="bg-yellow-100 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardHeader>
        <CardTitle
          className="text-lg font-semibold"
          onClick={() => onEdit(note)} // Edit note on title click
        >
          {note.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{truncatedContent}</p>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={() => onDetails(note)}>
            Details
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(note)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: note?.id, title, content }); // Pass note data to onSave function
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Note Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setEditingNote(null);
  };

  // Update an existing note while preserving its creation date
  const updateNote = (updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id
        ? {
            ...note, // Retain previous note details
            ...updatedNote, // Update title and content
            updatedAt: new Date().toISOString() // Update the last edited date
          }
        : note
    );
    setNotes(updatedNotes);
    setEditingNote(null);
  };

  const deleteNote = () => {
    const updatedNotes = notes.filter((note) => note.id !== noteToDelete.id);
    setNotes(updatedNotes);
    setIsDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const handleDelete = (note) => {
    setNoteToDelete(note);
    setIsDeleteDialogOpen(true);
  };

  const handleDetails = (note) => {
    setSelectedNote(note);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Note Taking App</h1>
      {editingNote ? (
        <NoteForm
          note={editingNote}
          onSave={editingNote.id ? updateNote : addNote}
          onCancel={() => setEditingNote(null)}
        />
      ) : (
        <Button onClick={() => setEditingNote({})}>Add New Note</Button>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDetails={handleDetails}
          />
        ))}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteNote}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Note Details</DialogTitle>
          </DialogHeader>
          {selectedNote && (
            <div>
              <p>Created: {new Date(selectedNote.createdAt).toLocaleString()}</p>
              <p>Last Edited: {new Date(selectedNote.updatedAt).toLocaleString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}