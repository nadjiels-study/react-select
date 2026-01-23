"use client";

import ReactSelect from "react-select";
import Select from "@/lib/components/select";
import { delay } from "@/lib/util";
import authors from "@/api/authors";
import { createOption } from "@/lib/components/select/lib";
import type { Author } from "@/api/authors/types";

async function loadAuthors(inputValue: string) {
  return delay(authors.getAll({
    search: inputValue,
    sort: { name: 1 },
  }), 3000).then(res => res.data);
}

async function createAuthor(inputValue: string) {
  return delay(authors.create({
    name: inputValue
  }), 3000).then(res => res.data);
}

function authorToOption(author: Author) {
  return createOption(author.name, author.id.toString());
}

export default function BooksCreate() {
  return (
    <form className="flex flex-col gap-2 m-2">
      <h1>Create a new book!</h1>
      <div className="flex flex-col">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" className="border" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="border"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="publicationDate">Publication</label>
        <input
          id="publicationDate"
          name="publicationDate"
          type="date"
          className="border"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="authorId">Author</label>
        <Select
          inputId="authorId"
          name="authorId"
          loadOptions={inputValue => loadAuthors(inputValue).then(res => res.map(authorToOption))}
          onCreateOption={createAuthor}
          className="text-black"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          name="rating"
          type="number"
          className="border"
        />
      </div>
    </form>
  )
}
