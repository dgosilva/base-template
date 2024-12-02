import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/card";

const initialPlaylists = [
  { id: 1, name: 'Rock Classics', songs: [{ title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock' }], sharedUrl: '' },
  { id: 2, name: 'Jazz Vibes', songs: [{ title: 'So What', artist: 'Miles Davis', genre: 'Jazz' }], sharedUrl: '' },
];

function App() {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const addPlaylist = (name) => {
    setPlaylists([...playlists, { id: Date.now(), name, songs: [], sharedUrl: '' }]);
  };

  const deletePlaylist = (id) => {
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  const addSongToPlaylist = (playlistId, song) => {
    const updatedPlaylists = playlists.map(p => 
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    );
    setPlaylists(updatedPlaylists);
  };

  const removeSongFromPlaylist = (playlistId, songIndex) => {
    const updatedPlaylists = playlists.map(p => 
      p.id === playlistId ? { ...p, songs: p.songs.filter((_, index) => index !== songIndex) } : p
    );
    setPlaylists(updatedPlaylists);
  };

  const sharePlaylist = (playlistId) => {
    const url = `${window.location.href}?playlist=${playlistId}`;
    navigator.clipboard.writeText(url).then(() => {
      setDialogOpen(true);
      const updatedPlaylists = playlists.map(p => 
        p.id === playlistId ? { ...p, sharedUrl: url } : p
      );
      setPlaylists(updatedPlaylists);
    });
  };

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    playlist.songs.some(song => song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Music Playlist Manager</h1>
      <Input 
        placeholder="Search playlists or songs..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredPlaylists.map(playlist => (
          <PlaylistCard 
            key={playlist.id} 
            playlist={playlist} 
            onDelete={deletePlaylist} 
            onAddSong={addSongToPlaylist} 
            onRemoveSong={removeSongFromPlaylist}
            onShare={sharePlaylist}
          />
        ))}
        <NewPlaylistCard onAdd={addPlaylist} />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>URL Copied!</DialogTitle>
            <DialogDescription>
              The playlist URL has been copied to your clipboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlaylistCard({ playlist, onDelete, onAddSong, onRemoveSong, onShare }) {
  const [newSong, setNewSong] = useState({ title: '', artist: '', genre: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(playlist.name);

  return (
    <Card>
      <CardHeader>
        {isEditing ? (
          <Input 
            value={editedName} 
            onChange={(e) => setEditedName(e.target.value)} 
            onBlur={() => {
              setIsEditing(false);
              // Here you would typically update the playlist name in state
            }}
            autoFocus
          />
        ) : (
          <CardTitle onClick={() => setIsEditing(true)}>{playlist.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <ul>
          {playlist.songs.map((song, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{song.title} - {song.artist}</span>
              <Button variant="destructive" size="icon" onClick={() => onRemoveSong(playlist.id, index)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </li>
          ))}
        </ul>
        <Input 
          placeholder="Add song title" 
          value={newSong.title} 
          onChange={(e) => setNewSong({...newSong, title: e.target.value})} 
          className="mt-2"
        />
        <Input 
          placeholder="Artist" 
          value={newSong.artist} 
          onChange={(e) => setNewSong({...newSong, artist: e.target.value})} 
          className="mt-2"
        />
        <Input 
          placeholder="Genre" 
          value={newSong.genre} 
          onChange={(e) => setNewSong({...newSong, genre: e.target.value})} 
          className="mt-2"
        />
        <Button onClick={() => {
          onAddSong(playlist.id, newSong);
          setNewSong({ title: '', artist: '', genre: '' });
        }} className="mt-2">
          Add Song
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onShare(playlist.id)}>Share</Button>
        <Button variant="destructive" onClick={() => onDelete(playlist.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function NewPlaylistCard({ onAdd }) {
  const [name, setName] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Playlist</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Playlist name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          if(name.trim()) {
            onAdd(name);
            setName('');
          }
        }}>Create</Button>
      </CardFooter>
    </Card>
  );
}

export default App;