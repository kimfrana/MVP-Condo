import { House, LogOut, Mic } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "./Button";
import { useNotification } from "@hooks/useNotification";

export const SideBar = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const handleLogout = () => {
    localStorage.removeItem("user");
    notify("Até a próxima", "success");
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-zinc-950 p-6 flex flex-col justify-between">
      <nav className="space-y-5 mt-2">
        <a
          href=""
          className="flex items-center gap-3 text-sm font-semibold text-zinc-200 "
        >
          <House />
          <h4>Inicio</h4>
        </a>
        <a
          href=""
          className="flex items-center gap-3 text-sm font-semibold text-zinc-200 "
        >
          <Mic />
          <h4>Transcição de Audio</h4>
        </a>
      </nav>
      <Button
        onClick={handleLogout}
        className="flex items-center gap-3 text-sm font-semibold"
      >
        <LogOut />
        <h4>Sair</h4>
      </Button>
    </aside>
  );
};
