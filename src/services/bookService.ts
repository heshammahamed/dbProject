
import { Book } from "@/types/book";
import { BorrowedBook } from "@/types/borrowing";
const API_URL = "http://localhost:9000";

export const getAllBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  try {
    const response = await fetch('http://localhost:9000/borrows');
    if (!response.ok) {
      throw new Error('Failed to fetch borrowed books');
    }
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.BorrowID.toString(),
      book: {
        id: item.BookID.toString(),
        title: item.BookTitle,
        author: item.AuthorName
      },
      user: {
        id: item.MemberID.toString(),
        firstName: item.MemberName.split(' ')[0],
        lastName: item.MemberName.split(' ')[1] || '',
        email: item.MemberEmail
      },
      borrowDate: new Date(item.BorrowDate),
      dueDate: new Date(item.DueDate),
      returnDate: item.ReturnDate ? new Date(item.ReturnDate) : null
    }));
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    throw error;
  }
};

export const returnBook = async (borrowId: string): Promise<BorrowedBook | null> => {
  try {
    const response = await fetch(`http://localhost:9000/borrows/${borrowId}/return`, {
      method: 'PATCH'
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark book as returned');
    }
    
    const data = await response.json();
    return {
      id: data.BorrowID.toString(),
      book: {
        id: data.BookID.toString(),
        title: data.BookTitle,
        author: data.AuthorName
      },
      user: {
        id: data.MemberID.toString(),
        firstName: data.MemberName.split(' ')[0],
        lastName: data.MemberName.split(' ')[1] || '',
        email: data.MemberEmail
      },
      borrowDate: new Date(data.BorrowDate),
      dueDate: new Date(data.DueDate),
      returnDate: new Date(data.ReturnDate)
    };
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};
// Function to search for books
export const searchBooks = async (query: string): Promise<Book[]> => {
  console.log("Searching for books with query:", query);
  
  if (!query) {
    return [];
  }
  
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data)
    // Map API response to our Book type
    return data.map((book: any) => ({
      id: book.BookID.toString(),
      title: book.Title,
      author: book.AuthorName,
      description: book.Description, // Using category as description for now
      coverImage: "", // Default image
      publishedYear: new Date().getFullYear(), // Default year
      genre: book.CategoryName,
      copies: {
        total: book.TotalCopies,
        available: book.AvailableCopies
      }
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Add a new book function
export const addBook = async (bookData: {
  title: string;
  authorId: string;
  categoryId: string;
  totalCopies: number;
  PublicationDate: string;
  Description: string;
}): Promise<Book> => {
  console.log(bookData.PublicationDate)
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: data.id.toString(),
      title: data.Title,
      author: data.AuthorName,
      description: data.Description, // Fixed to use Description from backend
      coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
      publishedYear: new Date(data.PublicationDate).getFullYear(), // Use the actual publication date
      genre: data.CategoryName,
      copies: {
        total: data.TotalCopies,
        available: data.AvailableCopies
      }
    };
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};


// Update a book
export const updateBook = async (
  id: string, 
  bookData: {
    title: string;
    authorName: number;
    categoryName: number;
    totalCopies: number;
    publicationDate : string;
    description: string;
  }
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: data.BookID.toString(),
      title: data.Title,
      author: data.AuthorName,
      description: data.Description,
      coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
      publishedYear: new Date().getFullYear(),
      genre: data.CategoryName,
      copies: {
        total: data.TotalCopies,
        available: data.AvailableCopies
      }
    };
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
