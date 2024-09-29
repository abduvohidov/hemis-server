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
				path: '/previous-university',
				method: 'get',
				func: this.findByPreviousUniversity,
			},
			{
				path: '/graduation-year',
				method: 'get',
				func: this.findGraduationYear,
			},
			{
				path: '/diplom-number',
				method: 'get',
				func: this.findGraduationYear,
			},
			{
				path: '/previous-specialization',
				method: 'get',
				func: this.findPreviousSpecialization,
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

	async findByPreviousUniversity(
		{ body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!body.previousUniversity) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}
		const data = await this.bachelorService.findByPreviousUniversity(body.previousUniversity);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно получено',
			data,
		});
	}

	async findGraduationYear({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body.graduationYear) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}
		const data = await this.bachelorService.findGraduationYear(body.graduationYear);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно получено',
			data,
		});
	}

	async findDiplomaNumber({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body.diplomaNumber) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}
		const data = await this.bachelorService.findById(body.diplomaNumber);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно получено',
			data,
		});
	}

	async findPreviousSpecialization(
		{ body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!body.previousSpecialization) {
			return next(new HTTPError(422, 'Такой бакалавр не существует'));
		}
		const data = await this.bachelorService.findPreviousSpecialization(body.previousSpecialization);

		this.ok(res, {
			status: true,
			message: 'Бакалавр успешно получено',
			data,
		});
	}
}
