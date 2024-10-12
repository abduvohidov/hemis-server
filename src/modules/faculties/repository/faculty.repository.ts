import 'reflect-metadata';
import { TYPES } from '../../../types';
import { Faculty } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IFaculty } from '../models/faculty.entity.interface';
import { PrismaService } from '../../../database/prisma.service';
import { IFacultyRepository } from './faculty.repository.interface';

@injectable()
export class FacultyRepository implements IFacultyRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(params: IFaculty): Promise<IFaculty> {
		return await this.prismaService.client.faculty.create({
			data: {
				name: params.name,
			},
		});
	}

	async find(): Promise<Faculty[]> {
		return await this.prismaService.client.faculty.findMany();
	}

	async findById(id: number): Promise<Faculty | null> {
		return await this.prismaService.client.faculty.findFirst({
			where: { id },
		});
	}

	async findByName(name: string): Promise<Faculty | null> {
		console.log(name);
		return await this.prismaService.client.faculty.findFirst({
			where: { name },
		});
	}

	async update(id: number, params: Faculty): Promise<Faculty | null> {
		return await this.prismaService.client.faculty.update({
			where: { id },
			data: params,
		});
	}

	async delete(id: number): Promise<Faculty> {
		return await this.prismaService.client.faculty.delete({ where: { id } });
	}
}
