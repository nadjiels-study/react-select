"use client";

import BookForm from "@/book/form";
import type { Book } from "@/api/books/types";

const data: Book = {
  id: "3",
  name: "Echoes of Silence",
  description: "A gripping story of survival and hope.",
  publicationDate: "2015-11-10",
  authorId: "3",
  rating: 4.5
}

export default function CreateBook() {
  return <BookForm data={data} onValid={console.log} onInvalid={console.error} />
}
