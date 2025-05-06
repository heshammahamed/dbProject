
import { useState } from "react";
import { Book } from "@/types/book";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookIcon } from "lucide-react";
import BookDetailsModal from "./BookDetailsModal";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card 
        className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-library-100 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="p-4 flex justify-center bg-library-50">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={`${book.title} cover`} 
              className="h-48 object-contain rounded-sm"
            />
          ) : (
            <div className="h-48 w-36 bg-library-100 flex items-center justify-center rounded-sm">
              <BookIcon className="h-12 w-12 text-library-300" />
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold line-clamp-2">{book.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {book.author}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
        </CardContent>
        <CardFooter className="pt-0 pb-4 flex justify-between text-xs text-muted-foreground">
          <span>{book.publishedYear || "Unknown year"}</span>
          <span>{book.genre || "Uncategorized"}</span>
        </CardFooter>
      </Card>

      <BookDetailsModal
        book={showDetails ? book : null}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default BookCard;
