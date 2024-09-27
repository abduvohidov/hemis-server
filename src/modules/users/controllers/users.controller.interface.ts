import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	remove: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getOrCreate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	verifyEmailAndSave: (request: Request, response: Response, next: NextFunction) => void;
}
