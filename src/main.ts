import { App } from './app';
import { TYPES } from './types';
import { LoggerService, ILogger } from './logger';
import { ConfigService, IConfigService } from './config';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter, IExeptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import {
	IUserController,
	IUserService,
	IUsersRepository,
	UserController,
	UserService,
	UsersRepository,
} from './modules/users';
import { IStudentRepository, StudentRepository } from './modules/students';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService);

	bind<IUsersRepository>(TYPES.UserRepository).to(UsersRepository).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService);

	bind<IStudentRepository>(TYPES.StudentRepository).to(StudentRepository).inSingletonScope();

	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
