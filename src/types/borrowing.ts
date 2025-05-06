
import { Book } from "./book";
import { User } from "./user";

export interface BorrowedBook {
  id: string;
  book: Book;
  user: User;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
}

export interface ReservedBook {
  id: string;
  book: Book;
  user: User;
  reservationDate: Date;
  expirationDate: Date;
}
