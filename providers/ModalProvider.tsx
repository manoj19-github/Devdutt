"use client";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import CreateServerModal from "@/components/modals/CreateWorkspaceModal";
import DeleteChannelModal from "@/components/modals/DeleteChannelModal";
import DeleteWorkspaceModal from "@/components/modals/DeleteWorkspaceModal";
import EditChannelModal from "@/components/modals/EditChannekModal";
import EditWorkspaceModal from "@/components/modals/EditWorkspaceModal";
import InviteMemberModal from "@/components/modals/InviteMemberModal";
import LeaveWorkspaceModal from "@/components/modals/LeaveWorkspaceModal";
import MemberModel from "@/components/modals/MemberModel";
import MessageFileModal from "@/components/modals/MessageFileModal";
import useIsMounted from "@/hooks/useIsMounted";
import React, { FC, Fragment } from "react";

type ModalProviderProps = {};
const ModalProvider: FC<ModalProviderProps> = (): JSX.Element => {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;
  return (
    <Fragment>
      <CreateServerModal />
      <InviteMemberModal />
      <EditWorkspaceModal />
      <MemberModel />
      <CreateChannelModal />
      <LeaveWorkspaceModal />
      <DeleteWorkspaceModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
    </Fragment>
  );
};

export default ModalProvider;
