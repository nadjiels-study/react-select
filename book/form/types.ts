import z from "zod";
import Schema from "./schema";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import type { Book } from "@/api/books/types";

export type SchemaInput = z.input<typeof Schema>;

export type SchemaOutput = z.output<typeof Schema>;

export interface Props {
  data?: Book;
  onValid: SubmitHandler<SchemaOutput>;
  onInvalid?: SubmitErrorHandler<SchemaInput>;
}
