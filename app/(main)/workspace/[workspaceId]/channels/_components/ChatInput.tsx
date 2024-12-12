"use client";
import React, { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, SendHorizontal, Smile } from "lucide-react";
import { sendMessageHandler } from "@/app/_services/chat.service";
import { useModalStore } from "@/hooks/useModalStore";
import EmojiPicker from "../../../_components/EmojiPicker";
import { useRouter } from "next/navigation";
type ChatInputProps = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
  loggedInUserDetails: any;
};

const chatInputFormSchema = z.object({
  content: z.string().min(1),
});

const ChatInput: FC<ChatInputProps> = ({
  apiUrl,
  query,
  name,
  type,
  loggedInUserDetails,
}): JSX.Element => {
  const router = useRouter();
  const { onOpen } = useModalStore();
  const formHandler = useForm<z.infer<typeof chatInputFormSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(chatInputFormSchema),
  });
  const isLoading = formHandler.formState.isSubmitting;
  const onSubmitHandler = async (
    value: z.infer<typeof chatInputFormSchema>
  ) => {
    formHandler.reset();
    sendMessageHandler({
      apiUrl,
      query,
      content: value.content,
      loggedInUserDetails,
      successCallback: (data) => {
        console.log("success message: ", data);

        // router.refresh();
      },
    });
  };
  const KeyDownHandler=(event:any)=>{
  
    const content = formHandler.watch("content");
    if(event.key==="Enter" && event.keyCode===13 && !!content && content.trim().length>0){
      event.preventDefault();
      event.stopPropagation();
      formHandler.reset();
      sendMessageHandler({
        apiUrl,
        query,
        content,
        loggedInUserDetails,
        successCallback: (data) => {
          console.log("success message: ", data);
        },
      });

    }

  }
  return (
    <Form {...formHandler}>
      <form className="bottom-0 fixed w-[80.7%]">
        <FormField
          control={formHandler.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-3 pb-4 ">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen("messageFile", {
                        apiUrl,
                        query,
                        loggedInUserDetails,
                      })
                    }
                    className="absolute top-5 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-300 transition-all rounded-full p-1 flex items-center justify-center  "
                  >
                    <Plus className="size-4 text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : `# ${name}`
                    }`}
                    {...field}
                    onKeyDown={KeyDownHandler}
                    className="px-12 py-5 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-5 right-[2%] ">
                    <SendHorizontal
                      className="size-5 cursor-pointer"
                      onClick={formHandler.handleSubmit(onSubmitHandler)}
                    />
                  </div>
                  <div className="absolute top-5 right-[4%]">
                    {/* <Smile className="size-5 cursor-pointer" /> */}
                    <EmojiPicker
                      onChange={(value: string) => {
                        field.onChange(`${field.value} ${value}`);
                      }}
                    />
                  </div>
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
