import 'reflect-metadata';
import { TYPES } from '../../../types';
import { ROLES } from './../../../types';
import { ILogger } from '../../../logger';
import { HTTPError } from '../../../errors';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../../config';
import { NextFunction, Request, Response } from 'express';
import { FacultyService } from '../service/faculty.service';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { IFacultyController } from './faculty.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';

@injectable()
export class FacultyController extends BaseController implements IFacultyController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.FacultyService) private facultyService: FacultyService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.create,
				middlewares: [
					new ValidateMiddleware(FacultyCreateDto),
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
				func: this.filterByName,
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
				path: '/findByName',
				method: 'post',
				func: this.findByName,
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
		]);
	}

	async create(
		{ body }: Request<{}, {}, FacultyCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.facultyService.create(body);
			if (!data) {
				return next(new HTTPError(422, 'Такой факультет уже существует'));
			}

			this.ok(res, {
				status: true,
				message: 'Факультет успешно создано',
				data,
			});
		} catch (e) {
			this.send(
				res,
				500,
				'Что-то пошло не так при добавлении пользователя, проверьте добавляемые данные',
			);
		}
	}

	async find(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.facultyService.find();
			this.ok(res, {
				status: true,
				message: 'Факультет успешно получено',
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const data = await this.facultyService.findById(id);

			if (!data) {
				return next(new HTTPError(422, 'Такой факультет не существует'));
			}

			this.ok(res, {
				status: true,
				message: 'Факультет успешно получено',
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async filterByName(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { name } = req.body;
			const data = await this.facultyService.filterByName(name);

			this.ok(res, {
				status: true,
				message: 'Факультет успешно получено',
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async findByName(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { name } = req.body;
			const data = await this.facultyService.findByName(name);
			if (!data) {
				this.send(res, 404, 'Iltimos fakultet yarating');
				return;
			}
			this.ok(res, {
				status: true,
				message: 'Факультет успешно получено',
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = req.body;
			const id = Number(req.params.id);

			if (!data) {
				return next(new HTTPError(422, 'Такой факультет не существует'));
			}

			await this.facultyService.update(id, data);

			this.ok(res, {
				status: true,
				message: 'Факультет успешно обновлено',
				data: data,
			});
		} catch (e) {
			this.send(
				res,
				500,
				'Что-то пошло не так при обновлении пользователя, проверьте добавляемые данные',
			);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);

			if (!id) {
				return next(new HTTPError(422, 'Такой факультет не существует'));
			}

			await this.facultyService.delete(id);
			this.ok(res, {
				status: true,
				message: 'Факультет успешно удалено',
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при удаление факультета');
		}
	}
}
