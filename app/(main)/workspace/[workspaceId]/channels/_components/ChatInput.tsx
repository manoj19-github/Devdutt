"use client";
import React, { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
type ChatInputProps = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
};

const chatInputFormSchema = z.object({
  content: z.string().min(1),
});

const ChatInput: FC<ChatInputProps> = ({
  apiUrl,
  query,
  name,
  type,
}): JSX.Element => {
  const formHandler = useForm<z.infer<typeof chatInputFormSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(chatInputFormSchema),
  });
  const isLoading = formHandler.formState.isSubmitting;
  const onSubmitHandler = async (value: z.infer<typeof formHandler>) => {
    console.log("====================================");
    console.log("val;ue >>>>>> ", value);
    console.log("====================================");
  };
  return (
    <Form {...formHandler}>
      <form
        onSubmit={formHandler.handleSubmit(onSubmitHandler)}
        className="bottom-0 fixed w-[80.7%]"
      >
        <FormField
          control={formHandler.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-3 pb-4 ">
                  <button
                    type="button"
                    className="absolute top-5 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-300 transition-all rounded-full p-1 flex items-center justify-center  "
                  >
                    <Plus className="size-4 text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    {...field}
                    className="px-12 py-5 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
