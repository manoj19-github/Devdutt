import * as Z from "zod";

export const LoginSchema = Z.object({
  email: Z.string({ invalid_type_error: "Must be a string" })
    .email({
      message: "Email is invalid",
    })
    .refine(
      (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/gm.test(value ?? ""),
      "invalid email"
    ),
});

export const RegisterSchema = Z.object({
  email: Z.string({ invalid_type_error: "Must be a string" })
    .email({
      message: "Email is required",
    })
    .refine(
      (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/gm.test(value ?? ""),
      "invalid email"
    ),
  image: Z.string().min(5, {
    message: "image must be grater than 5 character",
  }),
  name: Z.string().min(1, { message: "Name must be grater than 6 character" }),
});

export const UpdateProfileSchema = Z.object({
  image: Z.string().optional(),
  email: Z.string({ invalid_type_error: "Must be a string" })
    .email({
      message: "Email is required",
    })
    .refine(
      (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/gm.test(value ?? ""),
      "invalid email"
    ),
  name: Z.string({ invalid_type_error: "Must be a string" }).min(5, {
    message: "Name must be grater than 5 character",
  }),
});