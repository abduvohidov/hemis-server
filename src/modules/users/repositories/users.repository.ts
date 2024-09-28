import { TYPES } from '../../../types';
import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from '../../../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: { name: string; email: string; password?: string }): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
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
