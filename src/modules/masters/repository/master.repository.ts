import 'reflect-metadata';
import { TYPES } from '../../../types';
import { Master } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { PrismaService } from '../../../database/prisma.service';
import { IMasterRepository } from './master.repository.interface';
import { IMasterEntity } from '../models/master.entity.interface';

@injectable()
export class MasterRepository implements IMasterRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(master: IMasterEntity): Promise<IMasterEntity> {
		return this.prismaService.client.master.create({
			data: {
				lastName: master.lastName,
				firstName: master.firstName,
				middleName: master.middleName,
				passportNumber: master.passportNumber,
				jshshr: master.jshshr,
				dateOfBirth: master.dateOfBirth,
				gender: master.gender,
				nationality: master.nationality,
				email: master.email,
				phoneNumber: master.phoneNumber,
				parentPhoneNumber: master.parentPhoneNumber,
				avatarUrl: master.avatarUrl,
				password: master.password,
			},
		});
	}

	async findById(id: number): Promise<Master | null> {
		return await this.prismaService.client.master.findUnique({
			where: { id: Number(id) },
			include: {
				addresses: true,
				education: {
					include: {
						bachelor: true,
						faculty: true,
						articles: true,
					},
				},
			},
		});
	}

	async findByEmail(email: string): Promise<Master | null> {
		return await this.prismaService.client.master.findUnique({
			include: {
				addresses: true,
				education: {
					include: {
						bachelor: true,
						faculty: true,
						articles: true,
					},
				},
			},
			where: { email },
		});
	}

	async update(id: number, master: Partial<Master>): Promise<Master> {
		return await this.prismaService.client.master.update({
			where: { id },
			data: master,
		});
	}

	async delete(id: number): Promise<void> {
		await this.prismaService.client.master.delete({
			where: { id },
		});
	}

	async findAll(): Promise<Master[]> {
		return await this.prismaService.client.master.findMany({
			include: {
				addresses: true,
				education: {
					include: {
						bachelor: true,
						faculty: true,
						articles: true,
					},
				},
			},
		});
	}
	async findByFilters(data: Partial<Master>): Promise<Master[] | []> {
		return await this.prismaService.client.master.findMany({
			include: {
				addresses: true,
				education: {
					include: {
						bachelor: true,
						faculty: true,
						articles: true,
					},
				},
			},
			where: data,
		});
	}
}
