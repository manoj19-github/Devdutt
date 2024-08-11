"use client";
import Typography from "@/lib/Typography";
import { useAPPLoader } from "@/store/useAPPLoader";
import React, { FC } from "react";

type PageLoaderProps = {};
const PageLoader: FC<PageLoaderProps> = () => {
  const { message, loading } = useAPPLoader();
  if (!loading) return <></>;
  return (
    <div className="w-screen h-screen  fixed top-0 left-0 bottom-0 right-0 z-[999] bg-[rgba(0,0,0,0.5)]">
      <div className="absolute p-2 top-[45%] left-[45%] ">
        <div className="w-[90px] h-[90px] rounded-full border-4 border-white border-t-transparent animate-spin"></div>
        <div className="w-[69px] h-[69px] rounded-full  border-4 border-white border-b-transparent absolute top-[18%] left-[18%] animate-t-spin " />
        {/* <div className="w-[50px] h-[50px] rounded-full  border-4 border-white border-b-transparent absolute top-[27%] left-[28%] animate-spin " /> */}
      </div>
      <div className="absolute top-[60%] flex justify-center items-center w-full">
        <Typography component={"h1"} className="text-4xl text-white">
          {message}
        </Typography>
      </div>
    </div>
  );
};

export default PageLoader;
