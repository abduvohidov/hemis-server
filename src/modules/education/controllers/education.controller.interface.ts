import { Request, NextFunction, Response } from 'express';

export interface IEducationController {
	postEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;

	//gets
	findAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByFilters: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByMaster: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
