import Link from "next/link";
import React, { FC } from "react";

type InfoSidebarProps = {
  params: {
    workspaceId: string;
    channelId?: string;
  };
};
const InfoSidebar: FC<InfoSidebarProps> = ({ params }): JSX.Element => {
  const baseURL = `/workspace/${params.workspaceId}/channels/${params.channelId}/info`;
  return (
    <aside className="info-sidebar">
      <nav className="info-sidebar-nav">
        <ul className="flex flex-col gap-6">
          {/* {InfoNavItems.map((self,index)=>{
        const active = 


      })} */}
        </ul>
      </nav>
    </aside>
  );
};

export default InfoSidebar;
