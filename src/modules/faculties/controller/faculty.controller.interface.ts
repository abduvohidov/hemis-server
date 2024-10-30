import { NextFunction, Request, Response } from 'express';

export interface IFacultyController {
	createOrFind: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	find: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByName: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
