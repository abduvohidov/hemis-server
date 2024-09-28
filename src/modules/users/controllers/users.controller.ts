import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger';
import { HTTPError } from '../../../errors';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { UserLoginDto } from '../dto/user-login.dto';
import { IUserService, UserUpdateDto } from '../index';
import { NextFunction, Request, Response } from 'express';
import { UserRegisterDto } from '../dto/user-register.dto';
import { IUserController } from './users.controller.interface';
import { BaseController, ValidateMiddleware } from '../../../common';

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
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},

			{
				path: '/delete/:id',
				method: 'delete',
				func: this.deleteUser,
				middlewares: [],
			},

			{
				path: '/create',
				method: 'post',
				func: this.createUser,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},

			{
				path: '/update/:id',
				method: 'put',
				func: this.updateUser,
				middlewares: [],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		const email = req.body.email;
		if (!result) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const user = await this.userService.getUserByEmail(email);
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));

		switch (user?.role) {
			case 'admin':
				this.ok(res, { jwt, redirectTo: 'admin' });
				break;
			case 'director':
				this.ok(res, { jwt, redirectTo: 'director' });
				break;
			case 'teamLead':
				this.ok(res, { jwt, redirectTo: 'teamLead' });
				break;
			case 'teacher':
				this.ok(res, { jwt, redirectTo: 'teacher' });
				break;
			case 'student':
				this.ok(res, { jwt, redirectTo: 'student' });
				break;

			default:
				this.ok(res, { jwt, redirectTo: 'unknown user ' });
				break;
		}
	}

	async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const result = await this.userService.removeUser(id);
		if (!result) {
			return next(new HTTPError(404, 'Такого пользователя нету', 'delete'));
		}
		this.ok(res, { result });
	}

	async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.prepareUser(req.body);
		if (!result) {
			return next(new HTTPError(400, 'Пж проверьте данные', 'create'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));

		this.ok(res, { result, jwt });
	}

	async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);

		const result = await this.userService.changeUser(id, req.body);
		if (!result) {
			return next(new HTTPError(400, 'Пж проверьте данные', 'update'));
		}
		this.ok(res, { result });
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
