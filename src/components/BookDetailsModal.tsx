
import { useState } from "react";
import { Book } from "@/types/book";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book as BookIcon, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserSelectionModal from "./UserSelectionModal";

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

type ActionType = "reserve" | "borrow" | null;

const BookDetailsModal = ({ book, isOpen, onClose }: BookDetailsModalProps) => {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const { toast } = useToast();

  const handleAction = (type: ActionType) => {
    setActionType(type);
    setShowUserSelection(true);
  };

  const handleUserSelectionClose = () => {
    setShowUserSelection(false);
  };

  const handleUserActionComplete = (userId: string) => {
    if (!book) return;
    
    const actionText = actionType === "reserve" ? "Reserved" : "Borrowed";
    toast({
      title: `Book ${actionText}`,
      description: `Successfully ${actionText.toLowerCase()} "${book.title}" for user ID: ${userId}`,
    });
    
    setShowUserSelection(false);
    onClose();
  };

  if (!book) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{book.title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              by {book.author}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row gap-4 my-4">
            <div className="flex-shrink-0 flex justify-center">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={`${book.title} cover`} 
                  className="h-48 object-contain rounded-sm"
                />
              ) : (
                <div className="h-48 w-36 bg-library-100 flex items-center justify-center rounded-sm">
                  <BookIcon className="h-12 w-12 text-library-300" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-600 mb-4">{book.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Year:</span>
                <span>{book.publishedYear || "Unknown"}</span>
                <span className="text-muted-foreground">Genre:</span>
                <span>{book.genre || "Uncategorized"}</span>
              </div>
            </div>
          </div>
            
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => handleAction("reserve")}
            >
              Reserve
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => handleAction("borrow")}
            >
              Borrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserSelectionModal
        isOpen={showUserSelection}
        onClose={handleUserSelectionClose}
        onComplete={handleUserActionComplete}
        actionType={actionType}
        book={book}
      />
    </>
  );
};

export default BookDetailsModal;
