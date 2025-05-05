
import { Book } from "@/types/book";
import BookCard from "./BookCard";

interface BooksListProps {
  books: Book[];
}

const BooksList = ({ books }: BooksListProps) => {
  if (books.length === 0) {
    return null;
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
