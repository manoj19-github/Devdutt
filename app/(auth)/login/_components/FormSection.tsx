"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Typography from "@/lib/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, Fragment, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { z } from "zod";

type FormSectionProps = {};
const FormSection: FC<FormSectionProps> = (): JSX.Element => {
  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  const FormHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmitHandler = (values: any) => {
    console.log(values);
  };
  return (
    <Form {...FormHandler}>
      <form onSubmit={FormHandler.handleSubmit(onSubmitHandler)}>
        <fieldset>
          <FormField
            control={FormHandler.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl className="flex justify-start">
                  <Input placeholder="JohnDoe@gmail.com" {...field} />
                </FormControl>
                <FormMessage className="flex flex-start justify-start" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-2 lg:mt-4">
            <Typography className="text-xl" component={"p"}>
              Sign in with email
            </Typography>
          </Button>
          <div className="py-4 px-3 bg-gray-100 rounded-md mt-2">
            <div className="text-gray-500 flex items-center space-x-3">
              <MdOutlineAutoAwesome />
              <Typography className="text-gray-500" component={"p"}>
                We will email you a magic link for password-free sign-in
              </Typography>
            </div>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default FormSection;
