import fs from 'fs';
import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { ILogger } from '../../../logger';
import { IMasterService, MasterRegisterDto } from '../index';
import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { ROLES, TYPES } from '../../../types';
import { IConfigService } from '../../../config';
import { Request, Response, NextFunction } from 'express';
import { IMasterController } from './master.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';
import { IAddressService } from '../../addresses';

injectable();
export class MasterController extends BaseController implements IMasterController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.MasterService) private masterService: IMasterService,
		@inject(TYPES.AddressService) private addressService: IAddressService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.create,
				middlewares: [
					new ValidateMiddleware(MasterRegisterDto),
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
				middlewares: [new AuthMiddleware(this.configService.get('SECRET'))],
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
		try {
			const data = await this.masterService.create(req.body);

			if (!data) {
				this.send(res, 422, 'Такой магистрант уже существует');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Магистрант успешно создано',
				data,
			});
		} catch (err) {
			this.send(
				res,
				500,
				'Что-то пошло не так при добавлении пользователя, проверьте добавляемые данные',
			);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.masterService.getAll();
			this.ok(res, {
				status: true,
				message: 'Магистранты успешно получены',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении магистрантов:', error);
			next(error);
		}
	}

	async getByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.masterService.getByEmail(req.body.email);

			if (!data) {
				this.send(res, 422, 'Такой магистрант не существует');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Магистрант успешно получено',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении магистрантов:', error);
			next(error);
		}
	}

	async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.params;
		try {
			const data = await this.masterService.getById(Number(id));

			if (!data) {
				this.send(res, 422, 'Такой магистрант не существует');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Магистрант успешно получено',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении магистрантов:', error);
			next(error);
		}
	}

	async getByFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.masterService.getByFilters(req.body);

			this.ok(res, {
				status: true,
				message: 'Магистранты успешно получены',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении магистрантов:', error);
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = req.body;
		const id = Number(req.params.id);

		try {
			if (!data) {
				this.send(res, 422, 'Пж проверьте данные');
				return;
			}

			const student = await this.masterService.update(id, data);
			const token = this.signJWT(student.email, this.configService.get('SECRET'));
			res.cookie('token', token);
			this.ok(res, {
				status: true,
				message: 'Магистрант успешно обновлено',
				data: student,
			});
		} catch (err) {
			this.send(
				res,
				500,
				'Что-то пошло не так при обновлении пользователя, проверьте добавляемые данные',
			);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = req.params.id;

		try {
			if (!id) {
				this.send(res, 422, 'Такой магистрант не существует');
				return;
			}

			await this.masterService.delete(Number(id));
			this.ok(res, {
				status: true,
				message: 'Магистрант успешно удалено',
			});
		} catch (error) {
			this.loggerService.error('Ошибка при удаление магистрантов');
			this.send(res, 500, 'Ошибка при удаление магистрантов');
		}
	}

	async downloadXlsxFile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const students = await this.masterService.getAll();
			const filePath = await this.masterService.generateXlsxFile(students);

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
