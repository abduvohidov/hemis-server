import 'reflect-metadata';
import { TYPES } from '../../../types';
import { Bachelor } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IBachelorService } from './bachelor.service.interface';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';
import { BacherlorRepository } from '../repository/bachelor.repository';

@injectable()
export class BachelorService implements IBachelorService {
	constructor(@inject(TYPES.BachelorRepository) private bachelorRepository: BacherlorRepository) {}

	async create(params: BachelorCreateDto): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findByDiplomaNumber(params.diplomaNumber);
		if (existed) {
			return null;
		}
		return this.bachelorRepository.create(params);
	}

	async update(id: number, params: BachelorUpdateDto): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findById(id);
		if (!existed) {
			return null;
		}
		return this.bachelorRepository.update(id, params);
	}

	async delete(id: number): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findById(id);
		if (!existed) {
			return null;
		}
		return this.bachelorRepository.delete(id);
	}

	//finds
	async find(): Promise<Bachelor[]> {
		return await this.bachelorRepository.find();
	}

	async findById(id: number): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findById(id);
		if (!existed) {
			return null;
		}
		return await this.bachelorRepository.findById(id);
	}

	async findByFilter(data: Partial<Bachelor>): Promise<Bachelor[] | []> {
		const bachelorFilters = {
			...(data.previousUniversity && { previousUniversity: data.previousUniversity }),
			...(data.graduationYear && { graduationYear: data.graduationYear }),
			...(data.diplomaNumber && { diplomaNumber: data.diplomaNumber }),
			...(data.previousSpecialization && { previousSpecialization: data.previousSpecialization }),
		};
		const hasBachelorFilters = Object.keys(bachelorFilters).length > 0;
		if (!hasBachelorFilters) return [];

		return await this.bachelorRepository.findByFilters(data);
	}
}
