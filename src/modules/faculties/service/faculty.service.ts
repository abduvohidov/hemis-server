import 'reflect-metadata';
import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { Faculty, Student } from '@prisma/client';
import { IEducation } from '../../education/types';
import { IEducationRepository } from '../../education';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { IFacultyService } from './faculty.service.interface';
import { IFaculty } from '../models/faculty.entity.interface';
import { Faculty as FacultyEntity } from '../models/faculty.entity';
import { FacultyRepository } from '../repository/faculty.repository';

@injectable()
export class FacultyService implements IFacultyService {
	constructor(
		@inject(TYPES.FacultyRepository) private facultyRepository: FacultyRepository,
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
	) {}

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

	async findByName(name: string): Promise<Student[] | []> {
		if (!name) return [];
		const faculties = await this.facultyRepository.findByName(name);
		console.log(faculties);
		const facultiesIds = faculties?.map((faculty: Faculty) => faculty.id);
		if (facultiesIds?.length) {
			const education = await this.educationRepository.findByFacultyId(facultiesIds);
			const students = education.flatMap((education: IEducation) => education.student);
			if (students.length > 0) return students as Student[];
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
