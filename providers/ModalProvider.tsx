"use client";
import CreateServerModal from "@/components/modals/CreateServerModal";
import InviteMemberModal from "@/components/modals/InviteMemberModal";
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
    </Fragment>
  );
};

export default ModalProvider;
