
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBorrowedBooks, returnBook } from "@/services/userService";
import { BorrowedBook } from "@/types/borrowing";
import { useToast } from "@/hooks/use-toast";

const BorrowedBooksTab = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBorrowedBooks(getAllBorrowedBooks());
      setIsLoading(false);
    }, 500);
  }, []);

  const handleReturnBook = (borrowId: string) => {
    const result = returnBook(borrowId);
    
    if (result) {
      toast({
        title: "Book Returned",
        description: `"${result.book.title}" has been successfully marked as returned.`,
      });
      
      // Update local state
      setBorrowedBooks(prev => 
        prev.map(item => 
          item.id === borrowId ? { ...item, returnDate: new Date() } : item
        )
      );
    }
  };

  const getBorrowStatus = (borrow: BorrowedBook) => {
    if (borrow.returnDate) {
      return {
        label: "Returned",
        variant: "outline" as const,
        className: "bg-green-50 text-green-700 border-green-200"
      };
    }
    
    const isOverdue = borrow.dueDate < new Date();
    
    return {
      label: isOverdue ? "Overdue" : "Active",
      variant: isOverdue ? "destructive" as const : "secondary" as const
    };
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        Loading borrowed books...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Borrowed Books</h2>
      
      <Card>
        <CardContent className="pt-6 overflow-auto">
          {borrowedBooks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooks.map((borrow) => {
                  const status = getBorrowStatus(borrow);
                  
                  return (
                    <TableRow key={borrow.id}>
                      <TableCell className="font-medium">{borrow.book.title}</TableCell>
                      <TableCell>
                        {borrow.user.firstName} {borrow.user.lastName}
                        <div className="text-xs text-muted-foreground">ID: {borrow.user.id}</div>
                      </TableCell>
                      <TableCell>{format(borrow.borrowDate, "PP")}</TableCell>
                      <TableCell className={borrow.dueDate < new Date() && !borrow.returnDate ? "text-destructive" : ""}>
                        {format(borrow.dueDate, "PP")}
                      </TableCell>
                      <TableCell>
                        {borrow.returnDate ? format(borrow.returnDate, "PP") : "Not returned"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!borrow.returnDate && (
                          <Button
                            size="sm"
                            onClick={() => handleReturnBook(borrow.id)}
                          >
                            Mark as Returned
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No borrowed books found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowedBooksTab;
