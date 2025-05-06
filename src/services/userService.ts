
import { User } from "@/types/user";
import { BorrowedBook, ReservedBook } from "@/types/borrowing";

// Mock data for users
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

// Mock data for borrowed books
const mockBorrowedBooks: BorrowedBook[] = [
  {
    id: "BORROW-001",
    book: {
      id: "book1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A story of wealth, love, and tragedy in the Roaring Twenties.",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      publishedYear: 1925,
      genre: "Classic"
    },
    user: mockUsers[0],
    borrowDate: new Date("2023-11-15"),
    dueDate: new Date("2023-12-15")
  },
  {
    id: "BORROW-002",
    book: {
      id: "book3",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A story of racial injustice and moral growth in the American South.",
      coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      publishedYear: 1960,
      genre: "Fiction"
    },
    user: mockUsers[1],
    borrowDate: new Date("2023-10-10"),
    dueDate: new Date("2023-11-10"),
    returnDate: new Date("2023-11-05")
  }
];

// Mock data for reserved books
const mockReservedBooks: ReservedBook[] = [
  {
    id: "RESERVE-001",
    book: {
      id: "book2",
      title: "1984",
      author: "George Orwell",
      description: "A dystopian novel about totalitarianism and surveillance.",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop&ixlib=rb-4.0.3",
      publishedYear: 1949,
      genre: "Dystopian"
    },
    user: mockUsers[0],
    reservationDate: new Date("2023-11-20"),
    expirationDate: new Date("2023-11-27")
  }
];

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

export const getUserBorrowedBooks = (userId: string): BorrowedBook[] => {
  return mockBorrowedBooks.filter(item => item.user.id === userId);
};

export const getUserReservedBooks = (userId: string): ReservedBook[] => {
  return mockReservedBooks.filter(item => item.user.id === userId);
};

export const getAllBorrowedBooks = (): BorrowedBook[] => {
  return mockBorrowedBooks;
};

export const getAllReservedBooks = (): ReservedBook[] => {
  return mockReservedBooks;
};

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
  
  // In a real app, check if book is available and update copies
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
  
  mockBorrowedBooks.push(newBorrow);
  return newBorrow;
};

export const reserveBook = (userId: string, bookId: string): ReservedBook | null => {
  const user = getUserById(userId);
  if (!user) return null;
  
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
  
  mockReservedBooks.push(newReservation);
  return newReservation;
};

export const returnBook = (borrowId: string): BorrowedBook | null => {
  const index = mockBorrowedBooks.findIndex(item => item.id === borrowId);
  if (index === -1) return null;
  
  mockBorrowedBooks[index].returnDate = new Date();
  return mockBorrowedBooks[index];
};
