
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchBar = ({ onSearch, isSearching }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex w-full max-w-3xl gap-2"
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for books by title, author, or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-6 text-base bg-white border border-library-100 focus:border-library-300 focus:ring-2 focus:ring-library-200 rounded-md"
        />
      </div>
      <Button 
        type="submit" 
        className="bg-library-600 hover:bg-library-700 text-white font-semibold py-6 px-8"
        disabled={!query.trim() || isSearching}
      >
        {isSearching ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};

export default SearchBar;
