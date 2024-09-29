import { Education } from '@prisma/client';
import { CreateEducationDto, UpdateEducationDto } from '../index';

export interface IEducationRepository {
	create: (data: CreateEducationDto) => Promise<Education | null>;
	delete: (id: number) => Promise<Education | null>;
	update: (id: number, data: UpdateEducationDto) => Promise<Education | null>;

	//gets
	findAll: () => Promise<Education[]>;
	findById: (id: number) => Promise<Education | null>;
	findByStudentId: (studentId: number) => Promise<Education | null>;
	findByBachelorId: (bachelorId: number) => Promise<Education[] | null>;
	findByFacultyId: (facultyId: number) => Promise<Education[] | null>;
	findByCurrentSpecialization: (currentSpecialization: string) => Promise<Education[] | null>;
	findByCourse: (course: string) => Promise<Education[] | null>;
	findByPaymentType: (paymentType: string) => Promise<Education[] | null>;
	findByEntryYear: (paymentType: string) => Promise<Education[] | null>;
	findByEducationForm: (educationForm: string) => Promise<Education[] | null>;
	findByLanguageCertificate: (languageCertificate: string) => Promise<Education[] | null>;
	findBySemester: (semester: string) => Promise<Education[] | null>;
	findByScientificSupervisor: (scientificSupervisor: string) => Promise<Education[] | null>;
	findByScientificAdvisor: (scientificAdvisor: string) => Promise<Education[] | null>;
	findByInternshipSupervisor: (internshipSupervisor: string) => Promise<Education[] | null>;
	findByInternalReviewer: (internalReviewer: string) => Promise<Education[] | null>;
	findByExternamReviewer: (externamReviewer: string) => Promise<Education[] | null>;
	findByThesisTopic: (thesisTopic: string) => Promise<Education[] | null>;
	findByArticlesId: (articlesId: number) => Promise<Education[] | null>;
	findByAcademicLeave: (academicLeave: string) => Promise<Education[] | null>;
}
