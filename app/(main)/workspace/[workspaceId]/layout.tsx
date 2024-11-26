import { auth } from "@/app/_config/auth.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { getAllOfMyWorkspaceById } from "@/app/serverActions/getWorkspaceById.serverAction";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import WorkspaceSidebar from "../_components/WorkspaceSidebar";

type WorkspaceIdLayoutProps = {
  children: ReactNode;
  params: {
    workspaceId: string;
  };
};

const WorkspaceIdLayout: FC<WorkspaceIdLayoutProps> = async ({
  children,
  params,
}): Promise<JSX.Element> => {
  const session = await auth();
  const respo = await getCurrentLoggedInUserServerAction();
  if (!session || !session.user) return redirect("/auth/login");
  if (!respo || !respo.user) return redirect("/auth/login");
  const currentWorkspace = await getAllOfMyWorkspaceById({
    workspaceId: params.workspaceId,
    currentUserId: respo.user.id,
  });
  if (!currentWorkspace.data) return redirect("/");

  return (
    <div className="h-full">
      <div className="hidden md:flex border h-full w-60 z-20 flex-col inset-y-0 fixed  ">
        <WorkspaceSidebar workspaceId={params.workspaceId} />
      </div>
      <main className="h-full md:pl-60"> {children}</main>
    </div>
  );
};

export default WorkspaceIdLayout;
