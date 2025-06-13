import { Request } from 'express';

export class Crequest extends Request {
  cookies?: {
    jwt?: string;
  };
}

export class Irequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export class Grequest extends Request {
  user: {
    email: string | undefined;
    name: string | undefined;
    picture: string | undefined;
    provider: string | undefined;
  };
}
