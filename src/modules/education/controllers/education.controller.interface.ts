import { Education } from '@prisma/client';
import { Request, NextFunction, Response } from 'express';

export interface IEducationController {
	postEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;

	//gets
	findAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByStudentId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByBachelorId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByFacultyId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByCurrentSpecialization: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByPaymentType: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByEntryYear: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByEducationForm: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByLanguageCertificate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findBySemester: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByScientificSupervisor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByScientificAdvisor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByInternshipSupervisor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByInternalReviewer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByExternamReviewer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByThesisTopic: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByArticlesId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByAcademicLeave: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
