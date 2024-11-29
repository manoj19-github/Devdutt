import { auth } from "@/app/_config/auth.config";
import { dbConfig } from "@/app/_config/db.config";
import { getCurrentLoggedInUserServerAction } from "@/app/serverActions/auth.serverAction";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (
      !loggedInUserDetails ||
      loggedInUserDetails.user === null ||
      loggedInUserDetails.member === null ||
      !session ||
      session.user === null
    )
      return new NextResponse("You are not logged in ", { status: 400 });
    const { searchParams } = new URL(request.url);
    const { role } = await request.json();
    const { memberId } = params;
    const workspaceId = searchParams.get("workspaceId");
    if (!memberId || memberId === "")
      return new NextResponse("Member Id is required", { status: 400 });
    if (!workspaceId)
      return new NextResponse("Workspace Id is required", { status: 400 });
    if (!role) return new NextResponse("Role is required", { status: 400 });
    //************  check if user is admin of workspace
    const selectedWorkspace = await dbConfig.workspaces.findFirst({
      where: {
        id: workspaceId,
        userId: loggedInUserDetails.user?.id,
      },
      include: {
        members: true,
      },
    });
    if (!selectedWorkspace)
      return new NextResponse("Workspace not found", { status: 400 });
    const isAdminUser =
      selectedWorkspace?.members.find(
        (member) => member.userId === loggedInUserDetails.user?.id
      )?.role === MemberRole.ADMIN;
    if (!isAdminUser)
      return new NextResponse("You are not admin of the workspace", {
        status: 400,
      });
    if (memberId === loggedInUserDetails.member.id)
      return new NextResponse("You can't update your own role", {
        status: 400,
      });
    const updatedWorkspace = await dbConfig.workspaces.update({
      where: {
        id: selectedWorkspace.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role: role as MemberRole,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(
      {
        workspace: updatedWorkspace,
        message: "Member role updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("MemberId patch", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await auth();
    const loggedInUserDetails = await getCurrentLoggedInUserServerAction();
    if (
      !loggedInUserDetails ||
      loggedInUserDetails.user === null ||
      loggedInUserDetails.member === null ||
      !session ||
      session.user === null
    )
      return new NextResponse("You are not logged in ", { status: 400 });
    const { searchParams } = new URL(request.url);
    const { memberId } = params;
    const workspaceId = searchParams.get("workspaceId");
    if (!memberId || memberId === "")
      return new NextResponse("Member Id is required", { status: 400 });
    if (!workspaceId)
      return new NextResponse("Workspace Id is required", { status: 400 });
    //************  check if user is admin of workspace
    const selectedWorkspace = await dbConfig.workspaces.findFirst({
      where: {
        id: workspaceId,
        userId: loggedInUserDetails.user?.id,
      },
      include: {
        members: true,
      },
    });
    if (!selectedWorkspace)
      return new NextResponse("Workspace not found", { status: 400 });
    const isAdminUser =
      selectedWorkspace?.members.find(
        (member) => member.userId === loggedInUserDetails.user?.id
      )?.role === MemberRole.ADMIN;
    if (!isAdminUser)
      return new NextResponse("You are not admin of the workspace", {
        status: 400,
      });
    if (memberId === loggedInUserDetails.member.id)
      return new NextResponse("You can't delete your own membership", {
        status: 400,
      });
    const updatedWorkspace = await dbConfig.workspaces.update({
      where: {
        id: workspaceId,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
          },
        },
      },
    });
    return NextResponse.json(
      {
        workspace: updatedWorkspace,
        message: "Member deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("MemberId delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
