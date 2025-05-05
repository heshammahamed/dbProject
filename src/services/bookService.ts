
import { Book } from "@/types/book";

// Mock data for initial development
const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A novel about the decadence and excess of the Jazz Age, as told through the tragic story of Jay Gatsby and his pursuit of Daisy Buchanan.",
    coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
    publishedYear: 1925,
    genre: "Classic Fiction"
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The story of racial injustice and the loss of innocence in a small Southern town, seen through the eyes of a young girl named Scout Finch.",
    coverImage: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
    publishedYear: 1960,
    genre: "Classic Fiction"
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel set in a totalitarian society where critical thought is suppressed, independent thinking is outlawed, and mass surveillance rules.",
    coverImage: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
    publishedYear: 1949,
    genre: "Dystopian Fiction"
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "The adventure of Bilbo Baggins, a home-loving hobbit who is swept into a quest to reclaim the dwarves' treasure from the dragon Smaug.",
    coverImage: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
    publishedYear: 1937,
    genre: "Fantasy"
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "The story of Elizabeth Bennet and her complicated relationship with the proud, wealthy, and seemingly rude Mr. Darcy.",
    coverImage: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
    publishedYear: 1813,
    genre: "Classic Romance"
  },
  {
    id: "6",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "The first novel in the Harry Potter series, which follows the life of a young wizard, Harry Potter, and his friends at the Hogwarts School of Witchcraft and Wizardry.",
    coverImage: "https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg",
    publishedYear: 1997,
    genre: "Fantasy"
  }
];

// Function to simulate searching for books
export const searchBooks = async (query: string): Promise<Book[]> => {
  console.log("Searching for books with query:", query);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) {
    return [];
  }
  
  // Filter books based on query (case-insensitive search on title, author, and description)
  const lowerCaseQuery = query.toLowerCase();
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(lowerCaseQuery) ||
    book.author.toLowerCase().includes(lowerCaseQuery) ||
    book.description.toLowerCase().includes(lowerCaseQuery) ||
    (book.genre && book.genre.toLowerCase().includes(lowerCaseQuery))
  );
};
