import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ConfigService } from './common/config/config.service';
import { IConfigService } from './common/config/config.service.interface';
import { ExeptionFilter } from './common/errors/exeption.filter';
import { IExeptionFilter } from './common/errors/exeption.filter.interface';
import { TYPES } from './types';
import { PrismaClient } from '@prisma/client';
import {
	IUserController,
	IUserService,
	IUsersRepository,
	UserController,
	UserService,
	UsersRepository,
} from './modules/users';
import { PrismaService } from './database/prisma.service';
import { RedisService } from './common/services/redis/redis.service';
import { IRedisService } from './common/services/redis/redis.service.interface';
import { IEmailService } from './common/services/email/email.service.interface';
import { EmailService } from './common/services/email/email.service';
import { LoggerService } from './common/logger/logger.service';
import { ILogger } from './common/logger/logger.interface';
import { ConfigPassportService } from './common/config/config.passport.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
	bind<IRedisService>(TYPES.RedisService).to(RedisService);
	bind<IEmailService>(TYPES.EmailService).to(EmailService);
	bind<ConfigPassportService>(TYPES.ConfigPassportService).to(ConfigPassportService);

	bind<IUsersRepository>(TYPES.UserRepository).to(UsersRepository).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService);

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
