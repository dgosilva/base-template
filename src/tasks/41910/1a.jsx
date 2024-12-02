import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialPlaylists = [
  {
    id: 1,
    name: "Rock Classics",
    songs: [
      { id: 1, title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "Rock" },
      { id: 2, title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
    ],
  },
  {
    id: 2,
    name: "Pop Hits",
    songs: [
      { id: 3, title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
      { id: 4, title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
    ],
  },
];

const allSongs = [
  { id: 1, title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "Rock" },
  { id: 2, title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
  { id: 3, title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
  { id: 4, title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
  { id: 5, title: "Billie Jean", artist: "Michael Jackson", genre: "Pop" },
  { id: 6, title: "Sweet Child O' Mine", artist: "Guns N' Roses", genre: "Rock" },
];

function PlaylistCard({ playlist, onEdit, onDelete, onShare }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{playlist.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{playlist.songs.length} songs</p>
        <div className="mt-2">
          <Button onClick={() => onEdit(playlist)} className="mr-2">
            Edit
          </Button>
          <Button onClick={() => onDelete(playlist.id)} variant="destructive" className="mr-2">
            Delete
          </Button>
          <Button onClick={() => onShare(playlist)} variant="outline">
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PlaylistForm({ playlist, onSave, onCancel }) {
  const [name, setName] = useState(playlist ? playlist.name : "");
  const [songs, setSongs] = useState(playlist ? playlist.songs : []);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddSong = (song) => {
    if (!songs.find((s) => s.id === song.id)) {
      setSongs([...songs, song]);
    }
  };

  const handleRemoveSong = (songId) => {
    setSongs(songs.filter((s) => s.id !== songId));
  };

  const filteredSongs = allSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist Name"
        className="mb-4"
      />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search songs"
        className="mb-4"
      />
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Available Songs:</h3>
        {filteredSongs.map((song) => (
          <Button
            key={song.id}
            onClick={() => handleAddSong(song)}
            variant="outline"
            className="mr-2 mb-2"
          >
            {song.title} - {song.artist}
          </Button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Playlist Songs:</h3>
        {songs.map((song) => (
          <Button
            key={song.id}
            onClick={() => handleRemoveSong(song.id)}
            variant="secondary"
            className="mr-2 mb-2"
          >
            {song.title} - {song.artist} (Remove)
          </Button>
        ))}
      </div>
      <Button onClick={() => onSave({ name, songs })} className="mr-2">
        Save
      </Button>
      <Button onClick={onCancel} variant="outline">
        Cancel
      </Button>
    </div>
  );
}

export default function App() {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("");

  const handleCreatePlaylist = () => {
    setEditingPlaylist({ name: "", songs: [] });
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
  };

  const handleSavePlaylist = (playlist) => {
    if (editingPlaylist.id) {
      setPlaylists(
        playlists.map((p) => (p.id === editingPlaylist.id ? { ...playlist, id: p.id } : p))
      );
    } else {
      setPlaylists([...playlists, { ...playlist, id: Date.now() }]);
    }
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = (id) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  const handleSharePlaylist = (playlist) => {
    const url = `https://example.com/playlist/${playlist.id}`;
    setSharedUrl(url);
    navigator.clipboard.writeText(url);
    setIsShareDialogOpen(true);
  };

  const sortedAndFilteredPlaylists = playlists
    .filter((playlist) => {
      if (!filterBy) return true;
      return playlist.songs.some(
        (song) => song.genre.toLowerCase() === filterBy.toLowerCase() ||
                  song.artist.toLowerCase() === filterBy.toLowerCase()
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "songs") {
        return b.songs.length - a.songs.length;
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Music Playlist Manager</h1>
      <div className="mb-4">
        <Button onClick={handleCreatePlaylist}>Create New Playlist</Button>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row">
        <Select onValueChange={setSortBy} defaultValue={sortBy} className="mb-2 sm:mb-0 sm:mr-2">
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="songs">Number of Songs</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by genre or artist"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="flex-grow"
        />
      </div>
      {sortedAndFilteredPlaylists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onEdit={handleEditPlaylist}
          onDelete={handleDeletePlaylist}
          onShare={handleSharePlaylist}
        />
      ))}
      {editingPlaylist && (
        <Dialog open={!!editingPlaylist} onOpenChange={() => setEditingPlaylist(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPlaylist.id ? "Edit Playlist" : "Create Playlist"}</DialogTitle>
            </DialogHeader>
            <PlaylistForm
              playlist={editingPlaylist}
              onSave={handleSavePlaylist}
              onCancel={() => setEditingPlaylist(null)}
            />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Playlist Shared</DialogTitle>
          </DialogHeader>
          <p>The playlist URL has been copied to your clipboard:</p>
          <p className="font-semibold">{sharedUrl}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}