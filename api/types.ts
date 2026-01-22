export interface Book {
  id: number;
  name: string;
  description: string;
  publicationDate: string;
  authorId: string;
  rating: number;
}

export interface Author {
  id: number;
  name: string;
  birthDate: string;
  deathDate: string | null;
  biography: string;
}
