
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { searchBooks } from "@/services/bookService";
import { Book } from "@/types/book";
import { useToast } from "@/hooks/use-toast";

const EditBooksTab = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = searchBooks(query);
      setBooks(results);
      setIsSearching(false);
    }, 1000);
  };

  const handleDelete = (book: Book) => {
    // Simulate delete API call
    toast({
      title: "Book Deleted",
      description: `"${book.title}" has been deleted from the library.`,
    });
    
    // Remove from local state
    setBooks(books.filter(b => b.id !== book.id));
  };

  const handleEdit = (book: Book) => {
    // In a real app, this would open an edit modal or navigate to edit page
    toast({
      title: "Edit Book",
      description: `Editing "${book.title}" (Feature to be implemented)`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Books</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search books by title, author, or ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !query.trim()}
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {books.length > 0 ? (
        <Card>
          <CardContent className="pt-6 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publishedYear || "N/A"}</TableCell>
                    <TableCell>{book.genre || "Uncategorized"}</TableCell>
                    <TableCell>{book.copies || 1}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(book)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(book)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        query.trim() && !isSearching && (
          <div className="text-center py-8 text-muted-foreground">
            No books found matching your search
          </div>
        )
      )}
    </div>
  );
};

export default EditBooksTab;
