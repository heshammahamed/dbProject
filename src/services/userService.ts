
import { User } from "@/types/user";
import { BorrowedBook, ReservedBook } from "@/types/borrowing";

const API_URL = "http://localhost:9000";

// Mock data for users - we'd replace this with an API endpoint in a real app
const mockUsers: User[] = [
  {
    id: "USER-001",
    firstName: "John",
    lastName: "Doe",
    joinDate: new Date("2023-01-15"),
    isBanned: false
  },
  {
    id: "USER-002",
    firstName: "Jane",
    lastName: "Smith",
    joinDate: new Date("2023-03-22"),
    isBanned: false
  },
  {
    id: "USER-003",
    firstName: "Michael",
    lastName: "Brown",
    joinDate: new Date("2023-05-10"),
    isBanned: true
  }
];

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

export const getUserBorrowedBooks = async (userId: string): Promise<BorrowedBook[]> => {
  try {
    const response = await fetch(`${API_URL}/borrow-records/member/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map API response to our BorrowedBook type
    return data.map((item: any) => ({
      id: item.BorrowID.toString(),
      book: {
        id: "book-" + Math.floor(Math.random() * 1000),
        title: item.BookTitle,
        author: item.AuthorName,
        description: item.CategoryName,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        genre: item.CategoryName
      },
      user: getUserById(userId)!,
      borrowDate: new Date(item.BorrowDate),
      dueDate: new Date(item.DueDate),
      returnDate: item.ReturnDate ? new Date(item.ReturnDate) : undefined
    }));
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return [];
  }
};

export const getUserReservedBooks = async (userId: string): Promise<ReservedBook[]> => {
  try {
    const response = await fetch(`${API_URL}/reservations/member/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map API response to our ReservedBook type
    return data.map((item: any) => ({
      id: item.ReservationID.toString(),
      book: {
        id: "book-" + Math.floor(Math.random() * 1000),
        title: item.BookTitle,
        author: item.AuthorName,
        description: item.CategoryName,
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        genre: item.CategoryName
      },
      user: getUserById(userId)!,
      reservationDate: new Date(item.ReservationDate),
      expirationDate: new Date(new Date(item.ReservationDate).getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from reservation
    }));
  } catch (error) {
    console.error("Error fetching reserved books:", error);
    return [];
  }
};

export const getAllBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  try {
    const response = await fetch(`${API_URL}/borrow-records`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map API response to our BorrowedBook type
    return data.map((item: any) => {
      // Extract first and last name from MemberName
      const nameParts = item.MemberName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const user: User = {
        id: `USER-${item.BorrowID}`, // Using BorrowID as user ID for now
        firstName,
        lastName,
        email: item.MemberEmail,
        joinDate: new Date(), // Default date
        isBanned: false
      };
      
      return {
        id: item.BorrowID.toString(),
        book: {
          id: "book-" + Math.floor(Math.random() * 1000),
          title: item.BookTitle,
          author: item.AuthorName,
          description: "Book description", // Default description
          coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
        },
        user,
        borrowDate: new Date(item.BorrowDate),
        dueDate: new Date(item.DueDate),
        returnDate: item.ReturnDate ? new Date(item.ReturnDate) : undefined
      };
    });
  } catch (error) {
    console.error("Error fetching all borrowed books:", error);
    return [];
  }
};

export const getAllReservedBooks = async (): Promise<ReservedBook[]> => {
  try {
    const response = await fetch(`${API_URL}/reservations`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map API response to our ReservedBook type
    return data.map((item: any) => {
      // Extract first and last name from MemberName
      const nameParts = item.MemberName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const user: User = {
        id: `USER-${item.ReservationID}`, // Using ReservationID as user ID for now
        firstName,
        lastName,
        email: item.MemberEmail,
        joinDate: new Date(), // Default date
        isBanned: false
      };
      
      return {
        id: item.ReservationID.toString(),
        book: {
          id: "book-" + Math.floor(Math.random() * 1000),
          title: item.BookTitle,
          author: item.AuthorName,
          description: "Book description", // Default description
          coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
        },
        user,
        reservationDate: new Date(item.ReservationDate),
        expirationDate: new Date(new Date(item.ReservationDate).getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from reservation
      };
    });
  } catch (error) {
    console.error("Error fetching all reserved books:", error);
    return [];
  }
};

// The remaining functions use mock data for now
export const getAllUsers = (): User[] => {
  return mockUsers;
};

export const addNewUser = (firstName: string, lastName: string): User => {
  const newUser: User = {
    id: `USER-${Date.now()}`,
    firstName,
    lastName,
    joinDate: new Date(),
    isBanned: false
  };
  
  mockUsers.push(newUser);
  return newUser;
};

export const borrowBook = (userId: string, bookId: string): BorrowedBook | null => {
  const user = getUserById(userId);
  if (!user) return null;
  
  // In a real app, we would call the API to create a borrow record
  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days borrowing period
  
  // Simulating borrowing - in a real app we would fetch the book by ID
  const mockBook = {
    id: bookId,
    title: "Sample Book",
    author: "Sample Author",
    description: "This is a sample description for the borrowed book.",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3"
  };
  
  const newBorrow: BorrowedBook = {
    id: `BORROW-${Date.now()}`,
    book: mockBook,
    user,
    borrowDate,
    dueDate
  };
  
  return newBorrow;
};

export const reserveBook = (userId: string, bookId: string): ReservedBook | null => {
  const user = getUserById(userId);
  if (!user) return null;
  
  // In a real app, we would call the API to create a reservation
  const reservationDate = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); // 7 days reservation period
  
  // Simulating reservation - in a real app we would fetch the book by ID
  const mockBook = {
    id: bookId,
    title: "Sample Book",
    author: "Sample Author",
    description: "This is a sample description for the reserved book.",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3"
  };
  
  const newReservation: ReservedBook = {
    id: `RESERVE-${Date.now()}`,
    book: mockBook,
    user,
    reservationDate,
    expirationDate
  };
  
  return newReservation;
};

export const returnBook = (borrowId: string): BorrowedBook | null => {
  // In a real app, we would call the API to update the return date
  return null;
};
