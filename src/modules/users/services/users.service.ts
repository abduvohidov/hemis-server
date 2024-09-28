import { TYPES } from '../../../types';
import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../../config';
import { IUsersRepository, User } from '../index';
import { UserLoginDto } from '../dto/user-login.dto';
import { IUserService } from './users.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.findByEmail(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.findByEmail(email);
		console.log(existedUser);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password as string);
		console.log(password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.findByEmail(email);
	}
}
