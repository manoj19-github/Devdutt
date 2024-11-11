import React, { FC, ReactNode } from "react";

type WorkspaceLayoutProps = {
  children: ReactNode;
};
const WorkspaceLayout: FC<WorkspaceLayoutProps> = ({
  children,
}): JSX.Element => {
  return <div>{children}</div>;
};

export default WorkspaceLayout;
