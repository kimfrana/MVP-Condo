import type { UserLoginResponse } from "@core/types/UserLogin.type";
import { api } from "@libs/axios.lib";
import axios from "axios";

const BASE_URL = "/api/user";

export const userService = {
  getUserByEmail: async (email: string) => {
    try {
      return await api.post<UserLoginResponse>(`${BASE_URL}/get-by-email`, {
        email
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return (
          err.response ?? {
            data: { success: false, error: err.message } as UserLoginResponse,
            status: err.code === "ERR_BAD_REQUEST" ? 404 : 500,
            statusText: err.message,
            headers: {},
            config: err.config
          }
        );
      }

      return {
        data: { success: false, error: "Erro inesperado" } as UserLoginResponse,
        status: 500,
        statusText: "Erro inesperado",
        headers: {},
        config: {}
      };
    }
  }
};
