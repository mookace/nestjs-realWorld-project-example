import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(@Req() req: Request | any, res: Response, next: NextFunction) {
    console.log('user auth');

    let authHeaders =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.headers.authorization ||
      req.headers.token;

    if (!authHeaders) {
      throw new HttpException(
        {
          msg: 'Token not found.',
          errors: { msg: 'Token not found.' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      if (authHeaders && (authHeaders as string).split(' ')[1]) {
        const token = (authHeaders as string).split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        let passed = await this.userService.passedToken(decoded, token);

        // const passed = await this.userService.findById(decoded.id);

        if (!passed) {
          throw new HttpException(
            {
              msg: 'Unauthorized.',
              errors: { msg: 'Unauthorized.' },
              status: 'errors',
            },
            HttpStatus.UNAUTHORIZED
          );
        }

        req.user = passed;
        next();
      } else {
        throw new HttpException(
          {
            msg: 'UNAUTHORIZED',
            errors: { msg: 'UNAUTHORIZED' },
            status: 'errors',
          },
          HttpStatus.UNAUTHORIZED
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          msg: 'UNAUTHORIZED',
          errors: { msg: 'UNAUTHORIZED' },
          status: 'errors',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
