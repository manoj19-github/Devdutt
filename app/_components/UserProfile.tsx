"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { FC } from "react";

type UserProfileProps = {};
const UserProfile: FC<UserProfileProps> = (): JSX.Element => {
  const session = useSession();
  console.log("session: ", session?.data?.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-10 rounded-full overflow-hidden relative cursor-pointer">
          <Image
            fill
            src={session?.data?.user?.image || "/avatar.png"}
            alt="user"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex flex-col gap-2  w-[160px] py-3  bg-white dark:bg-black">
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-gray-700 dark:text-white  flex outline-none px-2 space-between w-full cursor-pointer"
          >
            <LogOut className="mr-2 text-gray-700 dark:text-white" />
            <p>Logout</p>
          </DropdownMenuItem>
        </div>

        {/* <DropdownMenuItem>Light</DropdownMenuItem>
        <DropdownMenuItem>Dark</DropdownMenuItem>
        <DropdownMenuItem>System</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
