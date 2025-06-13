import { Request } from 'express';

export interface Crequest extends Request {
  cookies: {
    jwt?: string;
  };
}

export interface Irequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export interface Grequest extends Request {
  user: {
    email: string | undefined;
    name: string | undefined;
    picture: string | undefined;
    provider: string | undefined;
  };
}
