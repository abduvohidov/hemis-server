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
				path: '/update/:id',
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
				path: '/delete/:id',
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
				path: '/:id',
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
		try {
			const data = await this.bachelorService.create(body);

			if (!data) {
				return next(new HTTPError(422, 'Такой бакалавр уже существует'));
			}

			this.ok(res, {
				status: true,
				message: 'Бакалавр успешно создано',
				data,
			});
		} catch (error) {
			this.send(
				res,
				500,
				'Что-то пошло не так при добавлении бакалавра, проверьте добавляемые данные',
			);
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const { body } = req;

			if (isNaN(id) || id <= 0) {
				return next(new HTTPError(422, 'Некорректный ID бакалавра'));
			}

			const data = await this.bachelorService.update(id, body);

			if (!data) {
				return next(new HTTPError(404, 'Такой бакалавр не найден'));
			}

			this.ok(res, {
				status: true,
				message: 'Бакалавр успешно обновлен',
				data,
			});
		} catch (error) {
			this.send(
				res,
				500,
				'Что-то пошло не так при обновлении бакалавра, проверьте добавляемые данные',
			);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);

			if (isNaN(id) || id <= 0) {
				return next(new HTTPError(422, 'Некорректный ID бакалавра'));
			}

			const data = await this.bachelorService.delete(id);

			if (!data) {
				return next(new HTTPError(404, 'Такой бакалавр не найден'));
			}

			this.ok(res, {
				status: true,
				message: 'Бакалавр успешно удален',
				data,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при удалении бакалавра');
		}
	}

	async find({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!body) {
				return next(new HTTPError(422, 'Такой бакалавр не существует'));
			}
			const data = await this.bachelorService.find();

			this.ok(res, {
				status: true,
				message: 'Бакалавр успешно получено',
				data,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении бакалавр');
		}
	}

	async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			if (isNaN(id) || id <= 0) {
				return next(new HTTPError(422, 'Некорректный ID бакалавра'));
			}

			const data = await this.bachelorService.findById(id);
			if (!data) {
				return next(new HTTPError(404, 'Такой бакалавр не найден'));
			}

			this.ok(res, {
				status: true,
				message: 'Бакалавр успешно получен',
				data,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении бакалавра');
		}
	}

	async findByFilter({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.bachelorService.findByFilter(body);

			this.ok(res, {
				status: true,
				message: 'Бакалавры успешно получены',
				data,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении бакалавр');
		}
	}
}
