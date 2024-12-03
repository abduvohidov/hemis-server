import { NextFunction, Request, Response } from 'express';

export interface IArticleController {
	fileUpload: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	postArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findAllArticles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findArticleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findByFilters: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
