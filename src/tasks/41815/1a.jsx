import React, { useState, useEffect } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle,
//   Button,
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   Input,
//   Textarea,
//   Label,
//   Rating
// } from "@/components/ui";

const API_URL = 'placeholder-api-url'; // This would be replaced with actual API endpoints

// Simulated API calls
const simulateFetchBooks = () => {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", avgRating: 4.5 },
    { id: 2, title: "Moby Dick", author: "Herman Melville", avgRating: 3.8 }
  ]), 1000));
};

const simulateAddToCollection = (bookId) => new Promise(resolve => setTimeout(() => resolve(true), 500));
const simulateSaveReview = (review) => new Promise(resolve => setTimeout(() => resolve({...review, id: Date.now()}), 500));

function BookCard({ book, onAddToCollection, onReview }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Simulate fetching reviews for a book
  useEffect(() => {
    // Comment: Implement actual API call here
    setReviews([{ rating: 5, comment: "Great book!" }, { rating: 4, comment: "Enjoyed it." }]);
  }, []);

  return (
    <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>By {book.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Average Rating: {book.avgRating}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setIsOpen(true)}>View Reviews</Button>
        <Button onClick={() => onAddToCollection(book.id)}>Add to Collection</Button>
        <Button onClick={() => setIsReviewOpen(true)}>Review</Button>
      </CardFooter>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reviews for {book.title}</DialogTitle>
          </DialogHeader>
          {reviews.map(review => (
            <div key={review.id}>
              <p>Rating: {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </DialogContent>
      </Dialog>
      <ReviewDialog isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} onSubmit={onReview} bookId={book.id} />
    </Card>
  );
}

function ReviewDialog({ isOpen, onClose, onSubmit, bookId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({ bookId, rating, comment });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <Label htmlFor="rating">Rating</Label>
        <Rating id="rating" value={rating} onValueChange={setRating} />
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Your thoughts..." />
        <Button onClick={handleSubmit}>Submit Review</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    simulateFetchBooks().then(data => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  const handleAddToCollection = (bookId) => {
    setLoading(true);
    simulateAddToCollection(bookId).then(() => {
      setCollection(prev => [...prev, bookId]);
      setLoading(false);
    });
  };

  const handleSubmitReview = (review) => {
    setLoading(true);
    simulateSaveReview(review).then(newReview => {
      // Comment: Here you would update the book's reviews and average rating in the state
      setLoading(false);
      console.log("Review added:", newReview);
    });
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-4">
      <Input 
        type="search" 
        placeholder="Search for a book..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        className="mb-4"
      />
      <h2 className="text-xl mb-4">My Collection</h2>
      <div className="flex flex-wrap">
        {collection.length === 0 ? 
          <p>Your collection is empty. Add some books!</p> :
          books.filter(book => collection.includes(book.id)).map(book => (
            <BookCard key={book.id} book={book} onAddToCollection={handleAddToCollection} onReview={handleSubmitReview} />
          ))
        }
      </div>
      <h2 className="text-xl mt-8 mb-4">Browse Books</h2>
      <div className="flex flex-wrap">
        {books.filter(book => book.title.toLowerCase().includes(search.toLowerCase())).map(book => (
          <BookCard key={book.id} book={book} onAddToCollection={handleAddToCollection} onReview={handleSubmitReview} />
        ))}
      </div>
    </div>
  );
}