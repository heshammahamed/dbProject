
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publishedYear?: number;
  genre?: string;
  copies?: number;
}
