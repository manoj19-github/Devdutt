"use client";
import { Badge } from "@/components/ui/Badge";
import { useSocket } from "@/providers/SocketProvider";
import React, { FC } from "react";

type SocketIndicatorProps = {};
const SocketIndicator: FC<SocketIndicatorProps> = (): JSX.Element => {
  const { isConnected } = useSocket();
  if (!isConnected)
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-500 text-white border-none"
      >
        Fallback: Polling every 1 s
      </Badge>
    );
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-500 text-white border-none"
    >
      Live: Real time update
    </Badge>
  );
};

export default SocketIndicator;
