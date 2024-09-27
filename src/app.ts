import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './common/config/config.service.interface';
import { IExeptionFilter } from './common/errors/exeption.filter.interface';
import { ConfigPassportService } from './common/config/config.passport.service';
import { IUsersRepository, UserController } from './modules/users';
import { PrismaService } from './database/prisma.service';
import { ILogger } from './common/logger/logger.interface';
import session from 'express-session';
import passport from 'passport';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number | string;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.UserRepository) private userRepository: IUsersRepository,
		@inject(TYPES.ConfigPassportService) private configPassportService: ConfigPassportService,
	) {
		this.app = express();
		this.port = this.configService.get('PORT') || 9000;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(
			session({
				secret: this.configService.get('SECRET'),
				resave: false,
				saveUninitialized: false,
			}),
		);
		this.app.use(passport.session());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use(
			'/oauth/login/google',
			passport.authenticate('google', { scope: ['profile', 'email'] }),
		);
		this.app.get('/oauth/redirect/google', passport.authenticate('google'), (req, res) => {
			res.redirect('https://najottalim.uz/');
		});
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
