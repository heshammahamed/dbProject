
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import { borrowBook, reserveBook } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/types/book";
import { format } from "date-fns";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  actionType: "reserve" | "borrow" | null;
  book: Book | null;
  borrowDate?: Date;
  returnDate?: Date;
}

const UserProfileModal = ({ 
  isOpen, 
  onClose, 
  user, 
  actionType,
  book,
  borrowDate,
  returnDate
}: UserProfileModalProps) => {
  const { toast } = useToast();

  const handleAction = () => {
    if (!user || !book || !actionType) return;
    
    if (actionType === "borrow") {
      const dueDate = returnDate ? returnDate : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
      const result = borrowBook(user.id, book.id);
      if (result) {
        toast({
          title: "Book Borrowed",
          description: `"${book.title}" has been borrowed successfully. Due date: ${format(dueDate, 'MMM dd, yyyy')}`,
        });
        onClose();
      }
    } else if (actionType === "reserve") {
      const result = reserveBook(user.id, book.id);
      if (result) {
        toast({
          title: "Book Reserved",
          description: `"${book.title}" has been reserved successfully. Reservation expires: ${format(new Date(result.expirationDate), 'MMM dd, yyyy')}`,
        });
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
        </DialogHeader>
        
        <UserProfile 
          user={user} 
          onBorrow={actionType === "borrow" ? handleAction : undefined} 
          onReserve={actionType === "reserve" ? handleAction : undefined} 
          bookTitle={book?.title}
          borrowDate={borrowDate}
          returnDate={returnDate}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
