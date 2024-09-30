import { TYPES } from '../../../types';
import { Education } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IEducationService } from './education.service.interface';
import { CreateEducationDto, UpdateEducationDto, IEducationRepository } from '../index';

@injectable()
export class EducationService implements IEducationService {
	constructor(
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

	async prepareEducation(data: CreateEducationDto): Promise<Education | null> {
		return await this.educationRepository.create(data);
	}

	async removeEducation(id: number): Promise<Education | null> {
		return await this.educationRepository.delete(id);
	}

	async changeEducation(id: number, data: UpdateEducationDto): Promise<Education | null> {
		return await this.educationRepository.update(id, data);
	}

	// Retrieves
	async getAll(): Promise<Education[]> {
		return await this.educationRepository.findAll();
	}

	async getById(id: number): Promise<Education | null> {
		return await this.educationRepository.findById(id);
	}

	async getByFilters(data: Partial<Education>): Promise<Education[] | []> {
		if (Object.keys(data).length == 0) return [];
		return await this.educationRepository.findByValues(data);
	}
}
