import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUserById, getAllUsers } from "@/services/userService";
import { User } from "@/types/user";
import UserProfile from "./UserProfile";
import { useToast } from "@/hooks/use-toast";

const MembersTab = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Load all users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load members",
          variant: "destructive"
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    loadUsers();
  }, [toast]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const foundUser = await getUserById(query);
      setUser(foundUser || null);
      
      if (!foundUser) {
        toast({
          title: "Not Found",
          description: "No member found with this ID",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for member",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
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
      {isLoadingUsers ? (
        <div className="text-center py-8">Loading members...</div>
      ) : (
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
      )}
    </div>
  );
};

export default MembersTab;