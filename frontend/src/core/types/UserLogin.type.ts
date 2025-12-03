import { z } from 'zod'
import type { ApiResponseType } from './Common/ApiResponse.type';

export const userLoginSchema = z.object({
  email: z.email('Digite um email válido'),
})

export type UserLoginType = z.infer<typeof userLoginSchema>

export type UserLoginResponse = ApiResponseType<{
  usuario: { email: string; id: string; nome: string;}
}>