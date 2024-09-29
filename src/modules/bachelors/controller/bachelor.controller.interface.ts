import { NextFunction, Request, Response } from 'express';

export interface IBachelorController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;

	//finds
	find: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByPreviousUniversity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findGraduationYear: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findDiplomaNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findPreviousSpecialization: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
