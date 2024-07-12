import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ExtractUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
      const token = req.headers['authorization']?.split(' ')[1];
      console.log(token);
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
          req.user = { sub: decoded.sub };
        }
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
    next();
  }
}
