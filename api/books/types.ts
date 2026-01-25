export interface Book {
  id: string;
  name: string;
  description: string;
  publicationDate: string;
  authorId: string;
  rating: number;
}

export type CreateBookData = Omit<Book, "id">;

export type UpdateBookData = Partial<Book>;
