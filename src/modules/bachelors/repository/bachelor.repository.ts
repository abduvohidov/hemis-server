import { inject, injectable } from 'inversify';
import { IBachelorRepository } from './bachelor.repository.interface';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { Bachelor } from '@prisma/client';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';
import 'reflect-metadata';

@injectable()
export class BacherlorRepository implements IBachelorRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(params: BachelorCreateDto): Promise<Bachelor | null> {
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
			data: {
				previousUniversity: params.previousUniversity,
				graduationYear: params.graduationYear,
				diplomaNumber: params.diplomaNumber,
				previousSpecialization: params.previousSpecialization,
			},
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
	async findByPreviousUniversity(previousUniversity: string): Promise<Bachelor[] | null> {
		return await this.prismaService.client.bachelor.findMany({ where: { previousUniversity } });
	}
	async findGraduationYear(graduationYear: string): Promise<Bachelor[] | null> {
		return await this.prismaService.client.bachelor.findMany({ where: { graduationYear } });
	}
	async findDiplomaNumber(diplomaNumber: string): Promise<Bachelor | null> {
		return await this.prismaService.client.bachelor.findFirst({ where: { diplomaNumber } });
	}
	async findPreviousSpecialization(previousSpecialization: string): Promise<Bachelor | null> {
		return await this.prismaService.client.bachelor.findFirst({
			where: { previousSpecialization },
		});
	}
}
