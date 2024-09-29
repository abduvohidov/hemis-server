import { NextFunction, Request, Response } from 'express';

export interface IAddressController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	find: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByCountry: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByRegion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByAddress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}