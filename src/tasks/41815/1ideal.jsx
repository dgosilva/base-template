import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

// Functional component to render individual book details within a card
const BookCard = ({ book, onAddToCollection, onViewReviews, onReview }) => (
  <Card className="w-full sm:w-64 m-2">
    <CardHeader>
      <CardTitle>{book.title}</CardTitle>
      <CardDescription>{book.author}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Average Rating: {book.averageRating.toFixed(1)}</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button onClick={() => onAddToCollection(book)}>Add to Collection</Button>
      <Button onClick={() => onViewReviews(book)}>View Reviews</Button>
      <Button onClick={() => onReview(book)}>Review</Button>
    </CardFooter>
  </Card>
);

// Functional component to handle review submission for a book
const ReviewForm = ({ book, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ bookId: book.id, rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rating">Rating (1-10)</Label>
        <Slider
          id="rating"
          min={1}
          max={10}
          step={1}
          value={[rating]}
          onValueChange={(value) => setRating(value[0])}
        />
        <span>{rating}</span>
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
};

export default function App() {
  // State management
  const [books, setBooks] = useState([]);
  const [collection, setCollection] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBooks(); // Fetch books on component mount
  }, []);

  // Simulate fetching books from API
  const fetchBooks = async () => {
    setLoading(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setBooks([
        { id: 1, title: "Book 1", author: "Author 1", averageRating: 4.5, reviews: [] },
        { id: 2, title: "Book 2", author: "Author 2", averageRating: 3.8, reviews: [] },
        { id: 3, title: "Book 3", author: "Author 3", averageRating: 4.2, reviews: [] },
      ]);
      setLoading(false);
    }, 1000);
  };

  // Add a book to user's collection
  const addToCollection = async (book) => {
    setLoading(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setCollection((prev) => [...prev, book]);
      setLoading(false);
    }, 500);
  };

  // Submit a review for a book
  const submitReview = async (review) => {
    setLoading(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === review.bookId
            ? {
                ...book,
                reviews: [...book.reviews, review],
                averageRating:
                  (book.averageRating * book.reviews.length + review.rating) /
                  (book.reviews.length + 1),
              }
            : book
        )
      );
      setLoading(false);
      setReviewDialogOpen(false);
    }, 500);
  };

  // Filter books based on search term in input field
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book Review App</h1>
      <Input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">All Books</h2>
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center sm:justify-start">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCollection={addToCollection}
              onViewReviews={() => {
                setSelectedBook(book);
                setReviewsDialogOpen(true);
              }}
              onReview={() => {
                setSelectedBook(book);
                setReviewDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}
      <h2 className="text-2xl font-semibold my-4">My Collection</h2>
      {collection.length === 0 ? (
        <p>Your collection is empty.</p>
      ) : (
        <div className="flex flex-wrap justify-center sm:justify-start">
          {collection.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCollection={() => {}}
              onViewReviews={() => {
                setSelectedBook(book);
                setReviewsDialogOpen(true);
              }}
              onReview={() => {
                setSelectedBook(book);
                setReviewDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}
      {/* Dialog for writing a review */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <ReviewForm book={selectedBook} onSubmit={submitReview} />
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog for viewing reviews */}
      <Dialog open={reviewsDialogOpen} onOpenChange={setReviewsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reviews for {selectedBook?.title}</DialogTitle>
          </DialogHeader>
          {selectedBook?.reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul>
              {selectedBook?.reviews.map((review, index) => (
                <li key={index} className="mb-2">
                  <strong>Rating: {review.rating}</strong>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}