
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
import { getAllReservedBooks , cancelReservation } from "@/services/userService";
import { ReservedBook } from "@/types/borrowing";
import { useToast } from "@/hooks/use-toast";

const ReservedBooksTab = () => {
  const [reservedBooks, setReservedBooks] = useState<ReservedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getAllReservedBooks();
        setReservedBooks(books);
      } catch (error) {
        console.error("Error fetching reserved books:", error);
        toast({
          title: "Error",
          description: "Failed to load reserved books. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [toast]);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const success = await cancelReservation(reservationId);
      
      if (success) {
        toast({
          title: "Reservation Cancelled",
          description: "The reservation has been successfully cancelled.",
        });
        
        // Update UI
        setReservedBooks(prev => prev.filter(item => item.id !== reservationId));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getReservationStatus = (reservation: ReservedBook) => {
    const isExpired = reservation.expirationDate < new Date();
    
    return {
      label: isExpired ? "Expired" : "Active",
      variant: isExpired ? "destructive" as const : "secondary" as const
    };
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        Loading reserved books...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reserved Books</h2>
      
      <Card>
        <CardContent className="pt-6 overflow-auto">
          {reservedBooks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reservation ID</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Reservation Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservedBooks.map((reservation) => {
                  const status = getReservationStatus(reservation);
                  
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell >
                        {reservation.id}
                      </TableCell>
                      <TableCell className="font-medium">{reservation.book.title}</TableCell>
                      <TableCell>
                        {reservation.user.firstName} {reservation.user.lastName}
                        <div className="text-xs text-muted-foreground">ID: {reservation.user.id}</div>
                      </TableCell>
                      <TableCell>{format(reservation.reservationDate, "PP")}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Cancel Reservation
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No reserved books found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservedBooksTab;
