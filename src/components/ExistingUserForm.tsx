
import { useState } from "react";
import { Book } from "@/types/book";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getUserById } from "@/services/userService";
import UserProfileModal from "./UserProfileModal";
import { format } from "date-fns";

interface ExistingUserFormProps {
  onCancel: () => void;
  onSubmit: (userId: string) => void;
  actionType: "reserve" | "borrow" | null;
  book: Book;
  borrowDate?: Date;
  returnDate?: Date;
}

const ExistingUserForm = ({ 
  onCancel, 
  onSubmit, 
  actionType, 
  book,
  returnDate
}: ExistingUserFormProps) => {
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast({ title: "Error", description: "Please enter a valid member ID", variant: "destructive" });
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const endpoint = actionType === 'borrow' ? 'http://localhost:9000/borrow' : 'http://localhost:9000/reserve';
      const payload = {
        memberId: userId,
        bookId: book.id,
        ...(actionType === 'borrow' && {
          returnDate: format(returnDate, 'yyyy-MM-dd')
        })
      };
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (data.code === 'MEMBER_BANNED') {
          throw new Error('This member is currently banned');
        }
        if (data.code === 'BOOK_UNAVAILABLE') {
          throw new Error('No available copies of this book');
        }
        throw new Error(data.error || 'Operation failed');
      }
  
      toast({
        title: "Success",
        description: actionType === 'borrow' 
          ? `Book borrowed until ${format(returnDate, 'MMM dd, yyyy')}`
          : "Book reserved successfully",
        variant: "default",
      });
  
      setTimeout(() => {
        onSubmit(userId);
      }, 2000);
  
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileClose = () => {
    setShowUserProfile(false);
    onSubmit(userId);
  };

  const getActionText = () => {
    return actionType === "reserve" ? "Reserve" : "Borrow";
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Enter Member ID</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Enter the ID of the existing member to {getActionText().toLowerCase()} "{book?.title}":
          </p>
          
          {actionType === "borrow" && returnDate && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium mb-1">Borrow Details:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Borrow Date:</span>
                <span>{new Date().toISOString().split('T')[0]}</span>
                <span className="text-muted-foreground">Return By:</span>
                <span>{format(returnDate, 'MMM dd, yyyy')}</span>
              </div>
            </div>
          )}
          
          <Input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Member ID"
            className="w-full"
            autoFocus
          />
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !userId.trim()}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </Button>
        </DialogFooter>
      </form>

      {showUserProfile && (
        <UserProfileModal
          isOpen={showUserProfile}
          onClose={handleProfileClose}
          user={getUserById(userId)}
          actionType={actionType}
          book={book}
          returnDate={returnDate}
        />
      )}
    </>
  );
};

export default ExistingUserForm;
