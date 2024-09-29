import { Education } from '@prisma/client';
import { CreateEducationDto, UpdateEducationDto } from '../index';

export interface IEducationService {
	prepareEducation: (data: CreateEducationDto) => Promise<Education | null>;
	removeEducation: (id: number) => Promise<Education | null>;
	changeEducation: (id: number, data: UpdateEducationDto) => Promise<Education | null>;

	//gets
	getAll: () => Promise<Education[]>;
	getById: (id: number) => Promise<Education | null>;
	getByStudentId: (studentId: number) => Promise<Education | null>;
	getByBachelorId: (bachelorId: number) => Promise<Education[] | null>;
	getByFacultyId: (facultyId: number) => Promise<Education[] | null>;
	getByCurrentSpecialization: (currentSpecialization: string) => Promise<Education[] | null>;
	getByCourse: (course: string) => Promise<Education[] | null>;
	getByPaymentType: (paymentType: string) => Promise<Education[] | null>;
	getByEntryYear: (paymentType: string) => Promise<Education[] | null>;
	getByEducationForm: (educationForm: string) => Promise<Education[] | null>;
	getByLanguageCertificate: (languageCertificate: string) => Promise<Education[] | null>;
	getBySemester: (semester: string) => Promise<Education[] | null>;
	getByScientificSupervisor: (scientificSupervisor: string) => Promise<Education[] | null>;
	getByScientificAdvisor: (scientificAdvisor: string) => Promise<Education[] | null>;
	getByInternshipSupervisor: (internshipSupervisor: string) => Promise<Education[] | null>;
	getByInternalReviewer: (internalReviewer: string) => Promise<Education[] | null>;
	getByExternamReviewer: (externamReviewer: string) => Promise<Education[] | null>;
	getByThesisTopic: (thesisTopic: string) => Promise<Education[] | null>;
	getByArticlesId: (articlesId: number) => Promise<Education[] | null>;
	getByAcademicLeave: (academicLeave: string) => Promise<Education[] | null>;
}
