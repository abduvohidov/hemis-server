import { ROLES } from './../../../types';
import { inject, injectable } from 'inversify';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';
import { ILogger } from '../../../logger';
import { TYPES } from '../../../types';
import { FacultyService } from '../service/faculty.service';
import { IFacultyController } from './faculty.controller.interface';
import { IConfigService } from '../../../config';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../../../errors';
import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';

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
				path: '/name',
				method: 'get',
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
		]);
	}

	async create(
		{ body }: Request<{}, {}, FacultyCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const data = await this.facultyService.create(body);
		if (!data) {
			return next(new HTTPError(422, 'Такой факультет уже существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Факультет успешно создано',
			data,
		});
	}

	async find(
		{ body }: Request<{}, {}, FacultyCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const data = await this.facultyService.find();

		if (!data) {
			return next(new HTTPError(422, 'Такой факультет не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Факультет успешно получено',
			data,
		});
	}

	async findById({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.facultyService.findById(body.id);

		if (!data) {
			return next(new HTTPError(422, 'Такой факультет не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Факультет успешно получено',
			data,
		});
	}

	async findByName({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.facultyService.findByName(body.name);

		if (!data) {
			return next(new HTTPError(422, 'Такой факультет не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Факультет успешно получено',
			data,
		});
	}

	async update({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = body;

		if (!data) {
			return next(new HTTPError(422, 'Такой факультет не существует'));
		}

		await this.facultyService.update(data.id, data);

		this.ok(res, {
			status: true,
			message: 'Факультет успешно обновлено',
			data: data,
		});
	}

	async delete({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body.id) {
			return next(new HTTPError(422, 'Такой факультет не существует'));
		}

		await this.facultyService.delete(body.id);
		this.ok(res, {
			status: true,
			message: 'Факультет успешно удалено',
		});
	}
}
