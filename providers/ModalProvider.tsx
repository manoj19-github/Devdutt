"use client";
import CreateServerModal from "@/components/modals/CreateServerModal";
import EditWorkspaceModal from "@/components/modals/EditWorkspaceModal";
import InviteMemberModal from "@/components/modals/InviteMemberModal";
import MemberModel from "@/components/modals/MemberModel";
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
    </Fragment>
  );
};

export default ModalProvider;
