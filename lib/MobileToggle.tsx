import { Menu } from "lucide-react";
import React, { FC } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/app/_components/NavigationSidebar";
import WorkspaceSidebar from "@/app/(main)/workspace/_components/WorkspaceSidebar";
type MobileToggleProps = {
  workspaceId: string;
};
const MobileToggle: FC<MobileToggleProps> = ({ workspaceId }): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mobileToggle">
          <Menu className="size-5 " />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <WorkspaceSidebar workspaceId={workspaceId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
