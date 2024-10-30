import 'reflect-metadata';
import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { Faculty, Master } from '@prisma/client';
import { IEducation } from '../../education/types';
import { IEducationRepository } from '../../education';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { IFacultyService } from './faculty.service.interface';
import { Faculty as FacultyEntity } from '../models/faculty.entity';
import { FacultyRepository } from '../repository/faculty.repository';

@injectable()
export class FacultyService implements IFacultyService {
	constructor(
		@inject(TYPES.FacultyRepository) private facultyRepository: FacultyRepository,
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

	async createOrFind(name: string): Promise<Faculty> {
		let faculty = await this.facultyRepository.findByName(name);
		if (!faculty) {
			faculty = await this.facultyRepository.create(name);
		}
		return faculty;
	}

	async find(): Promise<Faculty[]> {
		return this.facultyRepository.find();
	}

	async findById(id: number): Promise<Faculty | null> {
		const existed = await this.facultyRepository.findById(id);
		if (!existed) {
			return null;
		}
		return this.facultyRepository.findById(id);
	}

	async findByName(name: string): Promise<Faculty | null> {
		if (!name) return null;
		const faculty = await this.facultyRepository.findByName(name);
		if (!faculty) {
			return null;
		}
		return faculty;
	}
	async filterByName(name: string): Promise<Master[] | []> {
		if (!name) return [];
		const faculty = await this.facultyRepository.findByName(name);
		if (faculty) {
			const education = await this.educationRepository.findByFacultyId(faculty.id);
			const masters = education.flatMap((education: IEducation) => education.master);
			if (masters.length > 0) return masters as Master[];
			return [];
		}
		return [];
	}

	async update(id: number, params: Faculty): Promise<Faculty | null> {
		const existed = await this.facultyRepository.findById(id);
		if (!existed) {
			return null;
		}
		return this.facultyRepository.update(id, params);
	}

	async delete(id: number): Promise<Faculty | null> {
		const existed = await this.facultyRepository.findById(id);
		if (!existed) {
			return null;
		}
		return this.facultyRepository.delete(id);
	}
}
