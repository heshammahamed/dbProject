
import { Book } from "./book";
import { User } from "./user";

export interface BorrowedBook {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
}

export interface ReservedBook {
  id: string;
  book: Book;
  user: User;
  reservationDate: Date;
  expirationDate: Date;
}
