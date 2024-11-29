import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Filter types object to manage filter values safely
const FILTER_TYPES = {
  ALL: "all",
  HIGH: "high",
  LOW: "low",
};

// Mock movie data to simulate API response
const mockMovies = [
  { id: 1, title: "Inception", genre: "Sci-Fi", rating: 4.5, reviews: ["Mind-bending!", "Incredible visuals"] },
  { id: 2, title: "The Shawshank Redemption", genre: "Drama", rating: 4.9, reviews: ["A masterpiece", "Timeless classic"] },
  { id: 3, title: "The Dark Knight", genre: "Action", rating: 4.7, reviews: ["Heath Ledger's performance is legendary", "Best superhero movie"] },
  { id: 4, title: "Pulp Fiction", genre: "Crime", rating: 4.6, reviews: ["Tarantino at his best", "Iconic scenes"] },
  { id: 5, title: "Forrest Gump", genre: "Drama", rating: 4.8, reviews: ["Heartwarming", "Tom Hanks is brilliant"] },
  { id: 6, title: "The Matrix", genre: "Sci-Fi", rating: 4.4, reviews: ["Revolutionary for its time", "Action-packed"] },
  { id: 7, title: "Goodfellas", genre: "Crime", rating: 4.7, reviews: ["Scorsese's masterpiece", "Intense and gripping"] },
  { id: 8, title: "The Silence of the Lambs", genre: "Thriller", rating: 4.6, reviews: ["Chilling performances", "Psychological thriller at its finest"] },
  { id: 9, title: "Schindler's List", genre: "Drama", rating: 4.9, reviews: ["Powerful and moving", "A must-watch"] },
  { id: 10, title: "Fight Club", genre: "Drama", rating: 4.5, reviews: ["Mind-bending twist", "Thought-provoking"] },
];

const MovieCard = ({ movie, onRate }) => {
  const [userRating, setUserRating] = useState(0);

  // Function to handle user rating action
  const rateMovie = (rating) => {
    setUserRating(rating);
    onRate(movie.id, rating);
  };

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>{movie.genre}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Rating: {movie.rating.toFixed(1)}</p>
        <div className="flex mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => rateMovie(star)}
              className={`text-2xl ${userRating >= star ? "text-yellow-500" : "text-gray-300"}`}
            >
              {userRating >= star ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{movie.title}</DialogTitle>
              <DialogDescription>{movie.genre}</DialogDescription>
            </DialogHeader>
            <div>
              <p>Rating: {movie.rating.toFixed(1)}</p>
              <h3 className="font-bold mt-2">Reviews:</h3>
              <ul className="list-disc pl-5">
                {movie.reviews.map((review, index) => (
                  <li key={index}>{review}</li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  // State management
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  const [userPreferences, setUserPreferences] = useState({});

  // Effect to simulate fetching movie data from an API
  useEffect(() => {
    setTimeout(() => {
      setMovies(mockMovies);
    }, 1000);
  }, []);

  // Function to handle user rating and update movie data
  const handleRate = (id, rating) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, rating: (movie.rating + rating) / 2 } : movie
      )
    );
    setUserPreferences((prev) => ({ ...prev, [id]: rating }));
  };

  // Filter movies based on search term and selected rating filter
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === FILTER_TYPES.ALL ||
      (filter === FILTER_TYPES.HIGH && movie.rating >= 4.5) ||
      (filter === FILTER_TYPES.LOW && movie.rating < 4.5);
    return matchesSearch && matchesFilter;
  });

  // Generate recommended movies based on user preferences
  const recommendedMovies = movies
    .filter((movie) => !userPreferences[movie.id])
    .sort((a, b) => {
      const userRatedMovies = Object.keys(userPreferences).map(Number);
      const similarityA = userRatedMovies.reduce((sum, id) => {
        const similarMovie = movies.find((m) => m.id === id);
        return sum + (similarMovie.genre === a.genre ? 1 : 0);
      }, 0);
      const similarityB = userRatedMovies.reduce((sum, id) => {
        const similarMovie = movies.find((m) => m.id === id);
        return sum + (similarMovie.genre === b.genre ? 1 : 0);
      }, 0);
      return similarityB - similarityA;
    })
    .slice(0, 3); // Limit recommendations to top 3

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Movie Rating App</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 mb-2 sm:mb-0 sm:mr-2"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_TYPES.ALL}>All ratings</SelectItem>
            <SelectItem value={FILTER_TYPES.HIGH}>High rated (≥4.5)</SelectItem>
            <SelectItem value={FILTER_TYPES.LOW}>Low rated (&lt;4.5)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onRate={handleRate} />
        ))}
      </div>
      {recommendedMovies.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommended for you:</h2>
          <div className="flex flex-wrap justify-center sm:justify-start">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onRate={handleRate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}