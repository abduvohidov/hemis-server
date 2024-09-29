import { TYPES } from './../../../types';
import { Education } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { CreateEducationDto, UpdateEducationDto } from '../index';
import { PrismaService } from './../../../database/prisma.service';
import { IEducationRepository } from './education.repository.interface';

@injectable()
export class EducationRepository implements IEducationRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(data: CreateEducationDto): Promise<Education | null> {
		return this.prismaService.client.education.create({
			data: {
				studentId: data.studentId,
				bachelorId: data.bachelorId,
				currentSpecialization: data.currentSpecialization,
				facultyId: data.facultyId,
				course: data.course,
				paymentType: data.paymentType,
				entryYear: data.entryYear,
				educationForm: data.educationForm,
				languageCertificate: data.languageCertificate,
				semester: data.semester,
				scientificSupervisor: data.scientificSupervisor,
				scientificAdvisor: data.scientificAdvisor,
				internshipSupervisor: data.internshipSupervisor,
				internalReviewer: data.internalReviewer,
				externamReviewer: data.externamReviewer,
				thesisTopic: data.thesisTopic,
				articlesId: data.articlesId,
				academicLeave: data.academicLeave,
			},
		});
	}

	async delete(id: number): Promise<Education | null> {
		const education = await this.prismaService.client.education.findFirst({ where: { id } });
		if (!education) {
			return null;
		}

		return this.prismaService.client.education.delete({ where: { id } });
	}

	async update(id: number, data: UpdateEducationDto): Promise<Education | null> {
		return this.prismaService.client.education.update({
			include: {
				student: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
			where: { id },
			data: {
				...(data.studentId && { studentId: data.studentId }),
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
			},
		});
	}

	// gets
	async findAll(): Promise<Education[]> {
		return this.prismaService.client.education.findMany({
			include: {
				student: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}

	async findById(id: number): Promise<Education | null> {
		return this.prismaService.client.education.findUnique({
			where: { id },
			include: {
				student: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}

	async findByStudentId(studentId: number): Promise<Education | null> {
		return this.prismaService.client.education.findFirst({
			where: { studentId },
			include: {
				student: true,
				bachelor: true,
				faculty: true,
				articles: true,
			},
		});
	}

	async findByBachelorId(bachelorId: number): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({
			where: { bachelorId },
			include: {
				bachelor: true,
			},
		});
	}

	async findByFacultyId(facultyId: number): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({
			where: { facultyId },
			include: {
				faculty: true,
			},
		});
	}

	async findByCurrentSpecialization(currentSpecialization: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({
			where: { currentSpecialization },
		});
	}

	async findByCourse(course: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { course } });
	}

	async findByPaymentType(paymentType: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { paymentType } });
	}

	async findByEntryYear(entryYear: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { entryYear } });
	}

	async findByEducationForm(educationForm: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { educationForm } });
	}

	async findByLanguageCertificate(languageCertificate: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { languageCertificate } });
	}

	async findBySemester(semester: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { semester } });
	}

	async findByScientificSupervisor(scientificSupervisor: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { scientificSupervisor } });
	}

	async findByScientificAdvisor(scientificAdvisor: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { scientificAdvisor } });
	}

	async findByInternshipSupervisor(internshipSupervisor: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { internshipSupervisor } });
	}

	async findByInternalReviewer(internalReviewer: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { internalReviewer } });
	}

	async findByExternamReviewer(externamReviewer: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { externamReviewer } });
	}

	async findByThesisTopic(thesisTopic: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { thesisTopic } });
	}

	async findByArticlesId(articlesId: number): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { articlesId } });
	}

	async findByAcademicLeave(academicLeave: string): Promise<Education[] | null> {
		return this.prismaService.client.education.findMany({ where: { academicLeave } });
	}
}
