import { NextFunction, Request, Response } from 'express';

export interface IMasterController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getByFilters: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	downloadXlsxFile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
