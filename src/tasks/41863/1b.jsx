import React, { useState, useEffect } from 'react';
// import { Input, Button, Dialog, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock movie data
const mockMovies = [
  { id: 1, title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 4.5, reviews: [{user: 'Chris', comment: 'Mind bending!'}] },
  { id: 2, title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 5, reviews: [{user: 'NolanFan', comment: 'Best Batman ever!'}] },
  // ... Add 8 more movies here for brevity
];

const Rating = ({ value }) => {
  const stars = '⭐'.repeat(Math.floor(value)) + (value % 1 !== 0 ? '✨' : '');
  return <span>{stars}</span>;
};

const MovieCard = ({ movie, onSelect }) => (
  <Card className="mb-4 sm:mx-2 w-full sm:w-64" onClick={() => onSelect(movie)}>
    <CardHeader>
      <CardTitle>{movie.title}</CardTitle>
      <CardDescription>{movie.year}</CardDescription>
    </CardHeader>
    <CardContent>
      <Rating value={movie.rating} />
    </CardContent>
  </Card>
);

const MovieDialog = ({ movie, closeDialog }) => (
  <Dialog open={!!movie} onOpenChange={closeDialog}>
    <Card>
      <CardHeader>
        <CardTitle>{movie?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Year: {movie?.year}</p>
        <p>Genre: {movie?.genre}</p>
        <Rating value={movie?.rating} />
        <h4 className="mt-2">Reviews:</h4>
        {movie?.reviews.map((review, idx) => (
          <div key={idx} className="border-t pt-2 mt-2">
            <strong>{review.user}:</strong> {review.comment}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={closeDialog}>Close</Button>
      </CardFooter>
    </Card>
  </Dialog>
);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    // Simulate API call
    const fetchMovies = () => {
      setTimeout(() => {
        setMovies(mockMovies);
      }, 500); // simulate network delay
    };
    fetchMovies();
  }, []);

  const handleRating = (movieId, rating) => {
    setUserRatings(prev => ({...prev, [movieId]: rating}));
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRating === 0 || movie.rating >= filterRating)
  );

  const recommendedMovies = filteredMovies.sort((a, b) => 
    (userRatings[b.id] || 0) - (userRatings[a.id] || 0)
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input 
        placeholder="Search for movies..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="flex mb-4">
        <span>Filter by rating:</span>
        {[0, 1, 2, 3, 4, 5].map(rating => (
          <Button key={rating} variant={filterRating === rating ? 'default' : 'outline'} onClick={() => setFilterRating(rating)} className="ml-2">
            {rating === 0 ? 'All' : rating}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap">
        {recommendedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
        ))}
      </div>
      <MovieDialog movie={selectedMovie} closeDialog={() => setSelectedMovie(null)} />
    </div>
  );
}