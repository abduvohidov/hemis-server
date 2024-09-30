import 'reflect-metadata';
import { ILogger } from './../../../logger';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES, ROLES } from './../../../types';
import { IConfigService } from '../../../config';
import { NextFunction, Request, Response } from 'express';
import { IArticleService, CreateArticleDto } from '../index';
import { IArticleController } from './article.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';

@injectable()
export class ArticleController extends BaseController implements IArticleController {
	private readonly secret4Token: string;
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ArticleService) private articleService: IArticleService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.secret4Token = this.configService.get('SECRET');
		this.bindRoutes([
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
	async postArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		const article = await this.articleService.prepareArticle(req.body);
		if (!article) {
			this.send(res, 400, 'Check info');
			return;
		}
		this.ok(res, { article });
	}
	async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const article = await this.articleService.removeArticle(id);
		if (!article) {
			this.send(res, 404, 'Article not found');
			return;
		}
		this.ok(res, { article });
	}

	async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const article = await this.articleService.changeArticle(id, req.body);
		if (!article) {
			this.send(res, 404, 'Article not found');
			return;
		}
		this.ok(res, { article });
	}

	async findAllArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
		const articles = await this.articleService.getAll();
		this.ok(res, { articles });
	}

	async findArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const article = await this.articleService.getById(id);
		if (!article) {
			this.send(res, 400, 'Article not found');
			return;
		}
		this.ok(res, { article });
	}
	async findByFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
		const articles = await this.articleService.getByValues(req.body);
		this.ok(res, { articles });
	}
}
