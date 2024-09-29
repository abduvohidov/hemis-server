import { NextFunction, Request, Response } from 'express';

export interface IAddressController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByCountry: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
