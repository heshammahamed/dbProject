
import { Book } from "@/types/book";
import BookCard from "./BookCard";

interface BooksListProps {
  books: Book[];
  searchQuery?: string;
}

const BooksList = ({ books, searchQuery }: BooksListProps) => {
  // Check if books is undefined or empty
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery ? "No books found matching your search" : "Search for books to see results"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BooksList;
