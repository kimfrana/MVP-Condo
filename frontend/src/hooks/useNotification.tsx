import toast, { type ToastOptions } from "react-hot-toast";

type NotifyType = "success" | "error" | "message";

export const useNotification = () => {
  const options = {
    duration: 3000,
    position: "top-right",
    removeDelay: 200
  } as ToastOptions;

  const notify = (mensagem: string, tipo: NotifyType = "message") => {
    switch (tipo) {
      case "success":
        toast.success(mensagem, options);
        break;
      case "error":
        toast.error(mensagem, options);
        break;
      case "message":
      default:
        toast(mensagem, options);
        break;
    }
  };

  const notifySucess = (mensagem: string) => {
    toast.success(mensagem, options);
  };

  const notifyError = (mensagem: string) => {
    toast.error(mensagem, options);
  };

  const notifyMessage = (mensagem: string) => {
    toast(mensagem, options);
  };

  return { notify, notifySucess, notifyError, notifyMessage };
};
