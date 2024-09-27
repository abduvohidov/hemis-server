import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { sign } from 'jsonwebtoken';
import { TYPES } from '../../../types';
import { IUserService } from '../services/users.service.interface';
import { BaseController } from '../../../common/baseController/base.controller';
import { ValidateMiddleware } from '../../../common/middlewares/validate.middleware';
import { AuthGuard } from '../../../common/middlewares/auth.guard';
import { HTTPError } from '../../../common/errors/http-error.class';
import { IConfigService } from '../../../common/config/config.service.interface';
import { ILogger } from '../../../common/logger/logger.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
			},
			{
				path: '/verifyEmail',
				method: 'post',
				func: this.verifyEmailAndSave,
			},
			{
				path: '/remove/:id',
				method: 'delete',
				func: this.remove,
			},
			{
				path: '/user/:id',
				method: 'get',
				func: this.getById,
			},
			{
				path: '/user-or-create',
				method: 'post',
				func: this.getOrCreate,
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'ошибка авторизации'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, { email: result.email, name: result.name });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user as string);
		this.ok(res, { name: userInfo?.name, email: userInfo?.email, id: userInfo?.id });
	}

	async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.params;
		const userInfoById = await this.userService.findById(id);
		if (!userInfoById) {
			return next(new HTTPError(404, 'Пользователь не найден'));
		}
		this.ok(res, { email: userInfoById.email, id: userInfoById.id });
	}

	async getOrCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id, profile } = req.body;
		const userInfo = await this.userService.findOrCreate(id, profile);

		if (!userInfo) {
			return next(new HTTPError(422, 'Не удалось создать или получить пользователя'));
		}
		this.ok(res, { email: userInfo.email, id: userInfo.id });
	}

	async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.params;
		const result = await this.userService.remove(id);
		if (!result) {
			return next(new HTTPError(422, 'Нет такого пользователь'));
		}
		this.ok(res, {
			status: true,
			message: 'пользователь успешно удалено',
		});
	}

	async verifyEmailAndSave(
		{ body }: Request<{}, {}, { code: number }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.verifyEmailAndSaveUser(body.code);

		if (!user) {
			this.send(res, 422, 'Code is invalid');
			return;
		}
		const token = await this.signJWT(user.email, this.configService.get('SECRET'));
		res.cookie('token', token);
		this.ok(res, { user, token });
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
