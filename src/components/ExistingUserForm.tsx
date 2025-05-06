
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

interface ExistingUserFormProps {
  onCancel: () => void;
  onSubmit: (userId: string) => void;
  actionType: "reserve" | "borrow" | null;
  book: Book;
}

const ExistingUserForm = ({ 
  onCancel, 
  onSubmit, 
  actionType, 
  book 
}: ExistingUserFormProps) => {
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid member ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      onSubmit(userId);
      setIsSubmitting(false);
    }, 500);
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
    </>
  );
};

export default ExistingUserForm;
