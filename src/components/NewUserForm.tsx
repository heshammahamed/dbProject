
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
  returnDate?: Date;
  borrowDate?: Date;
}

interface NewUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const NewUserForm = ({ 
  onCancel, 
  onSubmit, 
  actionType, 
  book,
  returnDate ,
  borrowDate,
}: NewUserFormProps) => {
  const [user, setUser] = useState<NewUser>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
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
    return user.firstName.trim() && user.lastName.trim() && user.email.trim() && user.phoneNumber.trim();
  };
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      const response = await fetch(`http://localhost:9000/api/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: user.firstName,
          secondName: user.lastName,
          email: user.email,
          phone: user.phoneNumber
        }),
      });
  
      // First check if response exists
      if (!response) {
        throw new Error('No response from server');
      }
  
      // Check for empty response
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add member');
      }
  
      // setShowSuccess(true);
      // toast({
      //   title: "Success",
      //   description: "Member added successfully",
      //   variant: "default",
      // });
      
      // setTimeout(() => {
      //   setShowSuccess(false);
      //   onSubmit(data.member.id.toString());
      // }, 2000);

      //new
      setIsSubmitting(true);
    
      // Simulate API call with timeout
      setTimeout(() => {
        const newUserId = `USER-${Date.now()}`;
        setShowSuccess(true);
        setIsSubmitting(false);
        
        // After showing success message, return to selection screen
        setTimeout(() => {
          setShowSuccess(false);
          onSubmit(newUserId);
        }, 1500);
      }, 800);
      //end
  
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit form',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="text-sm text-muted-foreground">Returning to action selection...</p>
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
          Fill in the details to register a new member
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
              <Label htmlFor="lastName">Email</Label>
              <Input
                id="email"
                value={user.email}
                onChange={(e) => updateUserField("email", e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Phone Number</Label>
              <Input
                id="phone Number"
                value={user.phoneNumber}
                onChange={(e) => updateUserField("phoneNumber", e.target.value)}
                placeholder="Phone number"
                required
              />
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
            {isSubmitting ? "Processing..." : "Add Member"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default NewUserForm;
