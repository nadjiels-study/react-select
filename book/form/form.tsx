"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@/lib/components/select";
import { loadAuthors, authorToOption, createAuthor, defaultValues, loadAuthor } from "./lib";
import Schema from "./schema";
import type { Props, SchemaInput, SchemaOutput } from "./types";
import type { DefaultGroup, DefaultOption } from "@/lib/components/select/types";

export default function Form({
  data,
  onValid,
  onInvalid,
}: Props) {
  const form = useForm<SchemaInput, unknown, SchemaOutput>({
    resolver: zodResolver(Schema),
    defaultValues: data,
  });

  return (
    <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="flex flex-col gap-2 m-2">
      <h1>Create a new book!</h1>
      <input
        id="id"
        type="hidden"
        {...form.register("id")}
      />
      <div className="flex flex-col">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className="border"
          {...form.register("name")}
        />
        <span>{form.formState.errors.name?.message}</span>
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="border"
          {...form.register("description")}
        />
        <span>{form.formState.errors.description?.message}</span>
      </div>
      <div className="flex flex-col">
        <label htmlFor="publicationDate">Publication</label>
        <input
          id="publicationDate"
          type="date"
          className="border"
          {...form.register("publicationDate")}
        />
        <span>{form.formState.errors.publicationDate?.message}</span>
      </div>
      <div className="flex flex-col">
        <label htmlFor="authorId">Author</label>
        <Controller
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <Select<DefaultOption, false, DefaultGroup>
              inputId="authorId"
              loadOptions={inputValue => loadAuthors(inputValue).then(res => res.map(authorToOption))}
              onCreateOption={createAuthor}
              className="text-black"
              disabled={field.disabled}
              name={field.name}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={newValue => field.onChange(newValue?.value)}
              loadDefaultValue={field.value ? (() => loadAuthor(field.value!).then(authorToOption)) : undefined}
            />
          )}
        />
        <span>{form.formState.errors.authorId?.message}</span>
      </div>
      {/* <div className="flex flex-col">
        <label htmlFor="authorId">Author</label>
        <Select
          inputId="authorId"
          loadOptions={inputValue => loadAuthors(inputValue).then(res => res.map(authorToOption))}
          onCreateOption={createAuthor}
          className="text-black"
          {...form.register("authorId")}
        />
        <span>{form.formState.errors.authorId?.message}</span>
      </div> */}
      <div className="flex flex-col">
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          type="number"
          step={0.1}
          className="border"
          {...form.register("rating")}
        />
        <span>{form.formState.errors.rating?.message}</span>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
