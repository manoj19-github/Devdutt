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
  email: Z.string({ invalid_type_error: "Must be a string" }).email({
    message: "Email is required",
  }),
  password: Z.string().min(6, {
    message: "Password must be grater than 6 character",
  }),
  name: Z.string().min(1, { message: "Name must be grater than 6 character" }),
});
