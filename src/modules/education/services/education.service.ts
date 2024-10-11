import { TYPES } from '../../../types';
import { Education } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IMasterRepository } from './../../masters';
import { IArticleRepository } from './../../articles';
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
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
	) {}

	async prepareEducation(data: CreateEducationDto): Promise<Education | null> {
		const isBachelorExists = await this.bachelorRepository.findById(data.bachelorId);
		const isArticleExists = await this.articleRepository.findById(data.articlesId);
		const isFacultyExists = await this.facultyRepository.findById(data.facultyId);
		const isMasterExists = await this.masterRepository.findById(data.masterId);
		const isDuplicate = await this.educationRepository.findByMasterId(data.masterId);
		if (
			isDuplicate ||
			!isArticleExists ||
			!isFacultyExists ||
			!isMasterExists ||
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
		const educationFilters = {
			...(data.masterId && { masterId: data.masterId }),
			...(data.bachelorId && { bachelorId: data.bachelorId }),
			...(data.currentSpecialization && { currentSpecialization: data.currentSpecialization }),
			...(data.facultyId && { facultyId: data.facultyId }),
			...(data.course && { course: data.course }),
			...(data.paymentType && { paymentType: data.paymentType }),
			...(data.entryYear && { entryYear: data.entryYear }),
			...(data.educationForm && { educationForm: data.educationForm }),
			...(data.languageCertificate && { languageCertificate: data.languageCertificate }),
			...(data.semester && { semester: data.semester }),
			...(data.scientificSupervisor && { scientificSupervisor: data.scientificSupervisor }),
			...(data.scientificAdvisor && { scientificAdvisor: data.scientificAdvisor }),
			...(data.internshipSupervisor && { internshipSupervisor: data.internshipSupervisor }),
			...(data.internalReviewer && { internalReviewer: data.internalReviewer }),
			...(data.externamReviewer && { externamReviewer: data.externamReviewer }),
			...(data.thesisTopic && { thesisTopic: data.thesisTopic }),
			...(data.articlesId && { articlesId: data.articlesId }),
			...(data.academicLeave && { academicLeave: data.academicLeave }),
		};
		const hasEducationFilters = Object.keys(educationFilters).length > 0;
		if (!hasEducationFilters) {
			return [];
		}
		return await this.educationRepository.findByValues(educationFilters);
	}
}
