
import { Book } from "@/types/book";

const API_URL = "http://localhost:9000";

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
    
    // Map API response to our Book type
    return data.map((book: any) => ({
      id: book.BookID.toString(),
      title: book.Title,
      author: book.AuthorName,
      description: book.CategoryName, // Using category as description for now
      coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg", // Default image
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
  authorId: number;
  categoryId: number;
  totalCopies: number;
}): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
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
      description: data.CategoryName,
      coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg", // Default image
      publishedYear: new Date().getFullYear(),
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
    authorId: number;
    categoryId: number;
    totalCopies: number;
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
      description: data.CategoryName,
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
