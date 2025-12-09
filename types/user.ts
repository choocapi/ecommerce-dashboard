import { IRole } from './role';

export interface IUser {
  id: string; // UUID
  email: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  roles?: IRole[];
}
