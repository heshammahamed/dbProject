
import { useState } from "react";
import { Book } from "@/types/book";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NewUserFormProps {
  onCancel: () => void;
  onSubmit: (userId: string) => void;
  actionType: "reserve" | "borrow" | null;
  book: Book;
}

interface NewUser {
  firstName: string;
  lastName: string;
  joinDate: Date | undefined;
}

const NewUserForm = ({ 
  onCancel, 
  onSubmit, 
  actionType, 
  book 
}: NewUserFormProps) => {
  const [user, setUser] = useState<NewUser>({
    firstName: "",
    lastName: "",
    joinDate: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const updateUserField = (field: keyof NewUser, value: any) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    return user.firstName.trim() && user.lastName.trim() && user.joinDate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newUserId = `USER-${Date.now()}`;
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // After showing success message, automatically continue
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit(newUserId);
      }, 2000);
    }, 800);
  };

  const getActionText = () => {
    return actionType === "reserve" ? "Reserve" : "Borrow";
  };

  if (showSuccess) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Success!</DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center">
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-800">
              New member {user.firstName} {user.lastName} has been successfully added!
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Continuing to {getActionText().toLowerCase()} the book...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Member</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="py-4 space-y-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Fill in the details to register a new member and {getActionText().toLowerCase()} "{book?.title}":
          </p>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={user.firstName}
                onChange={(e) => updateUserField("firstName", e.target.value)}
                placeholder="First Name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={user.lastName}
                onChange={(e) => updateUserField("lastName", e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="joinDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !user.joinDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {user.joinDate ? format(user.joinDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={user.joinDate}
                    onSelect={(date) => updateUserField("joinDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
            disabled={isSubmitting || !validateForm()}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default NewUserForm;
