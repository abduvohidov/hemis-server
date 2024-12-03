import 'reflect-metadata';
import { ILogger } from '../../../logger';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES, ROLES } from '../../../types';
import { IConfigService } from '../../../config';
import { NextFunction, Request, Response } from 'express';
import { IArticleService, CreateArticleDto } from '../index';
import { IArticleController } from './article.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';
import { ArticleUploadParams } from '../services/article.service.interface';
import { ArticleFileUploadMiddleware } from '../../../common/middlewares/article-file-upload.middleware';
import { FileStorage } from '../../../common/fileStorage';

@injectable()
export class ArticleController extends BaseController implements IArticleController {
	private readonly secret4Token: string;
	constructor(
		@inject(TYPES.ILogger) loggerService: ILogger,
		@inject(TYPES.ArticleService) private articleService: IArticleService,
		@inject(TYPES.FileStorage) private fileStorage: FileStorage,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.secret4Token = this.configService.get('SECRET');

		this.bindRoutes([
			{
				path: '/file-upload/:id',
				method: 'post',
				func: this.fileUpload,
				middlewares: [
					new ArticleFileUploadMiddleware(),
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/download/:filename',
				method: 'get',
				func: this.download,
			},

			{
				path: '/create',
				method: 'post',
				func: this.postArticle,
				middlewares: [
					new ValidateMiddleware(CreateArticleDto),
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},

			{
				path: '/delete/:id',
				method: 'delete',
				func: this.deleteArticle,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},

			{
				path: '/all',
				method: 'get',
				func: this.findAllArticles,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},

			{
				path: '/update/:id',
				method: 'put',
				func: this.updateArticle,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},

			{
				path: '/:id',
				method: 'get',
				func: this.findArticleById,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},

			{
				path: '/filter',
				method: 'post',
				func: this.findByFilters,
				middlewares: [
					new AuthMiddleware(this.secret4Token),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
		]);
	}

	async download(req: Request, res: Response): Promise<void> {
		const file = await this.fileStorage.getFilePath(req.params.filename);
		res.download(file);
	}

	async fileUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const files = req.files as { [fieldname: string]: Express.Multer.File[] };
			if (!files.firstArticle && !files.secondArticle) {
				res.status(400).json({
					message: 'Загрузите хоть один файл',
				});
				return;
			}

			const fileUploadParams: ArticleUploadParams = {};

			const firstFile = (files?.firstArticle || [])[0];
			if (firstFile) {
				fileUploadParams.first = {
					filename: firstFile.originalname,
					content: firstFile.buffer,
				};
			}

			const secondFile = (files?.secondArticle || [])[0];
			if (secondFile) {
				fileUploadParams.second = {
					filename: secondFile.originalname,
					content: secondFile.buffer,
				};
			}

			await this.articleService.fileUpload(Number(req.params.id), fileUploadParams);

			this.ok(res, { message: 'Maqola qo`shildi' });
		} catch (error) {
			console.log(error);
			this.send(
				res,
				500,
				'Что-то пошло не так при добавлении адреса, проверьте добавляемые данные',
			);
		}
	}

	async postArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = req.body;
			const article = await this.articleService.prepareArticle(data);
			if (typeof article === 'string') this.send(res, 404, article, false);
			else if (article) this.ok(res, { message: 'Maqola qo`shildi', data: article });
			else this.send(res, 409, 'Iltimos qaytadan urinib ko`ring', false);
		} catch (error) {
			console.log(error);
			this.send(
				res,
				500,
				'Что-то пошло не так при добавлении адреса, проверьте добавляемые данные',
			);
		}
	}

	async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const article = await this.articleService.removeArticle(id);
			if (!article) {
				this.send(res, 404, 'Статья не найдена');
				return;
			}
			this.ok(res, { article });
		} catch (error) {
			this.send(res, 500, 'Ошибка при удаление статья');
		}
	}

	async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const article = await this.articleService.changeArticle(id, req.body);
			if (!article) this.send(res, 404, 'Iltimos qaytadan urinib ko`ring');
			else {
				this.ok(res, {
					status: true,
					message: 'Yangilandi',
					data: article,
				});
			}
		} catch (err) {
			this.send(res, 500, 'Iltimos qaytadan urinib ko`ring');
		}
	}

	async findAllArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articles = await this.articleService.getAll();
			this.ok(res, { articles });
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении статей');
		}
	}

	async findArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const article = await this.articleService.getById(id);
			if (!article) {
				this.send(res, 400, 'Статья не найдена');
				return;
			}
			this.ok(res, { article });
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении статей');
		}
	}

	async findByFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.articleService.getByValues(req.body);

			this.ok(res, {
				status: true,
				message: 'Статьи успешно получены',
				data: data,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении статей');
		}
	}
}
