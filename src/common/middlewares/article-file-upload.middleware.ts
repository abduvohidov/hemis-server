import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export class ArticleFileUploadMiddleware implements IMiddleware {
	private readonly upload;

	constructor() {
		this.upload = multer({
			storage: multer.memoryStorage(), // Храним файлы в оперативной памяти
			limits: {
				fileSize: 100 * 1024 * 1024, // Максимальный размер файла — 100MB
			},
		}).fields([
			{ name: 'firstArticle', maxCount: 1 }, // Первое поле
			{ name: 'secondArticle', maxCount: 1 }, // Второе поле
		]);
	}

	execute(req: Request, res: Response, next: NextFunction): void {
		this.upload(req, res, next);
	}
}
