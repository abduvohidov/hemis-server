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
	findByCountry: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
