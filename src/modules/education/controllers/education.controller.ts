import 'reflect-metadata';
import { IEducation } from '../types';
import { IEducationService } from '..';
import { ILogger } from '../../../logger';
import { inject, injectable } from 'inversify';
import { ROLES, TYPES } from './../../../types';
import { BaseController } from '../../../common';
import { IConfigService } from './../../../config';
import { PrismaClient, Master } from '@prisma/client';
import { NextFunction, Response, Request } from 'express';
import { CreateEducationDto, UpdateEducationDto } from '../index';
import { IEducationController } from './education.controller.interface';
import { ValidateMiddleware, AuthMiddleware, VerifyRole } from '../../../common';

@injectable()
export class EducationController extends BaseController implements IEducationController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.EducationService) private educationService: IEducationService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.postEducation,
				middlewares: [
					new ValidateMiddleware(CreateEducationDto),
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
				path: '/findByMaster',
				method: 'post',
				func: this.findByMaster,
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
				func: this.deleteEducation,
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
				func: this.updateEducation,
				middlewares: [
					new ValidateMiddleware(UpdateEducationDto),
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
				func: this.findAll,
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
				func: this.findByFilters,
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

	async postEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const education = await this.educationService.prepareEducation(req.body);
			if (!education) {
				this.send(res, 400, 'Не удалось создать education');
				return;
			}
			this.ok(res, { education });
		} catch (err) {
			this.send(
				res,
				500,
				'Что-то пошло не так при добавлении education, проверьте добавляемые данные',
			);
		}
	}

	async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);

		try {
			if (isNaN(id) || id <= 0) {
				this.send(res, 400, 'Некорректный ID образования');
				return;
			}

			const education = await this.educationService.removeEducation(id);

			if (!education) {
				this.send(res, 404, 'Такое образование не существует');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Образование успешно удалено',
				data: education,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при удалении образования');
		}
	}

	async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const data = req.body;

			if (isNaN(id) || id <= 0) {
				this.send(res, 400, 'Некорректный ID образования');
				return;
			}

			const education = await this.educationService.changeEducation(id, data);

			if (!education) {
				this.send(res, 404, 'Такое образование не существует');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Образование успешно обновлено',
				data: education,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при обновлении образования');
		}
	}

	async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const education = await this.educationService.getAll();

			if (!education || education.length === 0) {
				this.send(res, 404, 'Образования не найдены');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Образования успешно получены',
				data: education,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении образований');
		}
	}

	async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);

			if (isNaN(id) || id <= 0) {
				this.send(res, 400, 'Некорректный ID образования');
				return;
			}

			const education = await this.educationService.getById(id);

			if (!education) {
				this.send(res, 404, 'Такое образование не существует');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Образование успешно получено',
				data: education,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении образования');
		}
	}

	async findByFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const education = await this.educationService.getByFilters(req.body);

			const data: Array<Master> = [];

			if (education && education.length > 0) {
				education.forEach((educationRecord: IEducation) => {
					const master = educationRecord.master as Master;
					if (master) {
						data.push(master);
					}
				});
			}

			this.ok(res, {
				status: true,
				message: 'Фильтрованные мастера успешно получены',
				data,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при фильтрации образований');
		}
	}

	async findByMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.body;
			if (!id || isNaN(Number(id))) {
				this.send(res, 400, 'Некорректный ID пользователя');
				return;
			}

			const education = await this.educationService.getByMasterId(id);
			if (!education) {
				this.send(res, 404, 'Пользователь не найден');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Образование по мастеру успешно получено',
				data: education,
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при получении данных образования');
		}
	}
}
