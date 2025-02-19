import { UserType } from './user-type.enum.js';

export type Host = {
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
  hostType: UserType;
};
