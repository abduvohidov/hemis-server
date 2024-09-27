import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../models/user.entity';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../../../types';
import { IRedisService } from '../../../common/services/redis/redis.service.interface';
import { IEmailService } from '../../../common/services/email/email.service.interface';
import { IConfigService } from '../../../common/config/config.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.RedisService) private redisService: IRedisService,
		@inject(TYPES.EmailService) private emailService: IEmailService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<Omit<UserModel, 'id'> | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}

		const code = Math.floor(Math.random() * 1000000);
		await this.emailService.sendEmail(email, 'Verification code', 'Please submit code', code);

		await this.redisService.set(code.toString(), JSON.stringify(newUser), 180);
		await this.usersRepository.create(newUser);
		return newUser;
	}

	async remove(id: string): Promise<UserModel | null> {
		const existedUser = await this.usersRepository.findById(id);
		if (!existedUser) {
			return null;
		}
		return await this.usersRepository.remove(id);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async verifyEmailAndSaveUser(code: number): Promise<UserModel | null> {
		const userFromRedis = await this.redisService.get(code.toString());
		if (userFromRedis) {
			return JSON.parse(userFromRedis);
		}
		return null;
	}

	async findById(id: string): Promise<UserModel | null> {
		return this.usersRepository.findById(id);
	}

	async findOrCreate(id: string, profile: any): Promise<UserModel | null> {
		const { email, given_name } = profile._json;
		const existedUser = await this.usersRepository.find(email);

		if (existedUser) {
			return existedUser;
		}

		return this.usersRepository.create({ email, name: given_name });
	}
}
