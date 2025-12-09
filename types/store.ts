import type { IUser } from './user';

export interface AuthState {
  accessToken: string | null;
  user: IUser | null;
  isLoading: boolean;

  setAccessToken: (accessToken: string | null) => void;
  clearState: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refresh: () => Promise<void>;
  initialize: () => Promise<void>;
}
