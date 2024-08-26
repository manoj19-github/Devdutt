import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "../app/_config/auth.config";
import TestClientComponent from "../components/TestClientComponent";
import UserInfoSetup from "./_components/UserInfoSetup";
export default async function Home() {
  const session = await auth();
  console.log("session:55 ", session);
  if (
    (!!session && session.user && !session.user.name) ||
    (!!session && session.user && !session.user.image)
  )
    return <UserInfoSetup />;

  return (
    <div>
      {JSON.stringify(session)}
      <TestClientComponent />
    </div>
  );
}
