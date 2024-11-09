import 'reflect-metadata';
import { TYPES } from '../../../types';
import { Bachelor } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';
import { PrismaService } from '../../../database/prisma.service';
import { IBachelorRepository } from './bachelor.repository.interface';

@injectable()
export class BacherlorRepository implements IBachelorRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(params: Omit<Bachelor, 'id'>): Promise<Bachelor | null> {
		return await this.prismaService.client.bachelor.create({
			include: {
				education: true,
			},

			data: {
				previousUniversity: params.previousUniversity,
				graduationYear: params.graduationYear,
				diplomaNumber: params.diplomaNumber,
				previousSpecialization: params.previousSpecialization,
			},
		});
	}

	async update(id: number, params: BachelorUpdateDto): Promise<Bachelor | null> {
		return await this.prismaService.client.bachelor.update({
			include: {
				education: true,
			},
			where: { id },
			data: params,
		});
	}
	async delete(id: number): Promise<Bachelor | null> {
		return this.prismaService.client.bachelor.delete({ where: { id } });
	}

	//finds
	async find(): Promise<Bachelor[]> {
		return await this.prismaService.client.bachelor.findMany();
	}
	async findById(id: number): Promise<Bachelor | null> {
		return await this.prismaService.client.bachelor.findFirst({ where: { id } });
	}
	async findByDiplomaNumber(diplomaNumber: string): Promise<Bachelor | null> {
		return await this.prismaService.client.bachelor.findFirst({ where: { diplomaNumber } });
	}
	async findByFilters(data: Partial<Bachelor>): Promise<Bachelor[] | []> {
		return await this.prismaService.client.bachelor.findMany({
			include: {
				education: true,
			},
			where: data,
		});
	}
}
