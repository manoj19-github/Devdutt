import * as Z from "zod";

export const LoginSchema = Z.object({
  email: Z.string({ invalid_type_error: "Must be a string" }).email({
    message: "Email is required",
  }),
  password: Z.string().min(1, { message: "Password is required" }),
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
