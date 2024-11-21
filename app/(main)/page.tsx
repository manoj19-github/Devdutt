import TestClientComponent from "@/components/TestClientComponent";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UserInfoSetup from "../_components/UserInfoSetup";
import { auth } from "../_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "../serverActions/auth.serverAction";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const respo = await getCurrentLoggedInUserServerAction();
  console.log("respo: ", respo);

  if (!!session && session.user && !session.user.name) return <UserInfoSetup />;
  if (!!respo && respo.user && respo.user && !respo.firstServer)
    redirect("/create-workspace");
  if (!!respo && respo.user && respo.firstServer) {
    redirect(`/workspace/${respo.firstServer.id}`);
  }

  return (
    <div>
      {JSON.stringify(session)}
      <TestClientComponent />
    </div>
  );
}
