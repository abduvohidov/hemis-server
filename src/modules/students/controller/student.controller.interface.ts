import { NextFunction, Request, Response } from 'express';

export interface IStudentController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByPassportNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByJshshr: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByLastName: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByFirstName: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByNationality: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByGender: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByPhoneNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByParentPhoneNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
