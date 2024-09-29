import 'reflect-metadata';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger';
import { injectable, inject } from 'inversify';
import { BaseController, ValidateMiddleware } from '../../../common';
import { Request, Response, NextFunction } from 'express';
import { IAddressController } from './address.controller.interface';
import { HTTPError } from '../../../errors';
import { AddressService } from '../service/address.service';
import { AddressCreateDto } from '../dto/address-create.dto';
import { IConfigService } from '../../../config';

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
				middlewares: [new ValidateMiddleware(AddressCreateDto)],
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
				path: '/country',
				method: 'get',
				func: this.findByCountry,
			},
			{
				path: '/region',
				method: 'get',
				func: this.findByRegion,
			},
			{
				path: '/address',
				method: 'get',
				func: this.findByAddress,
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

	async findByCountry({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.addressService.findByCountry(body.country);

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Адресс успешно получено',
			data,
		});
	}

	async findByRegion({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.addressService.findByRegion(body.region);

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
		}

		this.ok(res, {
			status: true,
			message: 'Адресс успешно получено',
			data,
		});
	}

	async findByAddress({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await this.addressService.findByAddress(body.address);

		if (!data) {
			return next(new HTTPError(422, 'Такой адресс не существует'));
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
