import 'reflect-metadata';
import { ILogger } from '../../../logger';
import { HTTPError } from '../../../errors';
import { ROLES, TYPES } from '../../../types';
import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../service/address.service';
import { AddressCreateDto } from '../dto/address-create.dto';
import { IAddressController } from './address.controller.interface';
import { AuthMiddleware, BaseController, ValidateMiddleware, VerifyRole } from '../../../common';

@injectable()
export class AddressController extends BaseController implements IAddressController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.AddressService) private addressService: AddressService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.create,
				middlewares: [
					new ValidateMiddleware(AddressCreateDto),
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
				path: '/filter',
				method: 'post',
				func: this.findByFilter,
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
		{ body }: Request<{}, {}, AddressCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const data = await this.addressService.create(body);

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс уже существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Адресс успешно создано',
			data,
		});
	}

	async find(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.addressService.find();

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Адресс успешно получено',
			data,
		});
	}

	async findById({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.addressService.findById(body.id);

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Адресс успешно получено',
			data,
		});
	}

	async findByFilter({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.addressService.findByFilters(body);
		if (!data) {
			return next(new HTTPError(422, 'Такой студент не существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Адресс успешно получено',
			data,
		});
	}

	async update({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = body;

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
		}

		await this.addressService.update(data.id, data);

		this.ok(res, {
			status: true,
			message: 'Адресс успешно обновлено',
			data: data,
		});
	}

	async delete({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!body.id) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
		}

		await this.addressService.delete(body.id);
		this.ok(res, {
			status: true,
			message: 'Адресс успешно удалено',
		});
	}
}
