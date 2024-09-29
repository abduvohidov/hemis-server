import { inject, injectable } from 'inversify';
import { BaseController, ValidateMiddleware } from '../../../common';
import { ILogger } from '../../../logger';
import { TYPES } from '../../../types';
import { FacultyService } from '../service/faculty.service';
import { IFacultyController } from './faculty.controller.interface';
import { IConfigService } from '../../../config';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../../../errors';
import 'reflect-metadata';

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
				middlewares: [new ValidateMiddleware(FacultyCreateDto)],
			},
			{
				path: '/all',
				method: 'get',
				func: this.find,
			},
			{
				path: '/id',
				method: 'get',
				func: this.findById,
			},
			{
				path: '/name',
				method: 'get',
				func: this.findByName,
			},
			{
				path: '/update',
				method: 'patch',
				func: this.update,
			},
			{
				path: '/delete',
				method: 'delete',
				func: this.delete,
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
