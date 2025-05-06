
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUserById, getAllUsers } from "@/services/userService";
import { User } from "@/types/user";
import UserProfile from "./UserProfile";

const MembersTab = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(getAllUsers());

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundUser = getUserById(query);
      setUser(foundUser || null);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Members</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search member by ID..."
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
      
      {user ? (
        <Card>
          <CardContent className="pt-6">
            <UserProfile user={user} />
          </CardContent>
        </Card>
      ) : (
        query.trim() && !isSearching && (
          <div className="text-center py-8 text-muted-foreground">
            No member found with this ID
          </div>
        )
      )}
      
      {/* List of all members */}
      <h3 className="text-xl font-bold mt-8">All Members</h3>
      <div className="space-y-4">
        {allUsers.map(user => (
          <Card key={user.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUser(user)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MembersTab;
