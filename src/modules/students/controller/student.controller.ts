import { injectable, inject } from 'inversify';
import { BaseController, ValidateMiddleware } from '../../../common';
import { IStudentController } from './student.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../types';
import { IStudentService } from '../service/student.service.interface';
import { ILogger } from '../../../logger';
import { IConfigService } from '../../../config';
import { sign } from 'jsonwebtoken';
import { HTTPError } from '../../../errors';
import { StudentRegisterDto } from '../dto/student-register.dto';
import 'reflect-metadata';

injectable();
export class StudentController extends BaseController implements IStudentController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.StudentService) private studentService: IStudentService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(StudentRegisterDto)],
			},
			{
				path: '/all',
				method: 'get',
				func: this.getAll,
			},
			{
				path: '/email',
				method: 'get',
				func: this.getByEmail,
			},
			{
				path: '/id',
				method: 'get',
				func: this.getById,
			},
			{
				path: '/passport-number',
				method: 'get',
				func: this.getByPassportNumber,
			},
			{
				path: '/jshshr',
				method: 'get',
				func: this.getByJshshr,
			},
			{
				path: '/jshshr',
				method: 'get',
				func: this.getByJshshr,
			},
			{
				path: '/last-name',
				method: 'get',
				func: this.getByLastName,
			},
			{
				path: '/first-name',
				method: 'get',
				func: this.getByFirstName,
			},
			{
				path: '/middle-name',
				method: 'get',
				func: this.getByMiddleName,
			},
			{
				path: '/nationality',
				method: 'get',
				func: this.getByNationality,
			},
			{
				path: '/gender',
				method: 'get',
				func: this.getByGender,
			},
			{
				path: '/phone-number',
				method: 'get',
				func: this.getByPhoneNumber,
			},
			{
				path: '/parent-phone-number',
				method: 'get',
				func: this.getByParentPhoneNumber,
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

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.create(req.body);
		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант уже существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Магистрант успешно создано',
			data,
		});
	}

	async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getAll();

		if (!data) {
			return next(new HTTPError(422, 'Магистранты не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистранты успешно получено',
			data,
		});
	}

	async getByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByEmail(req.body.email);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getById(req.body.id);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByPassportNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByPassportNumber(req.body.passportNumber);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByJshshr(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByJshshr(req.body.jshshr);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByLastName(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByLastName(req.body.lastName);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByFirstName(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByFirstName(req.body.firstName);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByMiddleName(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByMiddleName(req.body.middleName);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByNationality(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByNationality(req.body.nationality);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByGender(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByGender(req.body.gender);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByPhoneNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByPhoneNumber(req.body.phoneNumber);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async getByParentPhoneNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByParentPhoneNumber(req.body.parentPhoneNumber);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно получено',
			data,
		});
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = req.body;

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		await this.studentService.update(data.id, data);

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно обновлено',
			data: data,
		});
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.body;

		if (!id) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		await this.studentService.delete(id);
		this.ok(res, {
			status: true,
			message: 'Магистрант успешно удалено',
		});
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
