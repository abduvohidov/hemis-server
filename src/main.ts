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
import {
	IMasterController,
	IMasterRepository,
	IMasterService,
	MasterController,
	MasterRepository,
	MasterService,
} from './modules/masters';
import {
	AddressController,
	AddressRepository,
	AddressService,
	IAddressController,
	IAddressRepository,
	IAddressService,
} from './modules/addresses';
import {
	EducationController,
	EducationRepository,
	EducationService,
	IEducationController,
	IEducationRepository,
	IEducationService,
} from './modules/education';
import {
	FacultyController,
	FacultyRepository,
	FacultyService,
	IFacultyController,
	IFacultyRepository,
	IFacultyService,
} from './modules/faculties';
import {
	BachelorController,
	BachelorService,
	BacherlorRepository,
	IBachelorController,
	IBachelorRepository,
	IBachelorService,
} from './modules/bachelors';
import {
	ArticleController,
	ArticleService,
	ArticleRepository,
	IArticleController,
	IArticleRepository,
	IArticleService,
} from './modules/articles';

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

	bind<IMasterRepository>(TYPES.MasterRepository).to(MasterRepository).inSingletonScope();
	bind<IMasterService>(TYPES.MasterService).to(MasterService).inSingletonScope();
	bind<IMasterController>(TYPES.MasterController).to(MasterController).inSingletonScope();

	bind<IAddressRepository>(TYPES.AddressRepository).to(AddressRepository).inSingletonScope();
	bind<IAddressService>(TYPES.AddressService).to(AddressService).inSingletonScope();
	bind<IAddressController>(TYPES.AddressController).to(AddressController).inSingletonScope();

	bind<IEducationRepository>(TYPES.EducationRepository).to(EducationRepository).inSingletonScope();
	bind<IEducationService>(TYPES.EducationService).to(EducationService).inSingletonScope();
	bind<IEducationController>(TYPES.EducationController).to(EducationController).inSingletonScope();

	bind<IFacultyRepository>(TYPES.FacultyRepository).to(FacultyRepository).inSingletonScope();
	bind<IFacultyService>(TYPES.FacultyService).to(FacultyService).inSingletonScope();
	bind<IFacultyController>(TYPES.FacultyController).to(FacultyController).inSingletonScope();

	bind<IBachelorRepository>(TYPES.BachelorRepository).to(BacherlorRepository).inSingletonScope();
	bind<IBachelorService>(TYPES.BachelorService).to(BachelorService).inSingletonScope();
	bind<IBachelorController>(TYPES.BachelorController).to(BachelorController).inSingletonScope();

	bind<IArticleRepository>(TYPES.ArticleRepository).to(ArticleRepository).inSingletonScope();
	bind<IArticleService>(TYPES.ArticleService).to(ArticleService).inSingletonScope();
	bind<IArticleController>(TYPES.ArticleController).to(ArticleController).inSingletonScope();

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
