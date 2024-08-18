"use client";
import { useSession } from "next-auth/react";
import React from "react";

const TestClientComponent = () => {
  const session = useSession();
  console.log("session: ", session);
  return <div>TestClientComponent</div>;
};

export default TestClientComponent;
