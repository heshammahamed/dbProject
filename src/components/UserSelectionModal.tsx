
import { useState } from "react";
import { Book } from "@/types/book";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import ExistingUserForm from "./ExistingUserForm";
import NewUserForm from "./NewUserForm";

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (userId: string) => void;
  actionType: "reserve" | "borrow" | null;
  book: Book;
}

type UserMode = "existing" | "new" | null;

const UserSelectionModal = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  actionType, 
  book 
}: UserSelectionModalProps) => {
  const [userMode, setUserMode] = useState<UserMode>(null);

  const resetState = () => {
    setUserMode(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getActionText = () => {
    return actionType === "reserve" ? "Reserve" : "Borrow";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!userMode ? (
          <>
            <DialogHeader>
              <DialogTitle>Select User Type</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <p className="mb-4 text-center text-muted-foreground">
                {getActionText()} "{book?.title}" for:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="flex-1 flex flex-col items-center py-6 h-auto"
                  variant="outline"
                  onClick={() => setUserMode("existing")}
                >
                  <User className="h-12 w-12 mb-2" />
                  <span>Existing Member</span>
                </Button>
                <Button 
                  className="flex-1 flex flex-col items-center py-6 h-auto"
                  variant="outline"
                  onClick={() => setUserMode("new")}
                >
                  <UserPlus className="h-12 w-12 mb-2" />
                  <span>New Member</span>
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : userMode === "existing" ? (
          <ExistingUserForm 
            onCancel={() => setUserMode(null)} 
            onSubmit={onComplete}
            actionType={actionType}
            book={book}
          />
        ) : (
          <NewUserForm 
            onCancel={() => setUserMode(null)} 
            onSubmit={onComplete}
            actionType={actionType}
            book={book}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSelectionModal;
