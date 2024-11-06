import { TYPES } from './../../../types';
import { Education } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { CreateEducationDto, UpdateEducationDto } from '../index';
import { PrismaService } from './../../../database/prisma.service';
import { IEducationRepository } from './education.repository.interface';

@injectable()
export class EducationRepository implements IEducationRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(data: CreateEducationDto): Promise<Education | null> {
		return this.prismaService.client.education.create({
			data,
		});
	}

	async delete(id: number): Promise<Education | null> {
		const education = await this.prismaService.client.education.findFirst({ where: { id } });
		if (!education) {
			return null;
		}

		return this.prismaService.client.education.delete({ where: { id } });
	}

	async update(id: number, data: UpdateEducationDto): Promise<Education | null> {
		return this.prismaService.client.education.update({
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
			where: { id },
			data,
		});
	}

	// gets
	async findAll(): Promise<Education[]> {
		return this.prismaService.client.education.findMany({
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}

	async findById(id: number): Promise<Education | null> {
		return this.prismaService.client.education.findUnique({
			where: { id },
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}
	async findByMasterId(masterId: number): Promise<Education | null> {
		return this.prismaService.client.education.findFirst({
			where: { masterId },
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}

	async findByFacultyId(id: number): Promise<Education[] | []> {
		return this.prismaService.client.education.findMany({
			where: {
				facultyId: id,
			},
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}
	async findByBachelorsId(ids: number[]): Promise<Education[] | []> {
		return this.prismaService.client.education.findMany({
			where: {
				bachelorId: { in: ids },
			},
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}
	async findByArticlesId(ids: number[]): Promise<Education[] | []> {
		return this.prismaService.client.education.findMany({
			where: {
				articlesId: { in: ids },
			},
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}

	async findByValues(data: Partial<Education>): Promise<Education[] | []> {
		return this.prismaService.client.education.findMany({
			where: data,
			include: {
				master: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}
}
