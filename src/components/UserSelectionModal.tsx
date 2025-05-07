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
import { User, UserPlus, Calendar } from "lucide-react";
import ExistingUserForm from "./ExistingUserForm";
import NewUserForm from "./NewUserForm";
import { addDays, format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 14)); // Default to 2 weeks

  const resetState = () => {
    setUserMode(null);
    setReturnDate(addDays(new Date(), 14));
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getActionText = () => {
    return actionType === "reserve" ? "Reserve" : "Borrow";
  };
  
  const handleNewUserSubmit = (userId: string) => {
    // Just reset to selection screen instead of completing the action
    setUserMode(null);
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
              
              {actionType === "borrow" && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium mb-3">Borrow Details:</p>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="returnDate">Return By:</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="returnDate"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !returnDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {returnDate ? format(returnDate, 'MMM dd, yyyy') : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={returnDate}
                            onSelect={(date) => date && setReturnDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}
              
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
            returnDate={returnDate}
          />
        ) : (
          <NewUserForm 
            onCancel={() => setUserMode(null)} 
            onSubmit={handleNewUserSubmit}
            actionType={actionType}
            book={book}
            returnDate={returnDate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSelectionModal;