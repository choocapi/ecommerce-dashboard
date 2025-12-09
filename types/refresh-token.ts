import { IUser } from './user';

export interface IRefreshToken {
  id: number;
  token: string;
  expiryDate: string;
  userId?: string; // UUID
  user?: IUser;
  createdAt?: string;
}
