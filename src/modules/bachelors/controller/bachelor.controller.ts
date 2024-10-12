import { ROLES } from './../../../types';
import { VerifyRole } from './../../../common/middlewares/verify-role.middleware';
import { AuthMiddleware } from './../../../common/middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../common';
import { IBachelorController } from './bachelor.controller.interface';
import { TYPES } from '../../../types';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../../logger';
import { IConfigService } from '../../../config';
import { BachelorCreateDto } from '../dto/bacherlor-create.dto';
import { IBachelorService } from '../service/bachelor.service.interface';
import { HTTPError } from '../../../errors';
import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';

@injectable()
export class BachelorController extends BaseController implements IBachelorController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.BachelorService) private bachelorService: IBachelorService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.create,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/update',
				method: 'patch',
				func: this.update,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/delete',
				method: 'delete',
				func: this.delete,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
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
				func: this.find,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/id',
				method: 'get',
				func: this.findById,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
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
				func: this.findByFilter,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
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

	async create(
		{ body }: Request<{}, {}, BachelorCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const data = await this.bachelorService.create(body);

		if (!data) {
			return next(new HTTPError(422, 'Такой бакалавр уже существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно создано',
			data,
		});
	}

	async update({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body) {
			return next(new HTTPError(422, 'Такой бакалавр уже существует'));
		}

		const data = await this.bachelorService.update(body.id, body);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно обновлено',
			data,
		});
	}

	async delete({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body.id) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}

		const data = await this.bachelorService.delete(body.id);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно удалено',
			data,
		});
	}

	async find({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}
		const data = await this.bachelorService.find();

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно получено',
			data,
		});
	}

	async findById({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body.id) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}
		const data = await this.bachelorService.findById(body.id);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно получено',
			data,
		});
	}

	async findByFilter({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.bachelorService.findByFilter(body);

		this.ok(res, {
			status: true,
			message: 'Бакалавры успешно получены',
			data,
		});
	}
}
