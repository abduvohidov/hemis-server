import { TYPES } from '../../../types';
import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from '../../../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({
		email,
		password,
		name,
		lastName,
		role,
	}: {
		name: string;
		email: string;
		lastName: string;
		role: string;
		password?: string;
	}): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				lastName,
				password,
				role,
			},
		});
	}

	async findByEmail(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
