import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "../app/_config/auth.config";
import TestClientComponent from "../components/TestClientComponent";
export default async function Home() {
  const session = await auth();
  console.log("session: ", session);
  return (
    <div>
      <Button>hello manojfff</Button>
      <TestClientComponent />
    </div>
  );
}
