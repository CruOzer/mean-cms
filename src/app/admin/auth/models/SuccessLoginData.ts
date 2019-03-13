import { UserData } from './UserData';

export interface SuccessLoginData   {
  success: boolean;
  token: string;
  expiresIn: number;
  user: UserData;
}
