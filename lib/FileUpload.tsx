"use client";
import React, { FC, Fragment, useRef } from "react";
import {
  UploadButton,
  UploadDropzone,
} from "../app/_config/uploadthing.config";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import toast from "react-hot-toast";
interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
  isLoading: boolean;
  noPreview?: boolean;
}
const FileUpload: FC<FileUploadProps> = ({
  onChange,
  value,
  endpoint,
  isLoading,
  noPreview,
}): JSX.Element => {
  console.log("value >>>>>>>>>>>>>>>>>>>> ", value);
  const fileRef = useRef();

  const fileType = value?.split(".").pop();
  console.log("fileType: ", fileType);
  if (value && fileType !== "pdf" && !noPreview) {
    console.log("image hit >>>>>");

    return (
      <div
        className="relative  border border-green-500 w-[100px] h-[100px] "
        key={value}
      >
        <img
          src={value}
          alt="upload"
          className="w-[100px] h-[100px] object-cover rounded-full"
        />
        <p className="text-right text-[30px]">{isLoading}</p>
        {/* <Image src={value} sizes="" fill alt="upload" className="rounded-full" /> */}
        {!isLoading ? (
          <button
            className="absolute top-0   text-white rounded-full shadow-sm  z-[999] "
            style={{ backgroundColor: "red", right: "20px" }}
            type="button"
            onClick={() => onChange("")}
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <Fragment></Fragment>
        )}
      </div>
    );
  }
  if (!!value && fileType === "pdf" && !noPreview) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indogo-500 dark:indigo-400 hover:underline"
        >
          {value}
        </a>
        {!isLoading ? (
          <button
            className="absolute p-1 text-white rounded-full shadow-sm -top-2 -right-2 bg-red-500"
            type="button"
            onClick={() => onChange("")}
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <Fragment></Fragment>
        )}
      </div>
    );
  }
  return (
    <div>
      <UploadButton
        content={{
          button({ ready }) {
            if (ready) return <div>Upload photo</div>;
            return "Uploading ...";
          },
        }}
        endpoint={endpoint}
        onChange={() => startLoader()}
        onClientUploadComplete={(res) => onChange(res?.[0].url)}
        onUploadError={(error: any) => {
          toast.error("Error uploading file");
        }}
      />
    </div>
  );
};

export default FileUpload;
