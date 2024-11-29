import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { v4 as uuid } from "uuid";
import { LoginSchema } from "@/validationSchema/auth.schema";
import { auth, signIn } from "@/app/_config/auth.config";
import { redirect } from "next/navigation";
import { MemberRole } from "@prisma/client";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { dbConfig } from "@/app/_config/db.config";
import { generateUniqueUUID } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: { workspaceById: string } }
) {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();

    if (loggedInUserDetails.user === null || !session || session.user === null)
      return new NextResponse("You are not logged in ", { status: 400 });
    if (!loggedInUserDetails.member)
      return new NextResponse("sorry you are not a member of this workspace", {
        status: 400,
      });
    const workspaces = await dbConfig.workspaces.findFirst({
      where: {
        id: params.workspaceById,
        members: {
          some: {
            userId: loggedInUserDetails.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    const memberExists = workspaces?.members.find(
      (self) => self.id === loggedInUserDetails?.member?.id
    );

    if (!workspaces || !memberExists || !memberExists?.role)
      return new NextResponse("Workspace not found", { status: 400 });
    const memberRole: MemberRole | undefined = memberExists?.role;
    if (!memberRole || memberRole === MemberRole.GUEST)
      return new NextResponse("Sorry you are not allowed", { status: 400 });

    const inviteCodes = await dbConfig.workspaces.findMany({
      select: {
        invite_code: true,
      },
    });
    const filteredInviteCodes: Array<string> = inviteCodes
      .filter((self) => self.invite_code !== null)
      .map((_self) => String(_self.invite_code));
    const invite_code = generateUniqueUUID(filteredInviteCodes);
    const workspace = await dbConfig.workspaces.update({
      where: {
        id: workspaces?.id,
      },
      data: {
        invite_code,
      },
    });
    return NextResponse.json(workspace, {
      status: 200,
    });
  } catch (error) {
    return redirect("/");
  }
}
