import 'reflect-metadata';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from './types';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { IConfigService } from './config';
import { IExeptionFilter } from './errors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { UserController } from './modules/users';
import { MasterController } from './modules/masters';
import { ArticleController } from './modules/articles';
import { AddressController } from './modules/addresses';
import { FacultyController } from './modules/faculties';
import { BachelorController } from './modules/bachelors';
import { EducationController } from './modules/education';
import { ILogger } from './logger';

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
		@inject(TYPES.MasterController) private masterController: MasterController,
		@inject(TYPES.AddressController) private addressController: AddressController,
		@inject(TYPES.EducationController) private educationController: EducationController,
		@inject(TYPES.FacultyController) private facultyController: FacultyController,
		@inject(TYPES.BachelorController) private bachelorController: BachelorController,
		@inject(TYPES.ArticleController) private articleController: ArticleController,
	) {
		this.app = express();
		this.port = this.configService.get('PORT') || 9000;
	}

	useMiddleware(): void {
		this.app.use(
			cors({
				origin: ['http://localhost:5173', 'http://localhost:5174'],
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				credentials: true,
			}),
		);
		this.app.use(json());
		this.app.use(cookieParser());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/masters', this.masterController.router);
		this.app.use('/addresses', this.addressController.router);
		this.app.use('/educations', this.educationController.router);
		this.app.use('/faculties', this.facultyController.router);
		this.app.use('/bachelors', this.bachelorController.router);
		this.app.use('/articles', this.articleController.router);
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
