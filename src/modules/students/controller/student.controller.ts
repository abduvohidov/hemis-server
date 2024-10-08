import fs from 'fs';
import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { ILogger } from '../../../logger';
import { IStudentService } from '../index';
import { HTTPError } from '../../../errors';
import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { ROLES, TYPES } from './../../../types';
import { IConfigService } from '../../../config';
import { Request, Response, NextFunction } from 'express';
import { StudentRegisterDto } from '../dto/student-register.dto';
import { IStudentController } from './student.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';

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
				path: '/download/sheets',
				method: 'get',
				func: this.downloadXlsxFile,
			},
			{
				path: '/:id',
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
				path: '/update/:id',
				method: 'put',
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
				path: '/filter',
				method: 'post',
				func: this.getByFilters,
				// middlewares: [
				// 	new AuthMiddleware(this.configService.get('SECRET')),
				// 	new VerifyRole(new PrismaClient(), [
				// 		ROLES.admin,
				// 		ROLES.director,
				// 		ROLES.teacher,
				// 		ROLES.teamLead,
				// 	]),
				// ],
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
		const { id } = req.params;
		const data = await this.studentService.getById(Number(id));

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
		const id = Number(req.params.id);

		if (!data) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		await this.studentService.update(id, data);

		this.ok(res, {
			status: true,
			message: 'Магистрант успешно обновлено',
			data: data,
		});
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = req.params.id;

		if (!id) {
			return next(new HTTPError(422, 'Такой магистрант не существует'));
		}

		await this.studentService.delete(Number(id));
		this.ok(res, {
			status: true,
			message: 'Магистрант успешно удалено',
		});
	}

	async downloadXlsxFile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const students = await this.studentService.getAll();
			const filePath = await this.studentService.generateXlsxFile(students);

			res.download(filePath, (err) => {
				if (err) {
					console.error('Ошибка при скачивании файла:', err);
					return this.send(res, 500, 'Ошибка при скачивании файла.');
				}

				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr) {
						console.error('Ошибка при удалении файла:', unlinkErr);
					}
				});
			});
		} catch (error) {
			console.error('Ошибка при обработке запроса:', error);

			this.send(res, 400, 'unknown');
		}
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
