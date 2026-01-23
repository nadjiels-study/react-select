
export interface Author {
  id: number;
  name: string;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
}

export type CreateAuthorData = Partial<Author> & Pick<Author, "name">;
