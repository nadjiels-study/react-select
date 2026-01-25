import { delay } from "@/lib/util";
import authors from "@/api/authors";
import { createOption } from "@/lib/components/select/lib";
import type { Author } from "@/api/authors/types";

export async function loadAuthors(inputValue: string) {
  return delay(authors.getAll({
    search: inputValue,
    sort: { name: 1 },
  }), 3000).then(res => res.data);
}

export async function loadAuthor(id: string) {
  return delay(authors.get(id), 3000).then(res => res.data);
}

export async function createAuthor(inputValue: string) {
  await delay(authors.create({
    name: inputValue
  }), 3000).then(res => res.data);
}

export function authorToOption(author: Author) {
  return createOption(author.name, author.id.toString());
}
