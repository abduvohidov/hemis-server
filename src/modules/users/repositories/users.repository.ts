import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IUsersRepository } from './users.repository.interface';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: any): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: { email },
		});
	}

	async remove(id: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.delete({
			where: {
				id,
			},
		});
	}

	async findById(id: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findUnique({
			where: {
				id,
			},
		});
	}
}
