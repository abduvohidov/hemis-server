import 'reflect-metadata';
import { Server } from 'http';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './config';
import { IExeptionFilter } from './errors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { UserController } from './modules/users';
import { ILogger } from './logger/logger.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number | string;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserController) private userController: UserController,
	) {
		this.app = express();
		this.port = this.configService.get('PORT') || 9000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
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
