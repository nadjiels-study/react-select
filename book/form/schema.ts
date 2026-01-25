import z from "zod";

const Schema = z.object({
  id: z
    .string()
    .optional(),
  name: z
    .string()
    .min(1, "Name is mandatory!")
    .max(20, "Name too long!"),
  description: z
    .string()
    .max(50, "Name too long!")
    .optional(),
  publicationDate: z.string(),
  authorId: z
    .string()
    .optional(),
  rating: z
    .coerce
    .number(),
});

export default Schema;
