
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import BooksList from "@/components/BooksList";
import { Button } from "@/components/ui/button";
import { Book, Library } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-library-300" />
            <h1 className="text-2xl font-bold text-gray-900">Library System</h1>
          </div>
          <Link to="/manage">
            <Button variant="outline">
              <Book className="mr-2 h-4 w-4" />
              Manage Library
            </Button>
          </Link>
        </div>
      </header>

      <div className="py-16 bg-library-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome to the Library</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Search our collection of books by title, author, or genre.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <main className="container mx-auto py-12 px-4">
        <BooksList searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default Index;
