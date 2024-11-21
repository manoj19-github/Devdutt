import { FC, ReactNode } from "react";
import NavigationSidebar from "../_components/NavigationSidebar";

type MainLayoutProps = {
  children: ReactNode;
};
const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[58px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[58px] h-full ">{children}</main>
    </div>
  );
};

export default MainLayout;
