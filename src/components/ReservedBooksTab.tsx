
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
import { getAllReservedBooks } from "@/services/userService";
import { ReservedBook } from "@/types/borrowing";
import { useToast } from "@/hooks/use-toast";

const ReservedBooksTab = () => {
  const [reservedBooks, setReservedBooks] = useState<ReservedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReservedBooks(getAllReservedBooks());
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCancelReservation = (reservationId: string) => {
    // In a real app, we would call an API to cancel the reservation
    toast({
      title: "Reservation Cancelled",
      description: "The book reservation has been cancelled.",
    });
    
    // Update local state
    setReservedBooks(prev => prev.filter(item => item.id !== reservationId));
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
                  <TableHead>Book</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Reservation Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservedBooks.map((reservation) => {
                  const status = getReservationStatus(reservation);
                  
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.book.title}</TableCell>
                      <TableCell>
                        {reservation.user.firstName} {reservation.user.lastName}
                        <div className="text-xs text-muted-foreground">ID: {reservation.user.id}</div>
                      </TableCell>
                      <TableCell>{format(reservation.reservationDate, "PP")}</TableCell>
                      <TableCell className={reservation.expirationDate < new Date() ? "text-destructive" : ""}>
                        {format(reservation.expirationDate, "PP")}
                      </TableCell>
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
