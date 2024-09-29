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

	async getByStudentId(studentId: number): Promise<Education | null> {
		return await this.educationRepository.findByStudentId(studentId);
	}

	async getByBachelorId(bachelorId: number): Promise<Education[] | null> {
		return await this.educationRepository.findByBachelorId(bachelorId);
	}

	async getByFacultyId(facultyId: number): Promise<Education[] | null> {
		return await this.educationRepository.findByFacultyId(facultyId);
	}

	async getByCurrentSpecialization(currentSpecialization: string): Promise<Education[] | null> {
		return await this.educationRepository.findByCurrentSpecialization(currentSpecialization);
	}

	async getByCourse(course: string): Promise<Education[] | null> {
		return await this.educationRepository.findByCourse(course);
	}

	async getByPaymentType(paymentType: string): Promise<Education[] | null> {
		return await this.educationRepository.findByPaymentType(paymentType);
	}

	async getByEntryYear(entryYear: string): Promise<Education[] | null> {
		return await this.educationRepository.findByEntryYear(entryYear);
	}

	async getByEducationForm(educationForm: string): Promise<Education[] | null> {
		return await this.educationRepository.findByEducationForm(educationForm);
	}

	async getByLanguageCertificate(languageCertificate: string): Promise<Education[] | null> {
		return await this.educationRepository.findByLanguageCertificate(languageCertificate);
	}

	async getBySemester(semester: string): Promise<Education[] | null> {
		return await this.educationRepository.findBySemester(semester);
	}

	async getByScientificSupervisor(scientificSupervisor: string): Promise<Education[] | null> {
		return await this.educationRepository.findByScientificSupervisor(scientificSupervisor);
	}

	async getByScientificAdvisor(scientificAdvisor: string): Promise<Education[] | null> {
		return await this.educationRepository.findByScientificAdvisor(scientificAdvisor);
	}

	async getByInternshipSupervisor(internshipSupervisor: string): Promise<Education[] | null> {
		return await this.educationRepository.findByInternshipSupervisor(internshipSupervisor);
	}

	async getByInternalReviewer(internalReviewer: string): Promise<Education[] | null> {
		return await this.educationRepository.findByInternalReviewer(internalReviewer);
	}

	async getByExternamReviewer(externamReviewer: string): Promise<Education[] | null> {
		return await this.educationRepository.findByExternamReviewer(externamReviewer);
	}

	async getByThesisTopic(thesisTopic: string): Promise<Education[] | null> {
		return await this.educationRepository.findByThesisTopic(thesisTopic);
	}

	async getByArticlesId(articlesId: number): Promise<Education[] | null> {
		return await this.educationRepository.findByArticlesId(articlesId);
	}

	async getByAcademicLeave(academicLeave: string): Promise<Education[] | null> {
		return await this.educationRepository.findByAcademicLeave(academicLeave);
	}
}
