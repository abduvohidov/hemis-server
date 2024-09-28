import { UserModel } from '@prisma/client';
import { UserLoginDto, UserRegisterDto, UserUpdateDto } from '../index';

export interface IUserService {
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	removeUser: (id: number) => Promise<{ email: string } | null>;
	changeUser: (id: number, dto: UserUpdateDto) => Promise<UserModel | null>;
	getUserByEmail: (email: string) => Promise<UserModel | null>;
	prepareUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
}
