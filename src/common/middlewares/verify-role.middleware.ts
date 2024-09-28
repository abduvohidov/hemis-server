import { PrismaClient } from '@prisma/client';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class VerifyRole implements IMiddleware {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient, private allowedRoles: string[]) {
		this.prisma = prisma;
	}
	async execute(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			const email = request.user as string;
			if (!email) {
				response.status(401).json({ message: 'Unauthorized, no user found' });
				return;
			}
			const user = await this.prisma.userModel.findFirst({ where: { email } });

			if (!user) {
				response.status(404).json({ message: 'User not found' });
				return;
			}

			const userRole = user.role;

			if (this.allowedRoles.includes(userRole)) {
				next();
			} else {
				response.status(403).json({ message: 'Access denied' });
				return;
			}
		} catch (error) {
			response.status(500).json({ message: 'Server error' });
		}
	}
}
