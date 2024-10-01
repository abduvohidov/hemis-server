import { TYPES } from '../../../types';
import { Education } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IArticleRepository } from './../../articles';
import { IStudentRepository } from './../../students';
import { IFacultyRepository } from './../../faculties';
import { IBachelorRepository } from './../../bachelors';
import { IEducationService } from './education.service.interface';
import { CreateEducationDto, UpdateEducationDto, IEducationRepository } from '../index';

@injectable()
export class EducationService implements IEducationService {
	constructor(
		@inject(TYPES.EducationRepository) private educationRepository: IEducationRepository,
		@inject(TYPES.BachelorRepository) private bachelorRepository: IBachelorRepository,
		@inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository,
		@inject(TYPES.FacultyRepository) private facultyRepository: IFacultyRepository,
		@inject(TYPES.StudentRepository) private studentRepository: IStudentRepository,
	) {}

	async prepareEducation(data: CreateEducationDto): Promise<Education | null> {
		const isBachelorExists = await this.bachelorRepository.findById(data.bachelorId);
		const isArticleExists = await this.articleRepository.findById(data.articlesId);
		const isFacultyExists = await this.facultyRepository.findById(data.facultyId);
		const isStudentExists = await this.studentRepository.findById(data.studentId);
		const isDuplicate = await this.educationRepository.findByStudentId(data.studentId);
		if (
			isDuplicate ||
			!isArticleExists ||
			!isFacultyExists ||
			!isStudentExists ||
			!isBachelorExists
		) {
			return null;
		}
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
