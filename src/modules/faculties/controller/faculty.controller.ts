import 'reflect-metadata';
import { TYPES } from '../../../types';
import { ROLES } from './../../../types';
import { ILogger } from '../../../logger';
import { HTTPError } from '../../../errors';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../../config';
import { EducationService } from '../../education';
import { NextFunction, Request, Response } from 'express';
import { FacultyService } from '../service/faculty.service';
import { FacultyCreateDto } from '../dto/faculty-create.dto';
import { IFacultyController } from './faculty.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';

@injectable()
export class FacultyController extends BaseController implements IFacultyController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.FacultyService) private facultyService: FacultyService,
		@inject(TYPES.EducationService) private educationService: EducationService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/createOrFind',
				method: 'post',
				func: this.createOrFind,
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
		]);
	}

	async createOrFind(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { masterId, name } = req.body;

			const faculty = await this.facultyService.createOrFind(name);
			// Get education by masterId
			const education = await this.educationService.getByMasterId(Number(masterId));
			if (education) {
				// Update education with the newly created facultyId
				await this.educationService.changeEducation(education?.id, { facultyId: faculty?.id });
				this.ok(res, {
					message: 'Fakultet qo`shildi',
					data: faculty,
				});
				return;
			}

			this.send(res, 409, 'Fakultet mavjud');
		} catch (e) {
			this.send(res, 500, e);
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
