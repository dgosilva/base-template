import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ImageUploadWidget = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024) { // 50 KB in bytes
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Image must be 50 KB or smaller.');
      setImage(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }
    // Here you would typically send the image data, title, and subtitle to a server
    console.log('Image uploaded:', image, 'Title:', title, 'Subtitle:', subtitle);
    // Reset form
    setImage(null);
    setTitle('');
    setSubtitle('');
    setError('');
  };

  return (
    <Card className="sm:max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Image Upload Widget</CardTitle>
        <CardDescription>Upload an image with a title and subtitle.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label htmlFor="image">Image</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="mb-4"
            />
            {image && (
              <img 
                src={image} 
                alt="Uploaded preview" 
                className="mb-4 max-h-48 w-auto object-cover rounded"
              />
            )}
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter a title"
            />
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input 
              id="subtitle" 
              value={subtitle} 
              onChange={(e) => setSubtitle(e.target.value)} 
              placeholder="Enter a subtitle"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={!image}>Upload</Button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <ImageUploadWidget />
    </div>
  );
}