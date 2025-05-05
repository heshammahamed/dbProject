
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import BooksList from "@/components/BooksList";
import { Book } from "@/types/book";
import { searchBooks } from "@/services/bookService";
import { Book as BookIcon } from "lucide-react";

const Index = () => {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchBooks(query);
      setSearchResults(results);
      setHasSearched(true);
      
      if (results.length === 0) {
        toast({
          title: "No books found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching books:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching for books",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-library-50">
      <header className="bg-white py-8 border-b border-library-100">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookIcon className="h-8 w-8 text-library-600" />
            <h1 className="text-3xl font-bold text-center text-gray-800">Library Book Finder</h1>
          </div>
          <p className="text-center text-gray-600 mb-8">
            Search for books in our extensive collection
          </p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          </div>
        </div>
      </header>

      <main className="container px-4 mx-auto py-8">
        {isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-library-100 rounded mb-4"></div>
              <div className="h-6 w-40 bg-library-100 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {hasSearched && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {searchResults.length > 0 
                    ? `Found ${searchResults.length} book${searchResults.length === 1 ? '' : 's'}`
                    : 'No books found'}
                </h2>
              </div>
            )}
            
            {searchResults.length > 0 ? (
              <div className="animate-fade-in">
                <BooksList books={searchResults} />
              </div>
            ) : hasSearched ? (
              <div className="text-center py-12">
                <div className="bg-library-50 rounded-lg p-8 inline-block">
                  <BookIcon className="h-12 w-12 text-library-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No books match your search. Try different keywords.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <BookIcon className="h-16 w-16 text-library-200 mx-auto mb-4" />
                <p className="text-xl text-gray-500">
                  Enter a search term to discover books
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white py-6 border-t border-library-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Library Book Finder. All books are for demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
