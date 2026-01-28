import { Request } from 'express';

export interface UserPayload {
  userId: number;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
