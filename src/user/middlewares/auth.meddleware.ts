import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../../types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {
		console.log('AuthMiddleware');
	}
	async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
		if (!req.headers.authorization) {
			req.user = null;

			next();
			return;
		}

		const token = req.headers.authorization.split(' ')[1];

		try {
			const decoded = verify(token, process.env.JWT_SECRET);
			req.user = await this.userService.findById(decoded['id']);
			next();
		} catch (err) {
			req.user = null;
			next();
		}
	}
}
