import 'reflect-metadata';
import { IEducationService } from '..';
import { ILogger } from '../../../logger';
import { inject, injectable } from 'inversify';
import { ROLES, TYPES } from './../../../types';
import { BaseController } from '../../../common';
import { IConfigService } from './../../../config';
import { PrismaClient } from '@prisma/client';
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
				method: 'post',
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
		const education = await this.educationService.prepareEducation(req.body);
		if (!education) {
			this.send(res, 400, 'This education has already ');
			return;
		}
		this.ok(res, { education });
	}
	async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const education = await this.educationService.removeEducation(id);
		if (!education) {
			this.send(res, 400, 'This education does not exists ');
			return;
		}
		this.ok(res, { education });
	}
	async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const education = await this.educationService.changeEducation(id, req.body);
		if (!education) {
			this.send(res, 400, 'This education does not exists ');
			return;
		}
		this.ok(res, { education });
	}
	async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getAll();
		if (!education) {
			this.send(res, 400, 'Something went wrong');
			return;
		}
		this.ok(res, { education });
	}
	async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const education = await this.educationService.getById(id);
		if (!education) {
			this.send(res, 400, 'This education does not exists');
			return;
		}
		this.ok(res, { education });
	}
	async findByFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByFilters(req.body);
		if (!education) {
			this.send(res, 400, 'Education got');
			return;
		}
		this.ok(res, { education });
	}
}
