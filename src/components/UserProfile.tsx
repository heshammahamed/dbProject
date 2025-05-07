
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { User } from "@/types/user";
import { BorrowedBook, ReservedBook } from "@/types/borrowing";
import { getUserBorrowedBooks, getUserReservedBooks } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Book as BookIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  user: User | null;
  onBorrow?: () => void;
  onReserve?: () => void;
  bookTitle?: string;
}

const UserProfile = ({ user, onBorrow, onReserve, bookTitle }: UserProfileProps) => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [reservedBooks, setReservedBooks] = useState<ReservedBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const [borrowedData, reservedData] = await Promise.all([
          getUserBorrowedBooks(user.id),
          getUserReservedBooks(user.id)
        ]);
        
        setBorrowedBooks(borrowedData);
        setReservedBooks(reservedData);
      } catch (error) {
        console.error("Error fetching user books:", error);
        toast({
          title: "Error",
          description: "Failed to load user book history.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserBooks();
  }, [user, toast]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>Member since: {format(user.joinDate, "PPP")}</span>
            <span>•</span>
            <span>ID: {user.id}</span>
            {user.email && (
              <>
                <span>•</span>
                <span>Email: {user.email}</span>
              </>
            )}
          </div>
        </div>
        
        {user.isBanned && (
          <Badge variant="destructive" className="px-3 py-1">
            Account Banned
          </Badge>
        )}
      </div>

      {bookTitle && (
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-medium">Selected Book: <span className="font-bold">{bookTitle}</span></h3>
              </div>
              <div className="flex gap-2">
                {onReserve && (
                  <Button 
                    variant="outline" 
                    onClick={onReserve}
                    disabled={user.isBanned}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Reserve
                  </Button>
                )}
                {onBorrow && (
                  <Button 
                    onClick={onBorrow}
                    disabled={user.isBanned}
                  >
                    <BookIcon className="mr-2 h-4 w-4" />
                    Borrow
                  </Button>
                )}
              </div>
            </div>
            
            {user.isBanned && (
              <p className="mt-2 text-sm text-destructive">
                This member is currently banned and cannot borrow or reserve books.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading user history...</div>
      ) : (
        <Tabs defaultValue="borrowed">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="borrowed">
              Borrowed Books ({borrowedBooks.length})
            </TabsTrigger>
            <TabsTrigger value="reserved">
              Reserved Books ({reservedBooks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="borrowed" className="pt-2">
            {borrowedBooks.length > 0 ? (
              <div className="space-y-4">
                {borrowedBooks.map(item => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-12 bg-muted flex-shrink-0 flex items-center justify-center rounded">
                          <BookIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.book.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.book.author}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                            <span className="text-muted-foreground">Borrowed:</span>
                            <span>{format(item.borrowDate, "PPP")}</span>
                            <span className="text-muted-foreground">Due date:</span>
                            <span className={item.dueDate < new Date() && !item.returnDate ? "text-destructive font-medium" : ""}>
                              {format(item.dueDate, "PPP")}
                            </span>
                            {item.returnDate && (
                              <>
                                <span className="text-muted-foreground">Returned:</span>
                                <span>{format(item.returnDate, "PPP")}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          {item.returnDate ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Returned
                            </Badge>
                          ) : (
                            <Badge variant={item.dueDate < new Date() ? "destructive" : "secondary"}>
                              {item.dueDate < new Date() ? "Overdue" : "Active"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No borrowed books found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reserved" className="pt-2">
            {reservedBooks.length > 0 ? (
              <div className="space-y-4">
                {reservedBooks.map(item => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-12 bg-muted flex-shrink-0 flex items-center justify-center rounded">
                          <BookIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.book.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.book.author}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                            <span className="text-muted-foreground">Reserved:</span>
                            <span>{format(item.reservationDate, "PPP")}</span>
                          </div>
                        </div>
                        <div>
                          <Badge variant={item.expirationDate < new Date() ? "destructive" : "secondary"}>
                            {item.expirationDate < new Date() ? "Expired" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reserved books found
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default UserProfile;
