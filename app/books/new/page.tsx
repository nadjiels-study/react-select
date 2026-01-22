"use client";

import ReactSelect from "react-select";
import Select from "@/lib/components/select";
import authors from "@/api/authors";

async function loadAuthors() {
  return authors.getAll().then(res => res.data);
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
          loadOptions={loadAuthors}
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
