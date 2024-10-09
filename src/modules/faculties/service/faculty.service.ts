import 'reflect-metadata';
import { TYPES } from '../../../types';
import { Faculty } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IFacultyService } from './faculty.service.interface';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { IFaculty } from '../models/faculty.entity.interface';
import { Faculty as FacultyEntity } from '../models/faculty.entity';
import { FacultyRepository } from '../repository/faculty.repository';

@injectable()
export class FacultyService implements IFacultyService {
	constructor(@inject(TYPES.FacultyRepository) private facultyRepository: FacultyRepository) {}

	async create(params: FacultyCreateDto): Promise<IFaculty | null> {
		const newFaculty = new FacultyEntity(params.name);
		const existed = await this.facultyRepository.findByName(params.name);
		if (existed) {
			return null;
		}

		return this.facultyRepository.create(newFaculty);
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

	async findByName(name: string): Promise<Faculty[] | null> {
		const existed = await this.facultyRepository.findByName(name);
		if (!existed) {
			return null;
		}
		return existed;
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
