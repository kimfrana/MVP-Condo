import { Footer } from "@components/Footer";
import { SideBar } from "@components/SiderBar";
import { Outlet } from "react-router";

const PrivateLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-2 app-background">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
