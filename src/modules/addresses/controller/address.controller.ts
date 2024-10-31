import 'reflect-metadata';
import { IAddress } from '../types';
import { Master } from '../../masters';
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
				path: '/id/:id',
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

	async create(
		{ body }: Request<{}, {}, AddressCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.addressService.create(body);

			if (!data) {
				return next(new HTTPError(422, 'Не удалось создать адрес, проверьте добавляемые данные'));
			}

			this.ok(res, {
				status: true,
				message: 'Address qo`shildi',
				data,
			});
		} catch (error) {
			this.send(res, 500, 'Kutilmagan xato');
		}
	}

	async find(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data = await this.addressService.find();

			if (!data) {
				return next(new HTTPError(422, 'Такой адресс не существует'));
			}

			this.ok(res, {
				status: true,
				message: 'Адресс успешно получено',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении адрессов:', error);
			next(error);
		}
	}

	async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const data = await this.addressService.findById(Number(id));

			if (!data) {
				return next(new HTTPError(422, 'Такой адресс не существует'));
			}

			this.ok(res, {
				status: true,
				message: 'Адресс успешно получено',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении адресса:', error);
			next(error);
		}
	}

	async findByFilter({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const address = await this.addressService.findByFilters(body);
			const data: Array<Master> = [];

			if (address.length) {
				address.forEach((address: IAddress) => {
					const master = address['master'] as unknown as Master;
					if (master) {
						data.push(master);
					}
				});
			}

			this.ok(res, {
				status: true,
				message: 'Адресс успешно получено',
				data,
			});
		} catch (error) {
			console.error('Ошибка при получении адресса:', error);
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.params;
		const data = req.body;

		try {
			if (!id || isNaN(Number(id))) {
				this.send(res, 422, 'Такой адрес не существует');
				return;
			}

			const updatedAddress = await this.addressService.update(Number(id), data);

			if (!updatedAddress) {
				this.send(res, 404, 'Адрес не найден для обновления');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Адрес успешно обновлен',
				data: updatedAddress,
			});
		} catch (err) {
			this.send(
				res,
				500,
				'Что-то пошло не так при обновлении адреса, проверьте добавляемые данные',
			);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			if (!id || isNaN(Number(id))) {
				this.send(res, 422, 'Такой адрес не существует');
				return;
			}

			const deletedAddress = await this.addressService.delete(Number(id));
			if (!deletedAddress) {
				this.send(res, 404, 'Адрес не найден для удаления');
				return;
			}

			this.ok(res, {
				status: true,
				message: 'Адрес успешно удален',
			});
		} catch (error) {
			this.send(res, 500, 'Ошибка при удалении адреса');
		}
	}
}
