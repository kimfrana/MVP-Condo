import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Toaster />
    <AppRoutes />
  </BrowserRouter>
);
