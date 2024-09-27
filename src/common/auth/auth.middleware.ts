import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { IMiddleware } from '../middlewares/middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload !== 'string') {
					const jwtPayload = payload as JwtPayload;
					if (jwtPayload.email) {
						req.user = jwtPayload.email;
					}
					next();
				} else {
					next();
				}
			});
		} else {
			next();
		}
	}
}
