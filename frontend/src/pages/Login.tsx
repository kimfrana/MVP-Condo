import LogoAzul from "@assets/blue-logo.svg";
import Button from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userLoginSchema,
  type UserLoginType
} from "@core/types/UserLogin.type";
import { userService } from "@core/services";
import { useNotification } from "@hooks/useNotification";

const Login = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserLoginType>({
    resolver: zodResolver(userLoginSchema)
  });

  const onSubmit = async (usuario: UserLoginType) => {
    const { data } = await userService.getUserByEmail(usuario.email);

    if (data) {
      if (data.success && data.data?.usuario) {
        const { usuario } = data.data;
        localStorage.setItem("user", JSON.stringify(usuario.id));
        notify("Autenticado com Sucesso", "success");
        navigate("/");
      } else
        notify(data.error ?? "Ocorreu um erro ao acessar o sistema", "error");
    }
  };

  return (
    <Card className="space-y-4 w-full">
      <div className="justify-start">
        <img
          src={LogoAzul}
          alt="logo"
          style={{ width: "2rem", height: "2rem" }}
          className="hover-shake"
        />
      </div>
      <h1 className="text-xl text-primary mb-4 text-center font-semibold">
        Acessar ao Sistema
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail"
          required
          error={errors.email?.message}
          placeholder="Digite seu melhor e-mail"
          autoComplete="on"
          {...register("email")}
        />
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          Entrar
        </Button>
      </form>
    </Card>
  );
};

export default Login;
