import { inject, injectable } from 'inversify';
import { IBachelorService } from './bachelor.service.interface';
import { TYPES } from '../../../types';
import { Bachelor } from '@prisma/client';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { BachelorUpdateDto } from '../dto/bacherlor-update.dto';
import 'reflect-metadata';

@injectable()
export class BachelorService implements IBachelorService {
	constructor(@inject(TYPES.BachelorRepository) private bachelorRepository: BachelorService) {}

	async create(params: BachelorCreateDto): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.find();
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

	async findByPreviousUniversity(previousUniversity: string): Promise<Bachelor[] | null> {
		const existed = await this.bachelorRepository.findByPreviousUniversity(previousUniversity);
		if (!existed) {
			return null;
		}
		return await this.bachelorRepository.findByPreviousUniversity(previousUniversity);
	}

	async findGraduationYear(graduationYear: string): Promise<Bachelor[] | null> {
		const existed = await this.bachelorRepository.findGraduationYear(graduationYear);
		if (!existed) {
			return null;
		}
		return await this.bachelorRepository.findGraduationYear(graduationYear);
	}

	async findDiplomaNumber(diplomaNumber: string): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findDiplomaNumber(diplomaNumber);
		if (!existed) {
			return null;
		}
		return await this.bachelorRepository.findDiplomaNumber(diplomaNumber);
	}
	async findPreviousSpecialization(previousSpecialization: string): Promise<Bachelor | null> {
		const existed = await this.bachelorRepository.findPreviousSpecialization(
			previousSpecialization,
		);
		if (!existed) {
			return null;
		}
		return await this.bachelorRepository.findPreviousSpecialization(previousSpecialization);
	}
}
