
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

export const cancelReservation = async (reservationId: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:9000/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel reservation');
    }

    return true;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
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
    const response = await fetch(`${API_URL}/borrows`);
    
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
        id: item.MemberID.toString(), // Using actual MemberID from the database
        firstName,
        lastName,
        email: item.MemberEmail,
        joinDate: new Date(), // You might want to get this from the Members table
        isBanned: false // You might want to get this from the Members table
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
      };
    });
  } catch (error) {
    console.error("Error fetching all reserved books:", error);
    return [];
  }
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
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    borrowDate,
    dueDate,
    returnDate: undefined
  };
  
  return newBorrow;
};

export const reserveBook = async (userId: string, bookId: string): Promise<ReservedBook | null> => {
  try {
    const user = await getUserById(userId);
    if (!user) return null;
    
    // In a real app, you would call your reservation API here
    const reservationDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days reservation period
    
    // This should be replaced with actual book data from your API
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
      user, // Now properly typed as User
      reservationDate,
      expirationDate
    };
    
    return newReservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    return null;
  }
};
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('http://localhost:9000/allUser');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | undefined> => {
  try {
    const response = await fetch(`http://localhost:9000/users/${userId}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};