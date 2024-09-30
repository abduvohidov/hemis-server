import { ROLES } from './../../../types';
import { PrismaClient } from '@prisma/client';
import { VerifyRole } from './../../../common/middlewares/verify-role.middleware';
import { injectable, inject } from 'inversify';
import { AuthMiddleware, BaseController, ValidateMiddleware } from '../../../common';
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
				middlewares: [
					new ValidateMiddleware(StudentRegisterDto),
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
				func: this.getAll,
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
				path: '/email',
				method: 'get',
				func: this.getByEmail,
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
				func: this.getById,
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
						ROLES.student,
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
				path: '/filter',
				method: 'post',
				func: this.getByFilters,
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
	async getByFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.studentService.getByFilters(req.body);

		this.ok(res, {
			status: true,
			message: 'Магистранты успешно получены',
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
