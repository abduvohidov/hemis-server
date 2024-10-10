import 'reflect-metadata';
import cors from 'cors';
import { Server } from 'http';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './config';
import cookieParser from 'cookie-parser';
import { IExeptionFilter } from './errors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { UserController } from './modules/users';
import { ILogger } from './logger/logger.interface';
import { AddressController } from './modules/addresses';
import { EducationController } from './modules/education';
import { FacultyController } from './modules/faculties';
import { StudentController } from './modules/students';
import { BachelorController } from './modules/bachelors';
import { ArticleController } from './modules/articles';

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
		@inject(TYPES.StudentController) private studentController: StudentController,
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
		this.app.use('/students', this.studentController.router);
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
